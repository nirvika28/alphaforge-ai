import os
from dotenv import load_dotenv

from groq import Groq

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Load env variables
load_dotenv("../.env")

# Initialize Groq
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Load embeddings
###embedding_model = HuggingFaceEmbeddings(
    ###model_name="sentence-transformers/all-MiniLM-L6-v2"
##)

##)

# Load vector DB
###vector_db = Chroma(
   ### persist_directory="../../chroma_db",
   ### embedding_function=embedding_model
###)

# -----------------------------
# NEWS AGENT
# -----------------------------
def news_agent(query):

    results = vector_db.similarity_search(query, k=2)

    context = "\n".join([doc.page_content for doc in results])

    prompt = f"""
    You are a financial news analyst.

    Analyze the following financial context.

    Context:
    {context}

    Query:
    {query}

    Give a concise news analysis.
    """

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
    )

    return response.choices[0].message.content


# -----------------------------
# RISK AGENT
# -----------------------------
def risk_agent(query):

    prompt = f"""
    You are a financial risk analyst.

    Analyze potential risks related to:
    {query}

    Provide concise risk insights.
    """

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
    )

    return response.choices[0].message.content


# -----------------------------
# MAIN ORCHESTRATOR
# -----------------------------
query = input("Enter financial query: ")

news_analysis = news_agent(query)
risk_analysis = risk_agent(query)

print("\n=== NEWS ANALYSIS ===\n")
print(news_analysis)

print("\n=== RISK ANALYSIS ===\n")
print(risk_analysis)