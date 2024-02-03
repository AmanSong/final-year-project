from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
import base64
import tempfile

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


def create_PDF(raw_text, images):
    try:
        # get length of images
        amount = len(images)
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

        # Set font and font size
        pdf.setFont("Helvetica", 12)

        # Set line height
        line_height = 14

        # Set margin
        margin = 50

        # Calculate the center of the page
        center_x = letter[0] / 2

        # Filter out empty pages
        filtered_pages = [page for page in raw_text if page.strip()]

        # Draw title
        title = filtered_pages[0]
        title_lines = title.split('\n')
        title_font_size = 18
        pdf.setFont("Helvetica-Bold", title_font_size)

        # Calculate total height for the title
        title_height = len(title_lines) * title_font_size

        # Calculate the y position to center the title
        y_position = letter[1] - margin - title_height

        for line in title_lines:
            # Calculate the x position to center the text
            text_width = pdf.stringWidth(line, "Helvetica-Bold", title_font_size)
            x_position = center_x - (text_width / 2)

            pdf.drawString(x_position, y_position, line)
            y_position -= title_font_size

        pdf.showPage()

        # Move down for text
        y_position = letter[1] - margin - title_font_size

        # Get the dimensions of the image and the page
        page_width, page_height = letter

        count = 0

        for page in filtered_pages[1:]:
            try:
                
                if count == amount:
                    break

                # Split text into lines
                lines = page.split('\n')

                pdf.drawImage(array_images[count], 0, 0, width=page_width, height=page_height)
                count += 1

                for line in lines:
                    # Calculate the x position to center the text
                    text_width = pdf.stringWidth(line, "Helvetica", 12)
                    x_position = center_x - (text_width / 2)

                    pdf.drawString(x_position, y_position, line)
                    y_position -= line_height

                    # Check if the text goes beyond the page, create a new page
                    if y_position <= margin:
                        pdf.showPage()
                        y_position = letter[1] - margin
            except Exception:
                print(f"Error processing page")

        pdf.showPage()
        pdf.save()

        return pdf_buffer

    except Exception:
        # Log outer_error for the entire PDF generation
        print(f"Error generating PDF")
        return None
