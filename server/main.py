from http.client import HTTPException

from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import boto3
import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from openai import OpenAI
import json  # Import json module
from prompts import prompts
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import shutil 
from pydantic import BaseModel
import logging
from botocore.exceptions import ClientError



load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
app = FastAPI()
s3_client = boto3.client('s3')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)



@app.get("/")
async def ping():
    return {"message": "pinged server successfully"}

@app.post("/getInterviewQuestions")
async def getInterviewQuestions(user_input: str = Form(...)):
    print(f"/getInterviewQuestions")
    if not user_input:
        raise HTTPException(status_code=400, detail="User input is required")
    
    client = OpenAI()
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": prompts["interviewQuestionPrompt"]},
            {"role": "user", "content": user_input}
        ])

    # Parse the response string into a Python dictionary
    print(completion.choices[0])
    response_content = json.loads(completion.choices[0].message.content)
    return {"response": response_content}  # Return the parsed object

@app.post("/summarize_text_to_json")
async def summarizeText(transcribed_text: str = Form(...)):
    print(f"/summarize_text_to_json", transcribed_text)
    client = OpenAI()
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content":prompts["summaryPrompt"]},
            {"role": "user", "content": transcribed_text}
        ])

    # Parse the response string into a Python dictionary
    print(completion.choices[0])
    response_content = json.loads(completion.choices[0].message.content)
    return {"response": response_content}  # Return the parsed object

@app.post("/transcribe_audio") # bucket, file_name
async def transcribe_audio(bucket: str = Form(...), key: str = Form(...)):
    print("/transcribe_audio")
    print("Bucket:", bucket)
    print("Key:", key)
    try:
        # Define the path for the temporary file
        temp_file_path = f"/tmp/{key.split('/')[-1]}"

       # D ownload the file from S3 to the temporary file
        s3_client.download_file(bucket, key, temp_file_path)
        print(f"File downloaded from S3 to {temp_file_path}")

        client = OpenAI()
        with open(temp_file_path, "rb") as file:
            transcript_response = client.audio.transcriptions.create(
                model="whisper-1", 
                file=file, 
                response_format="text"
            )

        # Clean up: Remove the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print("Temporary file removed")

        return {"transcript": transcript_response}
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/generate-presigned-url")
def create_presigned_url(object_name: str, content_type, expiration: int = 3600):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    bucket_name = "my-interview-bucket"
    print("Generate a presigned URL to share an S3 object")
    print("Test:", object_name)
    object_name = object_name 
    try:
        print("content_type", content_type)
        response = s3_client.generate_presigned_url('put_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name, 
                                                            'ContentType': content_type
                                                            
                                                            },
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    print('response', response)
    print(type(response))
    return JSONResponse(content={"signed_url": response})

    return response

# Utils
def get_transcript_or_default(filename):
    audio_extensions = ['.webm', '.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac']
    name, extension = os.path.splitext(filename)
    if extension.lower() in audio_extensions:
        new_filename = name + '.txt'
        if os.path.exists(new_filename):
            with open(new_filename, 'r') as file:
                return file.read()
        else:
            return "demo transcript was not found on server"
    else:
        return f"The server received a weird filename: {filename}"

handler = Mangum(app)


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
