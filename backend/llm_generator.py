
import httpx

OLLAMA_URL = "http://localhost:11434/api/generate"

MODEL_NAME = "qwen2.5:1.5b"


def generate_answer(question, context):

    prompt = f"""
You are an AI assistant specializing in
Artificial Intelligence and Machine Learning.

Answer the question using only the given context.

If the answer is not available in the context,
clearly say that you cannot find the information
in the provided document.

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
