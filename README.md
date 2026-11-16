# Agentic RAG System for Reliable Domain-Specific Question Answering

## 1. Project Overview

The **Agentic RAG System** is an AI-powered application designed to provide reliable, context-aware answers from user-uploaded PDF documents.

It combines **Retrieval-Augmented Generation (RAG)** with an AI language model to retrieve relevant information from documents and generate answers based on the retrieved context.

Unlike traditional chatbots that generate answers from general knowledge, this system focuses on document-based question answering to reduce hallucinations and improve answer reliability.

Users can upload PDF documents, ask questions about their content, and receive answers along with relevant source information.

## 2. Problem Statement

Traditional AI chatbots may generate incorrect or irrelevant answers because they rely on general training knowledge rather than specific user-provided documents.

Finding relevant information manually from large PDF documents is also time-consuming.

This project addresses these challenges by developing a document-based question-answering system that retrieves relevant content and generates answers using an AI language model.

## 3. Objectives

- Develop an AI-powered document question-answering application.
- Allow users to upload PDF documents.
- Extract and process text from uploaded documents.
- Divide documents into smaller chunks.
- Generate vector embeddings for semantic search.
- Retrieve relevant document chunks based on user questions.
- Generate context-aware answers using an LLM.
- Display answers with relevant source information.
- Reduce hallucinations by grounding responses in retrieved content.

## 4. Technology Stack

### Backend
- Python 3.11
- FastAPI
- PyMuPDF
- ChromaDB
- FastEmbed
- HTTPX

### AI and Language Model
- Ollama
- Qwen 2.5 1.5B Instruct
- BAAI/bge-small-en-v1.5 Embedding Model

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Lucide React

### Development Tools
- Visual Studio Code
- Git
- GitHub
- PowerShell

## 5. System Architecture

The application follows a document ingestion and question-answering workflow.

```text
             USER
               |
               v
       React Frontend
               |
               v
          FastAPI
               |
       +-------+-------+
       |               |
       v               v
  PDF Upload       User Question
       |               |
       v               v
  PDF Extraction   Semantic Search
       |               |
       v               v
  Text Chunking    ChromaDB
       |               |
       v               v
  Embeddings       Relevant Chunks
       |               |
       v               v
    ChromaDB       Context Creation
                       |
                       v
                  Ollama + Qwen
                       |
                       v
                 Generated Answer
                       |
                       v
                 React Frontend
                       |
                       v
                      USER
```

## 6. Project Folder Structure

```text
Agentic-RAG-System/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── ingestion/
│   │   │   ├── pdf_processor.py
│   │   │   └── text_chunker.py
│   │   │
│   │   ├── embeddings/
│   │   │   └── vector_store.py
│   │   │
│   │   ├── retrieval/
│   │   │   └── semantic_search.py
│   │   │
│   │   ├── agents/
│   │   │   └── llm_generator.py
│   │   │
│   │   ├── workflow/
│   │   ├── evaluation/
│   │   └── main.py
│   │
│   ├── data/
│   ├── chroma_db/
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 7. Working Methodology

### Step 1: PDF Upload
The user uploads a PDF document through the React frontend.

### Step 2: Text Extraction
PyMuPDF extracts the text content from the uploaded PDF.

### Step 3: Text Chunking
The extracted text is divided into smaller chunks to make retrieval more efficient.

Current configuration:
- Chunk size: 500
- Chunk overlap: 100

### Step 4: Embedding Generation
FastEmbed generates vector embeddings using the BGE-small English embedding model.

### Step 5: Vector Storage
ChromaDB stores the document embeddings and their corresponding text chunks.

### Step 6: Semantic Retrieval
When the user asks a question, the system converts the query into an embedding and retrieves the most relevant chunks from ChromaDB.

### Step 7: Answer Generation
The retrieved information is passed as context to the Qwen 2.5 language model running locally through Ollama.

### Step 8: Response Generation
The language model generates an answer based on the retrieved context. The frontend displays the answer and its available sources.

## 8. Main Features

- PDF document upload.
- Automatic text extraction.
- Text chunking and preprocessing.
- Vector embedding generation.
- Semantic search using ChromaDB.
- Context-aware AI question answering.
- Local LLM integration using Ollama.
- Source information for generated answers.
- Interactive React dashboard.
- Chat interface for asking document-related questions.
- Document management interface.

## 9. Installation and Execution

### Prerequisites

Install the following:

- Python 3.11
- Node.js and npm
- Git
- Ollama

Download Ollama from:

https://ollama.com/

Pull the required language model:

```bash
ollama pull qwen2.5:1.5b
```

### Backend Setup

Open PowerShell and navigate to the backend folder:

```powershell
cd Agentic-RAG-System/backend
```

Create a virtual environment if it does not already exist:

```powershell
python -m venv venv
```

Activate the environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
python -m uvicorn app.main:app --reload
```

Backend URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

### Frontend Setup

Open another PowerShell terminal:

```powershell
cd Agentic-RAG-System/frontend
```

Install dependencies:

```powershell
npm install
```

Start the frontend:

```powershell
npm run dev
```

Frontend URL:

http://localhost:5173

## 10. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Checks backend status |
| POST | `/upload-pdf` | Uploads and processes PDF documents |
| POST | `/ask` | Accepts questions and generates answers |

## 11. Expected Output

The application allows users to:

1. Open the web application.
2. Upload a PDF document.
3. Wait for document processing and embedding generation.
4. Navigate to the AI Chat section.
5. Enter a question related to the uploaded document.
6. Receive an AI-generated answer.
7. View the available source information.

## 12. Future Enhancements

The following features are planned to improve the project:

- Agentic workflow using LangGraph.
- Intelligent query routing.
- Improved retrieval and reranking.
- RAG evaluation using RAGAS.
- Hallucination detection.
- Support for multiple document formats.
- OCR support for scanned PDFs.
- Conversation memory.
- Advanced document management.
- Improved retrieval accuracy and response performance.

## 13. Advantages

- Reduces manual document searching.
- Provides context-aware answers.
- Uses semantic search instead of simple keyword matching.
- Supports user-uploaded documents.
- Runs the language model locally through Ollama.
- Helps reduce unsupported AI-generated responses.
- Provides a modular and extensible architecture.

## 14. Conclusion

The Agentic RAG System demonstrates how Retrieval-Augmented Generation can be used to build a reliable domain-specific question-answering application.

By combining document processing, vector embeddings, semantic retrieval, and large language models, the system enables users to interact with their documents through natural language questions.

The project also provides a foundation for future development of agentic AI workflows and advanced RAG evaluation techniques.

---

## Author

**Project Title:** Agentic RAG System for Reliable Domain-Specific Question Answering

**Project Type:** AI / Machine Learning / Generative AI

**Status:** Core application implemented; advanced agentic workflow and evaluation planned.

**Repository:** https://github.com/TejaPrathap100/Agentic-rag-sys
**Localhost** http://localhost:5173/
