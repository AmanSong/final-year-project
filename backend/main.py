# import dependencies
import os
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import base64 

app = FastAPI()

# allow for requests between server and application
app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# the auth token from hugging face to allow for download of models
auth_token = os.getenv("hugging_face_api_token")

# create or take from models folder
models_dir = "models"

# to tell code to utilise GPU
device = "cuda"

# model name and to download and use
model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionPipeline.from_pretrained(model_id, revision="fp16", torch_dtype=torch.float16, use_auth_token=auth_token, cache_dir=models_dir)
pipe.to(device)


@app.get("/")
def generate(prompt: str): 
    print(prompt)
    with autocast(device): 
        image = pipe(prompt, guidance_scale=8.5).images[0]

    image.save("testimage.png")
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())

    return Response(content=imgstr, media_type="image/png")
