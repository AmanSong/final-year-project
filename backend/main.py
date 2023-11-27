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
from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse

from extract import read, summarize_pages
from story import generateStory

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

# API for the stability ai model, currently seems to be down as of 15/11/2023
stabilityai = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

# API for the CompVis api, fast but low quality
compvis = "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4"

# pixel art, works as of 15/11/23 and fast
pixel_art = "https://api-inference.huggingface.co/models/nerijs/pixel-art-xl"

headers = {"Authorization": f"Bearer {auth_token}"}

# selected model (compvis is default)
SelectedModel = compvis

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
    elif model == "pixel-art-xl":
        SelectedModel = model

    print(f'Selected Model: {SelectedModel}')
    return {"SelectedModel": SelectedModel}

class ModelRequest(BaseModel):
    style: str

style = ''
@app.post("/style")
def set_style(style_choice: ModelRequest):
    global style
    if style_choice.style == '':
        print('nothing')
    style = style_choice.style
    print(f"New style: {style}")

    
# function generate
@app.post("/")
def generate(prompt: str):
    if(SelectedModel == 'stable-diffusion-xl-base-1.0'):

        print('Using stable')

        # change url for stability ai
        API_URL = stabilityai

        def stability_ai(payload):
            response = requests.post(API_URL, headers=headers, json=payload)
            print(response)
            print(payload)
            return response.content

        try:
            if style != '':
                prompt_with_style = f"{prompt}, {style}"
            else:
                prompt_with_style = prompt

            print(f"using {prompt_with_style}")

            # Make a request to the Hugging Face model using the provided text prompt
            image_bytes = stability_ai({
	            "inputs": prompt_with_style,
            })

            # Try to open the image with PIL
            image = Image.open(BytesIO(image_bytes))

            # Convert the PIL Image to base64 format
            buffer = BytesIO()
            image.save(buffer, format="PNG")
            imgstr = base64.b64encode(buffer.getvalue())

            return Response(content=imgstr, media_type="image/png")
        
        except Exception as e:
            return f"Error generating image: {e}"
        
    elif(SelectedModel == 'CompVis/stable-diffusion-v1-4'):

        print('Using CompVis')

        # change url for stability ai
        API_URL = compvis

        def comp_vis(payload):
            response = requests.post(API_URL, headers=headers, json=payload)
            print(response)
            print(payload)
            return response.content

        try:
            if style != '':
                prompt_with_style = f"{prompt}, {style}"
            else:
                prompt_with_style = prompt

            print(f"using {prompt_with_style}")

            # Make a request to the Hugging Face model using the provided text prompt
            image_bytes = comp_vis({
	            "inputs": prompt_with_style,
            })

            # Try to open the image with PIL
            image = Image.open(BytesIO(image_bytes))

            # Convert the PIL Image to base64 format
            buffer = BytesIO()
            image.save(buffer, format="PNG")
            imgstr = base64.b64encode(buffer.getvalue())

            return Response(content=imgstr, media_type="image/png")
        
        except Exception as e:
            return f"Error generating image: {e}"
    elif(SelectedModel == "pixel-art-xl"):
        print('Using pixel')

        # change url for pixel art model
        API_URL = pixel_art

        def pixel_art_xl(payload):
            response = requests.post(API_URL, headers=headers, json=payload)
            print(response)
            print(payload)
            return response.content

        try:
            if style != '':
                prompt_with_style = f"{prompt}, {style}"
            else:
                prompt_with_style = prompt

            print(f"using {prompt_with_style}")

            # Make a request to the Hugging Face model using the provided text prompt
            image_bytes = pixel_art_xl({
	            "inputs": prompt_with_style,
            })

            # Try to open the image with PIL
            image = Image.open(BytesIO(image_bytes))

            # Convert the PIL Image to base64 format
            buffer = BytesIO()
            image.save(buffer, format="PNG")
            imgstr = base64.b64encode(buffer.getvalue())

            return Response(content=imgstr, media_type="image/png")
        
        except Exception as e:
            return f"Error generating image: {e}"

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile):
    try:
        if file.content_type != "application/pdf":
            return JSONResponse(content={"message": "Only PDF files are allowed"}, status_code=400)

        # Read the file content into memory
        file_content = await file.read()

        rawtext, prompts, images = read(file_content)

        # Once processing is done, you can discard the file content
        del file_content

        response_content = {
            "message": "File uploaded and processed successfully",
            "rawtext": rawtext,
            "summaries": prompts,
            "images": images,
        }

        return JSONResponse(content=response_content, status_code=200)
    
    except Exception as e:
        print(f"Error processing the file: {e}")
        return JSONResponse(content={"message": "An error occurred while processing the file"}, status_code=500)
    

class ModelRequest(BaseModel):
    story_prompt: str

@app.post("/story")
def generate(request: ModelRequest):
    try:
        generatedStory = generateStory(request.story_prompt)

        imagePrompt = summarize_pages(generatedStory)

        response_content = {
            "message": "Story generated succesfully",
            "generated_story": generatedStory,
            "imagePrompt": imagePrompt,
        }

        return JSONResponse(content=response_content, status_code=200)
    except Exception as e:
        print(f"Error processing the file: {e}")
        return JSONResponse(content={"message": "An error occured while generating the story"}, status_code=500)


# code for using local model using GPU
# print('using CompVis')
#         # model name and to download and use
#         model_id = "CompVis/stable-diffusion-v1-4"
#         pipe = StableDiffusionPipeline.from_pretrained(model_id, revision="fp16", torch_dtype=torch.float16, use_auth_token=auth_token, cache_dir=models_dir)
#         pipe.to(device)

#         print(prompt)
#         with autocast(device): 
#             image = pipe(prompt, guidance_scale=8.5).images[0]

#         buffer = BytesIO()
#         image.save(buffer, format="PNG")
#         imgstr = base64.b64encode(buffer.getvalue())

#         return Response(content=imgstr, media_type="image/png")