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
│   │   │   └── ll