from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
import base64
import tempfile
import os
from reportlab.lib.colors import Color

from frontCover import createCover 

def delete_temp_files(file_paths):
    for file_path in file_paths:
        try:
            os.remove(file_path)
            print(f"Temporary file deleted: {file_path}")
        except Exception as e:
            print(f"Error deleting temporary file {file_path}: {e}")

def base64_to_file(base64_string, file_extension=".png"):
    try:
        # Decode the base64 string
        binary_data = base64.b64decode(base64_string)

        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(binary_data)

        print(f"Temporary file created at: {temp_file.name}")
        return temp_file.name
    except Exception as e:
        print(f"Error converting base64 to temporary file: {e}")
        return None
    
def create_PDF(raw_text, images, title):
    try:
        # get length of images
        amount = len(images)
        print(amount)
        array_images = []

        # Convert images to file format
        for x in range(amount):
            temp_file_path = base64_to_file(images[x])
            if temp_file_path:
                array_images.append(temp_file_path)

        # Create a BytesIO buffer to temporarily store the PDF content
        pdf_buffer = BytesIO()

        # Rest of your code remains unchanged
        pdf = canvas.Canvas(pdf_buffer, pagesize=letter)

        line_height = 15
        margin = 50

        # Calculate the center of the page
        center_x = letter[0] / 2

        # Get the dimensions of the image and the page
        page_width, page_height = letter

        # Filter out empty pages
        filtered_pages = [page for page in raw_text if page.strip()]

        # Draw front cover
        cover_img = createCover(title)
        cover_img_temp = base64_to_file(cover_img)
        pdf.drawImage(cover_img_temp, 0, 0, width=page_width, height=page_height)

        title_lines = title.split(' ')
        title_font_size = 60
        pdf.setFont("Times-Roman", title_font_size)

        # Calculate the y position to center the title
        y_position = letter[1] - 150

        for line in title_lines:
            # Calculate the x position to center the text
            text_width = pdf.stringWidth(line, "Times-Roman", title_font_size)
            x_position = center_x - (text_width / 2)

            pdf.drawString(x_position, y_position, line)
            y_position -= title_font_size


        for i in range(len(filtered_pages)):
            try:
                page = filtered_pages[i]
                # Split text into lines
                sentences = page.split('\n')

                # Move down for text
                y_position = letter[1] - margin

                # new page for image
                pdf.showPage()

                pdf.setFont("Times-Roman", line_height)

                try:
                    image_path = array_images[i]
                    pdf.drawImage(image_path, 0, 0, width=page_width, height=page_height)
                except Exception:
                    pass

                for line in sentences:
                    # Calculate the x position to center the text
                    text_width = pdf.stringWidth(line, "Times-Roman", line_height)
                    x_position = center_x - (text_width / 2)

                    pdf.setFillColorRGB(1, 1, 1, 0.25) #choose fill colour

                    # avoid drawing with when no line
                    if line.strip():
                        pdf.rect(x_position, y_position, text_width + 5, line_height, stroke=0, fill=1)

                    # finally draw the text
                    pdf.setFillColorRGB(0, 0, 0, 1)
                    pdf.drawString(x_position, y_position, line)
                    y_position -= line_height

                    # Check if the text goes beyond the page, create a new page
                    if y_position <= margin:
                        pdf.showPage()
                        y_position = letter[1] - line_height

            except Exception:
                print(f"Error processing page {i + 1}")

        pdf.showPage()
        pdf.save()

        # make sure to handle temp file path deletion
        delete_temp_files(array_images)

        return pdf_buffer

    except Exception:
        # Log outer_error for the entire PDF generation
        print(f"Error generating PDF")
        return None