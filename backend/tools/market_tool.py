import yfinance as yf

def get_crypto_data(symbol="BTC-USD"):

    ticker = yf.Ticker(symbol)

    data = ticker.history(period="5d")

    latest_close = data["Close"].iloc[-1]
    previous_close = data["Close"].iloc[-2]

    price_change = latest_close - previous_close
    percent_change = (price_change / previous_close) * 100

    return {
    "symbol": symbol,
    "latest_price": float(round(latest_close, 2)),
    "change_percent": float(round(percent_change, 2))
}


if __name__ == "__main__":

    result = get_crypto_data()

    print(result)