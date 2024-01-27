from http.client import HTTPException
from dotenv import load_dotenv
import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from openai import OpenAI
import json  # Import json module
from prompts import prompts
from fastapi.middleware.cors import CORSMiddleware


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
async def summarizeText(filename: str = Form(...), transcribed_text: str = Form(...)):
    # if(filename == "club-owner-interview.mp3"):      
    #     print("demo pinged", filename)
    #     file_path = 'club_owner_insights.json'
    #     with open(file_path, 'r') as file:
    #         data = json.load(file)
    #         return {"response": data } 

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
    # fix this later, right now the demos content type is html/txt, while the real version is a blob. 
    if(audio_file.filename == 'club-owner-interview.mp3'):
        return {"transcript": get_transcript_or_default(audio_file.filename)}
   
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
