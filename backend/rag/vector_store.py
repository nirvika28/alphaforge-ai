from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Load document
loader = TextLoader(r"C:\Users\Admin\OneDrive\Desktop\alphaforge-ai\datasets\market_news.txt")
documents = loader.load()

# Split text into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=50
)

docs = text_splitter.split_documents(documents)

# Embedding model
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Store in ChromaDB
vector_db = Chroma.from_documents(
    docs,
    embedding_model,
    persist_directory="../../chroma_db"
)

vector_db.persist()

print("Vector DB created successfully!")