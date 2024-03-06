import os
from dotenv import load_dotenv
from openai import OpenAI

# retrieve the secret key
load_dotenv()
OPENAI_KEY = os.getenv('OPENAI_KEY')
LLM_MODEL = 'gpt-3.5-turbo'
client = OpenAI(api_key=OPENAI_KEY)


def createPrompt(summary, style):
    print('Generating prompt\n')
    print(summary)

    stream = client.chat.completions.create(
        model=LLM_MODEL,
        messages = [
            {"role": "system", "content": "You are a creative AI generating prompts for image creation. Example output: 'High Quality, Field, Flowers, Vibrant colors and gradients'"},
            {"role": "user", "content": f"Generate vivid and descriptive prompts for AI image generation based on the given summary with maximum of 30 words: {summary}. Style: {style}"},
        ],
        max_tokens=4096,
        stream=True,
    )

    prompts = []

    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            prompt = chunk.choices[0].delta.content
            prompts.append(prompt)

    generatedPrompt = ''.join(prompts)

    return generatedPrompt

