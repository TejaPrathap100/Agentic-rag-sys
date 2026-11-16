
from app.ingestion.pdf_processor import extract_text_from_pdf
from app.ingestion.text_chunker import chunk_text

# Read the uploaded PDF
pdf_path = "data/raw_pdfs/AI.pdf"
text = extract_text_from_pdf(pdf_path)

# Divide extracted text into chunks
chunks = chunk_text(
    text,
    chunk_size=500,
    chunk_overlap=100
)

# Display results
print("Total characters:", len(text))
print("Total chunks:", len(chunks))

for i, chunk in enumerate(chunks):
    print(f"\n--- Chunk {i + 1} ---")
    print("Characters:", len(chunk))
    print(chunk)
