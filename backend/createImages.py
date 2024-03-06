import base64 
import requests
from openai import OpenAI
import os
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

# retrieve the secret key
load_dotenv()
OPENAI_KEY = os.getenv('OPENAI_KEY')
DALL_E_2 = "dall-e-2"
client = OpenAI(api_key=OPENAI_KEY)


def CreateImages(API_URL, headers, prompt):

    def huggingFace(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        print(response)
        print(payload)
        return response.content
    
    try:
        print(f"using {prompt}")
        print(f"using {API_URL}")

        if(API_URL == DALL_E_2):

            response = client.images.generate(
                model=DALL_E_2,
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )

            image_url = response.data[0].url

            if(image_url):
                imgstr = base64.b64encode(requests.get(image_url).content)
            else:
                print("Dall-E-2 error\n")
            
        else:
            # Make a request to the Hugging Face model using the provided text prompt
            image_bytes = huggingFace({
                "inputs": prompt,
            })

            # Try to open the image with PIL
            image = Image.open(BytesIO(image_bytes))

            # Convert the PIL Image to base64 format
            buffer = BytesIO()
            image.save(buffer, format="PNG") 
            imgstr = base64.b64encode(buffer.getvalue())

        return imgstr

    except Exception as e:
        return f"Error generating image: {e}"