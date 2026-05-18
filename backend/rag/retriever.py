from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Load embedding model
###embedding_model = HuggingFaceEmbeddings(
    ###model_name="sentence-transformers/all-MiniLM-L6-v2"
###)

###)

# Load existing vector database
###vector_db = Chroma(
   ### persist_directory="../../chroma_db",
    ###embedding_function=embedding_model
###)

# User query
query = input("Enter your query: ")

# Retrieve similar documents
results = vector_db.similarity_search(query, k=2)

print("\nRelevant Context:\n")

for idx, doc in enumerate(results):
    print(f"{idx+1}. {doc.page_content}\n")