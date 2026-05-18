import os
import requests
from dotenv import load_dotenv

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Load env variables
load_dotenv("../.env")

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# Fetch financial news
url = (
    f"https://newsapi.org/v2/everything?"
    f"q=finance OR cryptocurrency OR stocks&"
    f"language=en&"
    f"sortBy=publishedAt&"
    f"apiKey={NEWS_API_KEY}"
)

response = requests.get(url)
articles = response.json()["articles"]

# Convert articles to documents
documents = []

for article in articles[:10]:

    content = f"""
    Title: {article.get('title', '')}

    Description: {article.get('description', '')}

    Content: {article.get('content', '')}
    """

    documents.append(Document(page_content=content))

# Split text
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

docs = text_splitter.split_documents(documents)

# Embedding model
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load existing vector DB
vector_db = Chroma(
    persist_directory="../../chroma_db",
    embedding_function=embedding_model
)

# Add documents
vector_db.add_documents(docs)

# Persist updates
vector_db.persist()

print(f"Added {len(docs)} chunks to vector database.")