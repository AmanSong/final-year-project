import get_path
import pytest
from dotenv import load_dotenv
import os
import base64
from backend.createImages import CreateImages

# Load environment variables from the .env file
load_dotenv()
auth_token = os.getenv('hugging_face_api_token')

stabilityai = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
compvis = "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4"
pixel_art = "https://api-inference.huggingface.co/models/nerijs/pixel-art-xl"
headers = {"Authorization": f"Bearer {auth_token}"}


def test_create_images_stability():
    result = CreateImages(stabilityai, headers, "A picture of a cat")
    try:
        decoded_image = base64.b64decode(result)
        assert decoded_image, "Result does not represent valid image data"
    except Exception as e:
        assert False, f"Error decoding Base64 string: {e}"

def test_create_images_compvis():
    result = CreateImages(compvis, headers, "A picture of a cat")
    try:
        decoded_image = base64.b64decode(result)
        assert decoded_image, "Result does not represent valid image data"
    except Exception as e:
        assert False, f"Error decoding Base64 string: {e}"

def test_create_images_pixel():
    result = CreateImages(pixel_art, headers, "A picture of a cat")
    try:
        decoded_image = base64.b64decode(result)
        assert decoded_image, "Result does not represent valid image data"
    except Exception as e:
        assert False, f"Error decoding Base64 string: {e}"

if __name__ == "__main__":
    pytest.main(["-v", __file__])