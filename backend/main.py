# import dependencies
import os
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import BytesIO
import base64 
from PIL import Image
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

from extract import read

app = FastAPI()

# allow for requests between server and application
app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# Load environment variables from the .env file
load_dotenv()
auth_token = os.getenv('hugging_face_api_token')

# create or take from models folder
models_dir = "models"

# to tell code to utilise GPU
device = "cuda"

# API for the stability ai model
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {auth_token}"}

# selected model (stabilityAi is default)
SelectedModel = 'stable-diffusion-xl-base-1.0'

class ModelRequest(BaseModel):
    model: str

@app.post("/selectModel")
def select_model(request_data: ModelRequest):
    global SelectedModel
    model = request_data.model 

    if model == 'stable-diffusion-xl-base-1.0':
        SelectedModel = model
    elif model == 'CompVis/stable-diffusion-v1-4':
        SelectedModel = model

    return {"SelectedModel": SelectedModel}


# function generate
@app.get("/")
def generate(prompt: str):
    if(SelectedModel == 'stable-diffusion-xl-base-1.0'):
        def stability_ai(payload):
            response = requests.post(API_URL, headers=headers, json=payload)
            return response.content

        # Make a request to the Hugging Face model using the provided text prompt
        image_bytes = stability_ai({
            "inputs": prompt,
        })

        try:
            # Try to open the image with PIL
            image = Image.open(BytesIO(image_bytes))

            # Convert the PIL Image to base64 format
            buffer = BytesIO()
            image.save(buffer, format="PNG")
            imgstr = base64.b64encode(buffer.getvalue())

            return Response(content=imgstr, media_type="image/png")

        except Exception as e:
            return f"Error: {e}"
        
    elif(SelectedModel == 'CompVis/stable-diffusion-v1-4'):
        print('using CompVis')
        # model name and to download and use
        model_id = "CompVis/stable-diffusion-v1-4"
        pipe = StableDiffusionPipeline.from_pretrained(model_id, revision="fp16", torch_dtype=torch.float16, use_auth_token=auth_token, cache_dir=models_dir)
        pipe.to(device)

        print(prompt)
        with autocast(device): 
            image = pipe(prompt, guidance_scale=8.5).images[0]

        buffer = BytesIO()
        image.save(buffer, format="PNG")
        imgstr = base64.b64encode(buffer.getvalue())

        return Response(content=imgstr, media_type="image/png")


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile):
    try:
        if file.content_type != "application/pdf":
            return JSONResponse(content={"message": "Only PDF files are allowed"}, status_code=400)

        # Read the file content into memory
        file_content = await file.read()

        rawtext, summaries = read(file_content)

        # Once processing is done, you can discard the file content
        del file_content

        response_content = {
            "message": "File uploaded and processed successfully",
            "rawtext": rawtext,
            "summaries": summaries,
        }

        return JSONResponse(content=response_content, status_code=200)
    except Exception as e:
        print(f"Error processing the file: {e}")
        return JSONResponse(content={"message": "An error occurred while processing the file"}, status_code=500)
