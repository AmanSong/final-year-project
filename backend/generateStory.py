import os
from dotenv import load_dotenv
from openai import OpenAI

from langchain_openai import OpenAI as LangchainOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryMemory
from langchain.prompts.prompt import PromptTemplate

from createPDF import create_Story_PDF
from extract import summarize_pages

# retrieve the secret key
load_dotenv()
OPENAI_KEY = os.getenv('OPENAI_KEY')
LLM_MODEL = 'gpt-3.5-turbo'
client = OpenAI(api_key=OPENAI_KEY)

LangLLM = LangchainOpenAI(api_key=OPENAI_KEY, model='gpt-3.5-turbo-instruct', temperature=0.7, max_tokens=2500)

def convertToPDF(Story, Title, Images):
    pdf = create_Story_PDF(Story, Title, Images)
    return pdf


def expand_story(Pages):
    Story = []

    template = """Engage in creative storytelling and further expand upon the given summaries of story pages.
        Avoid repeating the original plot details and instead, introduce creative plot twists.
        Foster character interactions by generating meaningful conversations rather than straightforward narration.
        Maintain coherence with the established plot and characters while infusing a fresh and imaginative perspective into the narrative.
        Your goal is to be a creative storyteller, providing depth and richness to the existing story elements.
        Avoid writing endings until the summary clearly states so.

    Current Story:
    {history}
    Context: {input}
    AI:"""

    memory = ConversationSummaryMemory(llm=LangLLM)
    PROMPT = PromptTemplate(input_variables=["history", "input"], template=template)
    story = ConversationChain(
        prompt=PROMPT,
        llm=LangLLM,
        verbose=False,
        memory=memory,
    )

    print('\n\n')
    print('The Story:\n')
    for index, page in enumerate(Pages, start=1):
        # Dynamically update the history/context for each page
        history = '\n'.join(Pages[:index])
        generatedPage = story.predict(input=page, history=history)
        print(f"Page {index}:\n{generatedPage}")
        Story.append(generatedPage)

    return Story


def story_generator(context, title, genres, amount):

    print('Working on creating story')
    storyGenerated = []
    Genre = ", ".join(genres)

    stream = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates creative stories. You adhere to the given genres and you create a paragraph for each page stated"},
            {"role": "user", "content": f"Write only {amount} pages of summaries for a book called {title} with the genres being {Genre}, with the given context: {context}"},
        ],
        max_tokens=4096,
        stream=True,
    )

    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            page_content = chunk.choices[0].delta.content
            print(page_content, end="")
            storyGenerated.append(page_content)

    full_story = ''.join(storyGenerated)
    Pages = full_story.split('\n\n')

    # now we expand the story
    Story = expand_story(Pages)

    print(Story)

    # the pages can be too long which can cause error during generation, 
    # use summarise to shrink it down.
    prompts = summarize_pages(Pages)

    print("\nPrompts:\n")
    print(prompts)

    return Story, prompts