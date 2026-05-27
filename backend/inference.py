from pathlib import Path
import pickle
import re
from typing import Dict, Any

import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences

try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
except ImportError:  # pragma: no cover
    AutoTokenizer = None
    AutoModelForSequenceClassification = None
    torch = None

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"
TF_MAXLEN = 200
TRANSFORMER_MAXLEN = 256
AVAILABLE_MODELS = {"lstm", "gru", "transformer"}
LABELS = ["Legitimate", "Phishing"]


def preprocess(text: str) -> str:
    if not isinstance(text, str):
        return ""

    text = text.lower()
    text = re.sub(r"https?://\S+", " ", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def load_pickle(path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(f"Tokenizer file not found: {path}")
    with open(path, "rb") as file:
        return pickle.load(file)


def load_tokenizer():
    return load_pickle(MODEL_DIR / "tokenizer.pkl")


tokenizer = load_tokenizer()


def load_tf_model(path: Path) -> tf.keras.Model:
    if not path.exists():
        raise FileNotFoundError(f"Model file not found: {path}")
    return tf.keras.models.load_model(str(path))


lstm_model = load_tf_model(MODEL_DIR / "lstm_model.h5")
gru_model = load_tf_model(MODEL_DIR / "gru_model.h5")

_transformer_resources = None


def load_transformer_resources():
    if AutoTokenizer is None or AutoModelForSequenceClassification is None or torch is None:
        raise ImportError(
            "Transformer inference requires the 'transformers' and 'torch' packages. "
            "Install them with `pip install transformers torch`."
        )

    model_path = MODEL_DIR / "bert_model"
    if not model_path.exists():
        raise FileNotFoundError(f"Transformer model directory not found: {model_path}")

    tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
    model = AutoModelForSequenceClassification.from_pretrained(model_path, local_files_only=True)
    return tokenizer, model


def get_transformer_resources():
    global _transformer_resources
    if _transformer_resources is None:
        _transformer_resources = load_transformer_resources()
    return _transformer_resources


def sequence_prediction(model: tf.keras.Model, text: str) -> Dict[str, Any]:
    clean_text = preprocess(text)
    sequence = tokenizer.texts_to_sequences([clean_text])
    padded = pad_sequences(sequence, maxlen=TF_MAXLEN)

    raw = model.predict(padded, verbose=0)
    probability = float(raw[0][0])
    label = LABELS[int(probability > 0.5)]

    return {
        "model": model.name if hasattr(model, "name") else "sequence",
        "probability": round(probability, 4),
        "prediction": label,
    }


def predict_lstm(text: str) -> Dict[str, Any]:
    return sequence_prediction(lstm_model, text)


def predict_gru(text: str) -> Dict[str, Any]:
    return sequence_prediction(gru_model, text)


def predict_transformer(text: str) -> Dict[str, Any]:
    tokenizer, model = get_transformer_resources()
    clean_text = preprocess(text)
    encoded = tokenizer(
        clean_text,
        padding="max_length",
        truncation=True,
        max_length=TRANSFORMER_MAXLEN,
        return_tensors="pt",
    )

    model.eval()
    with torch.no_grad():
        outputs = model(**encoded)
        logits = outputs.logits
        if logits.shape[-1] == 1:
            probability = float(torch.sigmoid(logits)[0][0].cpu().numpy())
        else:
            probabilities = torch.softmax(logits, dim=-1)
            probability = float(probabilities[0][1].cpu().numpy())

    label = LABELS[int(probability > 0.5)]
    return {
        "model": "transformer",
        "probability": round(probability, 4),
        "prediction": label,
    }
