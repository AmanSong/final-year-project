import fitz
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize

# make sure to download before running
import nltk

nltk.download('punkt')
nltk.download('stopwords')

# function to extract text from each page
def read(file_content):
    text = []
    try:
        # Open the PDF using PyMuPDF
        document = fitz.open(stream=file_content, filetype="pdf")

        # Iterate through the PDF pages and extract text
        for page_num in range(len(document)):
            page = document[page_num]
            page_text = page.get_text()

            # add each page of text to the array
            text.append(page_text)

        document.close()

    except Exception as error:
        print(f"Error during PDF extraction: {error}")

    page_summaries = summarize_pages(text, num_sentences=1)

    return text, page_summaries


# function to extract prompts for image generation
def summarize_pages(text, num_sentences=2):

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