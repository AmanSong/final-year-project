import os
from dotenv import load_dotenv
from openai import OpenAI

from langchain_openai import OpenAI as LangchainOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryMemory
from langchain.prompts.prompt import PromptTemplate

from createPDF import create_Story_PDF

# retrieve the secret key
load_dotenv()
OPENAI_KEY = os.getenv('OPENAI_KEY')
LLM_MODEL = 'gpt-3.5-turbo'
client = OpenAI(api_key=OPENAI_KEY)

LangLLM = LangchainOpenAI(api_key=OPENAI_KEY, model='gpt-3.5-turbo-instruct', temperature=0.7, max_tokens=3000)

def convertToPDF(Story, Title):
    # provide the generated story and title, images come later
    pdf = create_Story_PDF(Story, Title)
    return pdf

def expand_story(Pages):

    Story = []

    template = """The following is a given summaries of pages of a story that the AI will expand on further,
        The AI is a creative story writer that will help expand upon the summaries,
        The AI should be creative but follow the plot and the characters. The AI should not repeat the plot 
        but further expand upon it, Creating plot twists if can.
        The AI should try to generate conversation between characters.

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
        generatedPage = story.predict(input=page)
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

    # After the story has been expanded, convert to PDF
    StoryPDF = convertToPDF(Story, title)

    return StoryPDF