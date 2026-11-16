
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.ingestion.pdf_processor import extract_text_from_pdf
from app.ingestion.text_chunker import chunk_text
from app.embeddings.vector_store import store_chunks
from app.retrieval.semantic_search import search_documents
from app.agents.llm_generator import generate_answer

import os
import shutil


app = FastAPI(
    title="Agentic RAG System",
    description="Reliable Domain-Specific Question Answering",
    version="1.0.0"
)


# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "data/raw_pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class QuestionRequest(BaseModel):
    question: str = Field(min_length=3)
    top_k: int = Field(default=3, ge=1, le=10)


@app.get("/")
def home():
    return {
        "message": "Welcome to Agentic RAG System",
        "status": "Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "Healthy",
        "project": "Agentic RAG"
    }


# PDF upload, extraction, chunking and vector storage
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    filename = os.path.basename(file.filename)
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract PDF text
        extracted_text = extract_text_from_pdf(file_path)

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in this PDF"
            )

        # Split extracted text into chunks
        chunks = chunk_text(
            extracted_text,
            chunk_size=500,
            chunk_overlap=100
        )

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="Could not create document chunks"
            )

        # Generate embeddings and store in ChromaDB
        stored_count = store_chunks(chunks, filename)

        return {
            "message": "PDF uploaded and processed successfully",
            "filename": filename,
            "characters": len(extracted_text),
            "chunks_created": len(chunks),
            "chunks_stored": stored_count
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(e)}"
        )

    finally:
        await file.close()


# Question answering endpoint
@app.post("/ask")
def ask_question(request: QuestionRequest):

    try:
        # Retrieve relevant chunks
        results = search_documents(
            request.question,
            top_k=request.top_k
        )

        documents = results.get("documents", [[]])[0]
        distances = results.get("distances", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]

        if not documents:
            return {
                "question": request.question,
                "answer": "I could not find relevant information in the uploaded documents.",
                "sources": []
            }

        # Prepare context for the LLM
        context_parts = []
        sources = []

        for i, document in enumerate(documents):

            metadata = metadatas[i] or {}

            context_parts.append(
                f"Source: {metadata.get('source', 'Unknown')}\n"
                f"Content: {document}"
            )

            sources.append({
                "source": metadata.get("source", "Unknown"),
                "chunk_index": metadata.get("chunk_index", -1),
                "distance": distances[i] if i < len(distances) else None
            })

        context = "\n\n".join(context_parts)

        # Generate answer using Qwen
        answer = generate_answer(
            request.question,
            context
        )

        return {
            "question": request.question,
            "answer": answer,
            "sources": sources,
            "total_results": len(sources)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Question answering failed: {str(e)}"
        )
