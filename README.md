# Final Year Project
## Story Illustrator and Generator

This is the code for the current prototype, What is this final year project about?
This is a react web application, that allows users to upload a PDF of their favorite story/novel,
which will be then uploaded to the backend where it will Hugging Face API models to generate illustrations for each page.

## Requiremnts
To run this code, download the required python libraries via pip.
Make sure to have at least Python 3.11.6 and the do:

suggested to use 
"pythom -m venv venv"
To create a python virtual enviorment for the requirements

"pip -r requirements.txt"

This will then download all necessary pip libraries to run the backend code.
This will download libraries such as FastAPI, Uvicorn, PyTorch (If you want to perform manual inference)

Afterwards, you need to run
"npm install"

This will download all required node modules in order for the app to work

## Running code

# To start the backend,
Navigate to the backend folder and use this command:
"uvicorn main:app --reload"

This will create a server instance where the front-end react app can connect to via endpoints

# To start the frontend
Navigate to the root directory and then use this command:
"npm start"

This will start the development server where the app will open up in the browser

