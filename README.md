# Final Year Project
## AI Illustrator 

What is AI Illustrator?
This applcaition is made to illustrate text novels and stories using the power of AI.
With this program, users can sign and login to access a plethora of features such as

-Illustration
    Choose what kind of images to generate
    What AI model to use
    Many art styles to choose from

But that is not all, you can also generate your own unique story, simply provide a prompt
on what you want the AI to write and the program will generate you a story in mere minutes.
The stories will also be illustrated to your liking as well

Generation
    Provide a prompt to generate the story
    Choose your genre
    Select how many pages you want


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

# Secrets
The keys and secrets needed to run the program does not come with this github.
You need to create your own .env file and provide your own OpenAI and HuggingFace keys as shown:

hugging_face_api_token=YOUR_KEY
OPENAI_KEY=YOUR_KEY
REACT_APP_SUPABASE_URL=YOUR_KEY
REACT_APP_SUPABASE_API=YOUR_KEY

# To start the backend,
Navigate to the backend folder and use this command:
"uvicorn main:app --reload"

This will create a server instance where the front-end react app can connect to via endpoints

# To start the frontend
Navigate to the root directory and then use this command:
"npm start"


