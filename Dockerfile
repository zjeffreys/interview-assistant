# Use an official Python runtime as a parent image
FROM public.ecr.aws/lambda/python:3.9


# Copy the contents of the server directory to the working directory
COPY server ${LAMBDA_TASK_ROOT}

# Install any needed packages specified in requirements.txt
RUN pip3 install -r requirements.txt

CMD [ "main.handler" ]
# Run the app
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
# CMD ["python", "main.py"]
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
