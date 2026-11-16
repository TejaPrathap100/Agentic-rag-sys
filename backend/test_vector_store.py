
from app.ingestion.pdf_processor import extract_text_from_pdf
from app.ingestion.text_chunker import chunk_text
from app.embeddings.vector_store import store_chunks, collection

# Read the PDF
pdf_path = "data/raw_pdfs/AI.pdf"

text = extract_text_from_pdf(pdf_path)

# Create chunks
chunks = chunk_text(
    text,
    chunk_size=500,
    chunk_overlap=100
)

# Store chunks in ChromaDB
total = store_chunks(chunks, "AI.pdf")

print("Total chunks stored:", total)

# Check database
print("Total records in ChromaDB:", collection.count())
