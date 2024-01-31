from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def add_image_to_pdf(image_path, text, output_path):
    c = canvas.Canvas(output_path, pagesize=letter)

    # Get the dimensions of the image and the page
    page_width, page_height = letter

    # Draw the image, scaling it to cover the entire page
    c.drawImage(image_path, 0, 0, width=page_width, height=page_height)

    # Add a new page
    c.showPage()

    # Draw text around the image on the second page
    margin = 50  # Set your desired margin
    text_x = margin
    text_y = page_height - margin

    # Draw the image on the second page
    c.drawImage(image_path, 250, 650, width=200, height=200)

    # Draw text around the image
    c.setFont("Helvetica", 12)
    c.setFillColorRGB(0, 0, 0)

    lines = text.split('\n')
    line_height = 15  # Adjust the line spacing as needed

    for line in lines:
        c.drawString(text_x, text_y, line)
        text_y -= line_height  # Adjust the line spacing as needed

    c.save()

# Usage
image_path = "style_anime.png"
text = "Your text goes here. You can add multiple lines and format as needed.\nYour text goes here."
output_path = "output.pdf"
add_image_to_pdf(image_path, text, output_path)
