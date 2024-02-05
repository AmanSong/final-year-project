import fitz
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
import base64
import requests
import os
from dotenv import load_dotenv

# make sure to download before running
# nltk.download('punkt')
# nltk.download('stopwords')

# function to extract text from each page
def read(file_content):
    text = []
    images = []

    # Open the PDF using PyMuPDF
    document = fitz.open(stream=file_content, filetype="pdf")

    # Iterate through the PDF pages and extract text
    for page_num in range(len(document)):
        page = document[page_num]
        page_text = page.get_text()

        # Extract image from each page and convert to base64
        pixmap = page.get_pixmap()
        image_data = pixmap.tobytes()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        images.append(image_base64)

        text.append(page_text)

    document.close()

    page_summaries = summarize_pages(text, num_sentences=1)

    return text, page_summaries, images

# function to extract prompts for iage generation
def summarize_pages(text, num_sentences=1):

    summaries = []
    stop_words = set(stopwords.words("english"))

    for page_text in text:
        # Tokenize the page text into sentences
        sentences = sent_tokenize(page_text)

        # Tokenize each sentence into words and remove stop words
        words = [word for word in word_tokenize(page_text) if word.lower() not in stop_words]

        # Calculate word frequencies
        word_freq = nltk.FreqDist(words)

        # Sort sentences by the sum of their word frequencies
        ranked_sentences = sorted(sentences, key=lambda sentence: sum(word_freq[word] for word in word_tokenize(sentence)), reverse=True)

        # Select the top N sentences as the summary
        summary = " ".join(ranked_sentences[:num_sentences])
        summaries.append(summary)

    return summaries

# testing out using LLM to create better prompts

# if __name__ == "__main__":
#     # Load environment variables from the .env file
#     load_dotenv()
#     auth_token = os.getenv('hugging_face_api_token')

#     API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"
#     headers = {"Authorization": f"Bearer {auth_token}"}

#     def prompt_extract(payload):
#         response = requests.post(API_URL, headers=headers, json=payload)
#         return response.json()

#     output = prompt_extract({
#         "inputs": "Generate a prompt for image generation using this text: The ferocious dragon roars great flames down the village",
#     })

#     print(output)