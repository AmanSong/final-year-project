import os
from dotenv import load_dotenv
from openai import OpenAI

from createPDF import create_Story_PDF

# retrieve the secret key
load_dotenv()
OPENAI_KEY = os.getenv('OPENAI_KEY')
LLM_MODEL = 'gpt-3.5-turbo'
client = OpenAI(api_key=OPENAI_KEY)

def openAi_model(Page, Style):
    rewritten_page = ""

    stream = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content":
            "You are a helpful AI assistant that will take help rewrite pages from stories using a given style. Maintain the overall structure but format it as requested"},
    
            {"role": "user", "content": 
            f"Rewrite this page in the style of {Style}, keeping the same structure, word length and any dialouge within, Page: '{Page}' "},
        ],
        max_tokens=4096,
        stream=True,
    )

    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            page_content = chunk.choices[0].delta.content
            rewritten_page += page_content

    return rewritten_page
      

def rewrite(Story, Style):
    Re_WrittenStory = []

    # Filter out empty pages
    filtered_pages = [page for page in Story if page.strip()]
    
    for index, page in enumerate(filtered_pages, start=1):
        if page == '':
            return page
        else:
            generatedPage = openAi_model(page, Style)
            print(f"Page {index}:\n{generatedPage}")
            print()
            print(f"Actual page: {index}:\n{page}")
            Re_WrittenStory.append(generatedPage)

    print(Re_WrittenStory)
    return Re_WrittenStory

