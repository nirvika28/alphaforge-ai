import os
from typing import TypedDict

from dotenv import load_dotenv
from groq import Groq
from langfuse import Langfuse
from langgraph.graph import StateGraph, END

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from tools.market_tool import get_crypto_data
# -----------------------------
# ENV + CLIENT
# -----------------------------
load_dotenv(".env")
from langfuse import get_client

# Initialize the v4 client at the top of your script
langfuse = get_client()
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

langfuse = Langfuse(
    secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
    public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
    host=os.getenv("LANGFUSE_HOST")
)
# -----------------------------
# VECTOR DB
# -----------------------------
###embedding_model = HuggingFaceEmbeddings(
    ###model_name="sentence-transformers/all-MiniLM-L6-v2"
##)

##)

###vector_db = Chroma(
   ### persist_directory="../../chroma_db",
   ### embedding_function=embedding_model
###)

# -----------------------------
# STATE
# -----------------------------
class AgentState(TypedDict):
    query: str
    news_analysis: str
    risk_analysis: str
    final_response: str
    market_analysis: str

# -----------------------------
# NEWS AGENT
# -----------------------------
def news_node(state):

    query = state["query"]

    results = vector_db.similarity_search(query, k=2)

    context = "\n".join([doc.page_content for doc in results])

    prompt = f"""
    You are a financial news analyst.

    Analyze this context.

    Context:
    {context}

    Query:
    {query}
    """

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant"
    )

    state["news_analysis"] = response.choices[0].message.content

    return state

# -----------------------------
# RISK AGENT
# -----------------------------
def risk_node(state):

    query = state["query"]

    results = vector_db.similarity_search(query, k=2)

    context = "\n".join([doc.page_content for doc in results])

    prompt = f"""
    You are a financial risk analyst.

    Analyze risks using this context.

    Context:
    {context}

    Query:
    {query}
    """

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant"
    )

    state["risk_analysis"] = response.choices[0].message.content

    return state

# -----------------------------
# MARKET AGENT
# -----------------------------
def market_node(state):

    query = state["query"]

    market_data = get_crypto_data()

    prompt = f"""
    You are a cryptocurrency market analyst.

    IMPORTANT:
    Use ONLY the provided market data.
    Do NOT invent prices, trends, or metrics.

    Market Data:
    {market_data}

    User Query:
    {query}

    Provide:
    1. Current market trend
    2. Price movement interpretation
    3. Short risk insight

    Keep response concise and factual.
"""

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant"
    )

    state["market_analysis"] = response.choices[0].message.content

    return state
# -----------------------------
# SYNTHESIS NODE
# -----------------------------
def synthesize_node(state):

    prompt = f"""
You are a financial AI synthesizer.

IMPORTANT RULES:
- ONLY use the analyses provided below.
- DO NOT invent price values.
- DO NOT add external financial knowledge.
- DO NOT hallucinate unsupported facts.

News Analysis:
{state['news_analysis']}

Risk Analysis:
{state['risk_analysis']}

Market Analysis:
{state['market_analysis']}

Generate:
1. Final investment insight
2. Key risks
3. Recommended caution level

Keep response grounded and factual.
"""

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant"
    )

    state["final_response"] = response.choices[0].message.content

    return state

# -----------------------------
# GRAPH
# -----------------------------
workflow = StateGraph(AgentState)

workflow.add_node("news_agent", news_node)
workflow.add_node("risk_agent", risk_node)
workflow.add_node("market_agent", market_node)
workflow.add_node("synthesizer", synthesize_node)

workflow.set_entry_point("news_agent")

workflow.add_edge("news_agent", "risk_agent")
workflow.add_edge("risk_agent", "market_agent")
workflow.add_edge("market_agent", "synthesizer")
workflow.add_edge("synthesizer", END)

app = workflow.compile()

# -----------------------------
# RUN
# -----------------------------
