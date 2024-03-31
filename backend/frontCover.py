import os
from io import BytesIO
import base64 
from PIL import Image
import requests
from dotenv import load_dotenv
from openai import OpenAI

# API for the stability ai model
stabilityai = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

# Load environment variables from the .env file
load_dotenv()
auth_token = os.getenv('hugging_face_api_token')
headers = {"Authorization": f"Bearer {auth_token}"}

#in case stable diffusion goes down
DALL_E_2 = "dall-e-2"
OPENAI_KEY = os.getenv('OPENAI_KEY')
client = OpenAI(api_key=OPENAI_KEY)

# this is to create a good cover for every story
def createCover(title):
        print('Creating cover page for book')
        API_URL = stabilityai

        try:
            def stability_ai(payload):
                response = requests.post(API_URL, headers=headers, json=payload)
                print(response)
                print(payload)
                return response.content

            # Make a request to the Hugging Face model using the provided text prompt
            image_bytes = stability_ai({
                "inputs": "Book cover, beautiful, high quality, best selling, no text " + title,
            })
        except:
            response = client.images.generate(
                model=DALL_E_2,
                prompt="Book cover, beautiful, high quality, best selling, no text " + title,
                size="1024x1024",
                quality="standard",
                n=1,
            )

            image_url = response.data[0].url

            if(image_url):
                image_bytes = base64.b64encode(requests.get(image_url).content)
            else:
                print("Dall-E-2 error\n")
        

        # Try to open the image with PIL
        image = Image.open(BytesIO(image_bytes))

        # Convert the PIL Image to base64 format
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        imgstr = base64.b64encode(buffer.getvalue())

        return imgstr