
from app.agents.llm_generator import generate_answer

question = "What is machine learning?"

context = """
Machine learning is a branch of artificial
intelligence that enables computers to learn
patterns from data and make predictions
or decisions without being explicitly programmed.
"""

answer = generate_answer(question, context)

print("\nQuestion:", question)

print("\nGenerated Answer:")
print(answer)
