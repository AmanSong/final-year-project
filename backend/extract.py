import fitz
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist

# make sure to download before running
# nltk.download('punkt')
# nltk.download('stopwords')


def read(pdf):
    text = []

    # open the pdf using PyMuPDF
    pdf_document = fitz.open(pdf)

    # iterate through the pdf pages and extract text
    for page_num in range(pdf_document.page_count):

        page = pdf_document[page_num]
        page_text = page.get_text()
        
        # append each page into the list
        text.append(page_text)

    pdf_document.close()
    
    return text


def extract_most_meaningful_words(text):
    meaningful_words = []

    for page_text in text:
        # Tokenize the page text into words
        words = word_tokenize(page_text.lower())  # Convert to lowercase

        # Filter out stopwords (common words like "the," "and," "in," etc.)
        filtered_words = [word for word in words if word.isalnum() and word not in stopwords.words("english")]

        # Calculate word frequencies
        word_freq = FreqDist(filtered_words)

        # Sort words by frequency in descending order
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)

        # Select the top N words as the most meaningful ones (e.g., top 10)
        top_words = [word for word, freq in sorted_words[:25]]

        meaningful_words.append(top_words)

    return meaningful_words

text = read("GreatGatsby.pdf")

# Extract the most meaningful words from each page
meaningful_words = extract_most_meaningful_words(text)

# Print the most meaningful words for each page
for page_num, words in enumerate(meaningful_words, start=1):
    print(f"Page {page_num} Most Meaningful Words:")
    print(", ".join(words))
    print("\n-------------")