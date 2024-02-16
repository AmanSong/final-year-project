import os
from openai import OpenAI
from dotenv import load_dotenv

# retrieve the secret key
load_dotenv()
OPENAI_KEY = os.getenv('OPENAI_KEY')
client = OpenAI(api_key=OPENAI_KEY)


def story_generator():
    storyGenerated = []

    genre = 'Adventure'

    # stream = client.chat.completions.create(
    # model="gpt-3.5-turbo",
    # messages=[{"role": "user", "content": "Can you write me a short story?"}],
    # stream=True,
    # )

    # for chunk in stream:
    #     if chunk.choices[0].delta.content is not None:
    #         print(chunk.choices[0].delta.content, end="")
