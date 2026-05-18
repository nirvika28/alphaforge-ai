import os
from dotenv import load_dotenv
import yfinance as yf
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from agents.langgraph_workflow import app as workflow_app
from groq import Groq
from langfuse import Langfuse
# Load environment variables
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

langfuse = Langfuse(
    secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
    public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
    host=os.getenv("LANGFUSE_HOST")
)
# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Load embedding model
###embedding_model = HuggingFaceEmbeddings(
  ###  model_name="sentence-transformers/all-MiniLM-L6-v2"
###)

# Load vector database
###vector_db = Chroma(
  ###  persist_directory="../../chroma_db",
  ###  embedding_function=embedding_model
###)
def load_vector_db():

    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vector_db = Chroma(
        persist_directory="../../chroma_db",
        embedding_function=embedding_model
    )

    return vector_db
# Request schema
class QueryRequest(BaseModel):
    query: str

# API endpoint
@app.post("/ask")
async def ask_ai(request: QueryRequest):

    with langfuse.start_as_current_observation(
        as_type="span",
        name="financial_ai_workflow",
        input={"query": request.query}
    ) as root_span:

        result = workflow_app.invoke({
            "query": request.query,
            "news_analysis": "",
            "risk_analysis": "",
            "market_analysis": "",
            "final_response": ""
        })

        root_span.update(
            output={
                "final_response": result["final_response"]
            }
        )

        return {
            "response": result["final_response"]
        }
    
@app.get("/market")
async def get_market_data():

    tickers = {
        "BTC": "BTC-USD",
        "ETH": "ETH-USD",
        "SOL": "SOL-USD"
    }

    market_data = []

    for symbol, ticker in tickers.items():

        data = yf.Ticker(ticker)

        hist = data.history(period="2d")

        latest_price = round(hist["Close"].iloc[-1], 2)

        previous_price = hist["Close"].iloc[-2]

        change_percent = round(
            ((latest_price - previous_price) / previous_price) * 100,
            2
        )

        market_data.append({
            "symbol": symbol,
            "name": ticker.replace("-USD", ""),
            "price": latest_price,
            "change": change_percent
        })

    return market_data