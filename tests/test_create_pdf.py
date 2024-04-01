import sys
from os import path
import pytest
import tempfile
import fitz

import get_path
sys.path.append(path.join(path.dirname(__file__), "../backend"))

from backend.createPDF import (create_Story_PDF, create_PDF)

def test_create_pdf():
    raw_text = ["This is for testing purposes", "Hello World"]
    with open('test.png', 'rb') as file:
        image_bytes = file.read()
    title = 'Test'
    Format = 'NextPage'
    fontName = 'Helvetica'
    fontSize = 15

    #result = create_PDF(raw_text, [image_bytes], title, Format, fontName, fontSize) 
    result = create_Story_PDF(raw_text, title, [image_bytes], fontName, fontSize) 

    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        result.seek(0)
        temp_file.write(result.read())
        temp_file.seek(0)

        # Open the PDF file
        pdf_document = fitz.open(temp_file.name)

        # Check the title on the first page
        first_page_text = pdf_document[0].get_text()
        assert title in first_page_text

        # Check the content on subsequent pages
        content_expected = 'This is for testing purposes'
        page_text = pdf_document[1].get_text()
        assert content_expected in page_text
            
        # Close the PDF document
        pdf_document.close()

if __name__ == "__main__":
    pytest.main(["-v", __file__])