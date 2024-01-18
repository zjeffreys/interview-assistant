from http.client import HTTPException
from dotenv import load_dotenv
import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from openai import OpenAI
import json  # Import json module
from prompts import prompts

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
app = FastAPI()

@app.get("/")
async def ping():
    return {"message": "pinged server successfully"}

@app.post("/getInterviewQuestions")
async def getInterviewQuestions(user_input: str = Form(...)):
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

@app.post("/transcribe_audio")
async def transcribe_audio(audio_file: UploadFile = File(...)):
    # Ensure the file is an audio file
    if not audio_file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio file.")

    try:
        # Save the audio file temporarily
        temp_file_path = f"temp_{audio_file.filename}"
        with open(temp_file_path, 'wb') as buffer:
            buffer.write(await audio_file.read())
        
        with open(temp_file_path, 'rb') as file:
            client = OpenAI()
            transcript = client.audio.transcriptions.create(
                model="whisper-1", 
                file=file, 
                response_format="text"
            )

        # Remove the temporary file after processing
        os.remove(temp_file_path)

        return {"transcript": transcript}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
