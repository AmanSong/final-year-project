# import dependencies
import os
from fastapi import FastAPI, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
import tempfile
from extract import read
# from story_local_model import generateStory
from generateStory import story_generator, convertToPDF
from createPDF import create_PDF
from generatePrompt import createPrompt
from createImages import CreateImages
from rewrite_story import rewrite

# create FastAPI instances
app = FastAPI()

# allow for requests between server and application
# this is really bad to do but this is just prototyping
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


class AppConfig:
    def __init__(self):
        self.SelectedModel = ''
        self.Style = ''
        self.Format = 'NextPage'
        self.RewriteStyle = ''

# Create an instance of AppConfig
config = AppConfig()

class ModelRequest(BaseModel):
    model: str

# endpoint for selecting model
@app.post("/selectModel")
def select_model(request_data: ModelRequest):
    model = request_data.model 

    # take model request and place it in config class
    config.SelectedModel = model

    print(f'Selected Model: {config.SelectedModel}')
    return {"SelectedModel": config.SelectedModel}


# endpoint for selecting styles
class ModelRequest(BaseModel):
    style: str

@app.post("/style")
def set_style(style_choice: ModelRequest):
    if style_choice.style == '':
        print('nothing')
    config.Style = style_choice.style
    print(f"New style: {config.Style}")


# endpoint to select format
class ModelRequest(BaseModel):
    format: str

@app.post("/format")
def set_style(format_choice: ModelRequest):
    if format_choice.format == '':
        print('default format')
    config.Format = format_choice.format
    print(f"Format: {config.Format}")


# endpoint to select rewrite style
class ModelRequest(BaseModel):
    rewrite_to: str

@app.post("/rewrite")
def set_style(rewrite_request: ModelRequest):
    config.RewriteStyle = rewrite_request.rewrite_to
    print(f"Will rewrite to: {config.RewriteStyle}")

    
# function generate
@app.post("/")
def generate(prompt: str):
    
    if config.SelectedModel == 'stable-diffusion-xl-base-1.0':
        API_URL = stabilityai
    elif config.SelectedModel == 'CompVis/stable-diffusion-v1-4':
        API_URL = compvis
    elif config.SelectedModel == 'pixel-art-xl':
        API_URL = pixel_art
    elif config.SelectedModel == 'dall-e-2':
        API_URL = 'dall-e-2'
    else:
        # default
        API_URL = compvis

    try:
        if config.Style != '':
            prompt_with_style = createPrompt(prompt, config.Style)
        else:
            prompt_with_style = createPrompt(prompt, "No Style")

        print(f"using {prompt_with_style}")
        print(f"using {API_URL}")

        imgstr = CreateImages(API_URL, headers, prompt_with_style)

        return Response(content=imgstr, media_type="image/png")
    
    except Exception as e:
        return f"Error generating image: {e}"


# endpoint for uploaded
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile):
    try:
        if file.content_type != "application/pdf":
            return JSONResponse(content={"message": "Only PDF files are allowed"}, status_code=400)

        # Read the file content into memory
        file_content = await file.read()

        rawtext, prompts = read(file_content)

        # Once processing is done, you can discard the file content
        del file_content

        response_content = {
            "message": "File uploaded and processed successfully",
            "rawtext": rawtext,
            "summaries": prompts,
        }

        return JSONResponse(content=response_content, status_code=200)
    
    except Exception as e:
        print(f"Error processing the file: {e}")
        return JSONResponse(content={"message": "An error occurred while processing the file"}, status_code=500)
    

# endpoint for creating stories
class ModelRequest(BaseModel):
    story_prompt: str
    story_title: str
    genres: list[str]
    amount: int

@app.post("/story")
def generate(storyParams: ModelRequest):
    try:
        # use story.py to generate story
        generatedStory, storyPrompts = story_generator(
            storyParams.story_prompt,
            storyParams.story_title,
            storyParams.genres,
            storyParams.amount
        )

        response_content = {
            "message": "File uploaded and processed successfully",
            "generatedStory": generatedStory,
            "storyPrompts": storyPrompts,
        }

        return JSONResponse(content=response_content, status_code=200)

    except Exception as e:
        print(f"Error processing the file: {e}")
        return JSONResponse(content={"message": "An error occured while generating the story"}, status_code=500)
    
    
# endpoint for convert to pdf with images
class ModelRequest(BaseModel):
    story: list[str]
    story_title: str
    story_images: list[str]
    font_name: str
    font_size: int

@app.post("/storyToPDF")
def generate(storyReq: ModelRequest):
    try:
        # use story.py to generate story
        generatedStory = convertToPDF(
            storyReq.story,
            storyReq.story_title,
            storyReq.story_images,
            storyReq.font_name,
            storyReq.font_size
        )

        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file_story:
            generatedStory.seek(0)
            temp_file_story.write(generatedStory.read())
            temp_file_story.seek(0)

        # Return the temporary file as a FileResponse
        return FileResponse(temp_file_story.name, media_type="application/pdf", filename="generated_pdf.pdf")

    except Exception as e:
        print(f"Error processing the file: {e}")
        return JSONResponse(content={"message": "An error occured while generating the story"}, status_code=500)
    

# endpoint to create PDF
class ModelRequest(BaseModel):
    text: list[str]
    images: list[str]
    title: str
    fontName: str
    fontSize: int
    toRewrite: bool

@app.post("/createPDF")
def create(request: ModelRequest):
    try:

        if(request.toRewrite == True):
            rewritten_story = rewrite(request.text[:10], config.RewriteStyle)
            pdf_buffer = create_PDF(rewritten_story, request.images, request.title, config.Format, request.fontName, request.fontSize)
        else:
            pdf_buffer = create_PDF(request.text, request.images, request.title, config.Format, request.fontName, request.fontSize)

        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            pdf_buffer.seek(0)
            temp_file.write(pdf_buffer.read())
            temp_file.seek(0)

        # Return the temporary file as a FileResponse
        return FileResponse(temp_file.name, media_type="application/pdf", filename="generated_pdf.pdf")

    except Exception as e:
        print(f"Error processing the file: {e}")
        return JSONResponse(content={"message": "An error occured while generating the story"}, status_code=500)
    
    
# # end point to get style of rewriting
# class ModelRequest(BaseModel):
#     Story_To_Rewrite: list[str]
#     In_The_Style: str

# @app.post("/rewrite")
# def rewrite(request: ModelRequest):
#     try:
#         print('hi')

#     except Exception as e:
#         print(f"Error processing the file: {e}")
#         return JSONResponse(content={"message": "An error occured while rewriting the story"}, status_code=500)
    

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