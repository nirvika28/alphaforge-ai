import pandas as pd

from datasets import Dataset
from ragas import evaluate
from dotenv import load_dotenv

load_dotenv("../.env")

from ragas.metrics import (
    Faithfulness,
    AnswerRelevancy,
    ContextPrecision
)

# Sample evaluation data
data = {
    "question": [
        "Should I invest in Bitcoin right now?"
    ],
    "answer": [
        """
        Bitcoin carries significant risks including volatility,
        regulatory uncertainty, and liquidity risks.
        """
    ],
    "contexts": [[
        """
        Bitcoin price volatility remains high.
        Institutional investors remain cautiously optimistic.
        """
    ]],
    "ground_truth": [
        """
        Bitcoin is volatile and carries investment risk.
        """
    ]
}

# Convert to dataset
dataset = Dataset.from_pandas(pd.DataFrame(data))

# Run evaluation
result = evaluate(
    dataset=dataset,
    metrics=[
    Faithfulness(),
    AnswerRelevancy(),
    ContextPrecision()
]
)

print(result)