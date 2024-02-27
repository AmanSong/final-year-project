import os
from io import BytesIO
import base64 
from PIL import Image
import requests
from dotenv import load_dotenv

# API for the stability ai model
stabilityai = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

# Load environment variables from the .env file
load_dotenv()
auth_token = os.getenv('hugging_face_api_token')
headers = {"Authorization": f"Bearer {auth_token}"}

# this is to create a good cover for every story
def createCover(title):
        print('Creating cover page for book')
        API_URL = stabilityai

        def stability_ai(payload):
            response = requests.post(API_URL, headers=headers, json=payload)
            print(response)
            print(payload)
            return response.content

        # Make a request to the Hugging Face model using the provided text prompt
        image_bytes = stability_ai({
            "inputs": "Book cover, beautiful, high quality, best selling, no text " + title,
        })

        # Try to open the image with PIL
        image = Image.open(BytesIO(image_bytes))

        # Convert the PIL Image to base64 format
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        imgstr = base64.b64encode(buffer.getvalue())

        return imgstr