
from fastembed import TextEmbedding
from app.embeddings.vector_store import collection

# Load the same embedding model
embedding_model = TextEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)


def search_documents(question, top_k=3):

    # Convert the user's question into an embedding
    query_embedding = list(
        embedding_model.query_embed(question)
    )[0].tolist()

    # Search ChromaDB
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results
