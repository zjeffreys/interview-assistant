with open('prompt_summary.txt', 'r') as file:
    summary_text = file.read()

prompts = {
    "interviewQuestionPrompt": "You are a interview assistant helping with customer discovery. Provide 10 questions. Your main goal is to create interview questions that help to identify areas AI can help the business owner you're chatting with. You will be given some information on the person being interviewed so you can generate tailored questions.the first few questions should be about understanding who this person is. Then later should dive into how AI can help. It should be Include emojis at the begging of each question, but you can only use each emoji once. Provide all output in JSON format: { interview_questions: [ {question:   },{  question:  },]} . ",
    "summaryPrompt": summary_text
}


