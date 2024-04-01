import get_path
import pytest
from backend.extract import read

pdf_path = "test.pdf"

def test_read_and_extract():
    with open(pdf_path, "rb") as pdf_file:
        file_content = pdf_file.read()

    result, summary = read(file_content)
    assert result[0].strip() == "Dummy PDF file"
    assert summary[0].strip() == "Dummy PDF file"

if __name__ == "__main__":
    pytest.main(["-v", __file__])