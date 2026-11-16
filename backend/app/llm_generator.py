
import httpx


OLLAMA_URL = "http://localhost:11434/api/generate"

MODEL_NAME = "qwen2.5:1.5b"


def generate_answer(question, context):

    prompt = f"""
You are an AI assistant for answering
domain-specific questions about Artificial
Intelligence and Machine Learning.

Use the provided context to answer the question.

Rules:
1. Answer using the provided context only.
2. Do not invent facts.
3. If the context does not contain the answer,
   clearly say that the information is not available
   in the provided documents.
4. Explain in simple and clear English.

Context:
{context}

Question:
{question}

Answer:
"""

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.2
        }
    }

    try:
        response = httpx.post(
            OLLAMA_URL,
            json=payload,
            timeout=180.0
        )

        response.raise_for_status()

        result = response.json()

        return result["response"]

    except httpx.HTTPError as error:
        raise RuntimeError(
            f"Ollama connection failed: {error}"
        )
