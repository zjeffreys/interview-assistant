from http.client import HTTPException
from dotenv import load_dotenv
import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from openai import OpenAI
import json  # Import json module
from prompts import prompts
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import shutil 


load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
app = FastAPI()
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
    print(user_input)
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

@app.post("/transcribe_audio")
async def transcribe_audio(audio_file: UploadFile = File(...)):
    print("TEST 1:")
    print(audio_file)
    if not audio_file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio file.")

    try:
        # Save the uploaded file to the /tmp directory
        temp_file_path = f"/tmp/{audio_file.filename}"
        with open(temp_file_path, "wb") as buffer:
            print("found file")
            shutil.copyfileobj(audio_file.file, buffer)
        # Initialize OpenAI client
        client = OpenAI()

        # Process the audio file with the API
        print("TESTING 2:", temp_file_path)
        with open(temp_file_path, "rb") as file:
            print("TESTING 2:", file)
            transcript_response = client.audio.transcriptions.create(
                model="whisper-1", 
                file=file, 
                response_format="text"
            )

        # Extract transcript from response
        # transcript = transcript_response.get("transcript", "No transcript available")

        # Clean up: Remove the temporary file
        os.remove(temp_file_path)

        return {"transcript": transcript_response or "Error transcribing audio to text"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
