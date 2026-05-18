import os
from dotenv import load_dotenv

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

from groq import Groq

# Load environment variables
load_dotenv("../.env")

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Load embedding model
###embedding_model = HuggingFaceEmbeddings(
    ###model_name="sentence-transformers/all-MiniLM-L6-v2"
###)

###)

# Load vector DB
###vector_db = Chroma(
   ### persist_directory="../../chroma_db",
    ###embedding_function=embedding_model
###)
###)

# User query
query = input("Ask your financial question: ")

# Retrieve context
results = vector_db.similarity_search(query, k=2)

context = "\n".join([doc.page_content for doc in results])

# Prompt
prompt = f"""
You are a financial AI assistant.

Use ONLY the provided context to answer.

Context:
{context}

Question:
{query}

Answer:
"""

# Generate response
chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": prompt,
        }
    ],
    model="llama-3.1-8b-instant",
)

# Print response
print("\nAI Response:\n")
print(chat_completion.choices[0].message.content)