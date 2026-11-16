import fitz


def extract_text_from_pdf(file_path):
    text = ""

    pdf = fitz.open(file_path)

    for page_number, page in enumerate(pdf):
        page_text = page.get_text()

        text += f"\n--- Page {page_number + 1} ---\n"
        text += page_text

    pdf.close()

    return text