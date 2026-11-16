
from app.retrieval.semantic_search import search_documents

question = "What is machine learning?"

results = search_documents(question, top_k=3)

print("\nUser Question:", question)

print("\nRelevant Documents:\n")

for i, document in enumerate(results["documents"][0]):

    print(f"Result {i + 1}:")
    print(document)

    print("Distance:",
          results["distances"][0][i])

    print("-" * 50)

