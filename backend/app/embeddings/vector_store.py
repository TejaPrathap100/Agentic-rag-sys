
from fastembed import TextEmbedding
import chromadb

# Load the embedding model
embedding_model = TextEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)

# Create persistent ChromaDB storage
client = chromadb.PersistentClient(
    path="./chroma_db"
)

# Create or connect to our collection
collection = client.get_or_create_collection(
    name="ai_ml_documents",
    metadata={"hnsw:space": "cosine"}
)


def store_chunks(chunks, source_filename):

    # Convert text chunks into numerical vectors
    embeddings = list(embedding_model.embed(chunks))

    # Convert vectors into Python lists
    embeddings = [vector.tolist() for vector in embeddings]

    # Generate unique IDs
    ids = [
        f"{source_filename}_{i}"
        for i in range(len(chunks))
    ]

    # Store vectors, text and metadata
    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=[
            {
                "source": source_filename,
                "chunk_index": i
            }
            for i in range(len(chunks))
        ]
    )

    return len(chunks)
