# Phishing Email Detection

This repository implements an enterprise-style phishing email classification system using LSTM, GRU, and Transformer-based deep learning models.

## Repository Structure

- `backend/`
  - `main.py` - FastAPI inference service for LSTM, GRU, and Transformer models
  - `inference.py` - shared model loading and prediction logic
- `frontend/` - **React + Vite** web dashboard (primary UI)
  - `src/App.jsx` - main application component
  - `src/api.js` - API client for the FastAPI backend
  - `src/components/` - reusable UI components
- `streamlit-frontend/`
  - `app.py` - legacy Streamlit UI for model comparison
- `models/`
  - `lstm_model.h5`
  - `gru_model.h5`
  - `tokenizer.pkl`
  - `bert_model/` - fine-tuned transformer model folder
- `requirements.txt` - Python dependency manifest

## Setup

Recommended Python version: `3.11.x` on macOS Apple Silicon.

```bash
cd /Users/priya/Desktop/phishing-detector
python3.11 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

## Run the React frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at **http://localhost:3000**. The React frontend calls the FastAPI backend for inference.

## Run the legacy Streamlit frontend

```bash
streamlit run streamlit-frontend/app.py
```

## Run the backend API

```bash
uvicorn backend.main:app --reload
```

Then call the API using:

```bash
curl -X POST "http://127.0.0.1:8000/predict/lstm" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Verify account","body":"Your login is expired. Click here to update.","sender":"support@example.com","timestamp":"2026-05-27 14:00:00"}'
```

## Notes

- The Streamlit app loads the three downloaded models directly for local inference.
- The Transformer uses the local `models/bert_model` folder and the tokenizer in `models/tokenizer.pkl`.
- If you are on macOS and want accelerated TensorFlow, use `tensorflow-macos` and `tensorflow-metal`.

## Troubleshooting

- If `tensorflow-macos` is unavailable, confirm that your virtual environment uses Python 3.11:

```bash
python -V
```

- If the transformer package fails to load, install it manually:

```bash
python -m pip install transformers torch
```
