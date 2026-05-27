from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .inference import (
    predict_lstm,
    predict_gru,
    predict_transformer,
    AVAILABLE_MODELS,
)

app = FastAPI(
    title="Phishing Email Detection API",
    description="API for LSTM, GRU, and Transformer phishing email classification",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    subject: str = ""
    body: str = ""
    sender: str = ""
    timestamp: str = ""


def build_text(subject: str, body: str, sender: str, timestamp: str) -> str:
    parts = [sender.strip(), subject.strip(), body.strip(), timestamp.strip()]
    return "\n".join([part for part in parts if part])


@app.get("/")
def home():
    return {
        "message": "Phishing Detection API Running",
        "available_models": list(AVAILABLE_MODELS),
    }


@app.post("/predict/{model_name}")
def predict(model_name: str, data: EmailRequest):
    model_name = model_name.lower()
    if model_name not in AVAILABLE_MODELS:
        raise HTTPException(status_code=404, detail="Model not found")

    text = build_text(data.subject, data.body, data.sender, data.timestamp)

    if model_name == "lstm":
        return predict_lstm(text)
    if model_name == "gru":
        return predict_gru(text)
    if model_name == "transformer":
        return predict_transformer(text)

    raise HTTPException(status_code=400, detail="Unsupported model")
