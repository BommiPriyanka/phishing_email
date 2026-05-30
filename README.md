# Phishing Email Detection

This repository implements a phishing email classification system using LSTM, GRU, and Transformer-based deep learning models. It features a modern React + Vite frontend dashboard and a FastAPI backend service.

---

## Repository Structure

- `main_code/`
  - `backend/`
    - `main.py` - FastAPI inference service for LSTM, GRU, and Transformer models
    - `inference.py` - Shared model loading and prediction logic
  - `frontend/` - **React + Vite** web dashboard (primary UI)
    - `src/App.jsx` - Main application component
    - `src/api.js` - API client for the FastAPI backend
    - `src/components/` - Reusable UI components
  - `streamlit-frontend/`
    - `app.py` - Legacy Streamlit UI for model comparison
- `requirements.txt` - Python dependency manifest

---

## Instructions for Running Locally (For You & Your Friends)

Since the machine learning model files are very large (approx. 418 MB total), they are excluded from this GitHub repository. 

### Step 1: Clone the Repository
```bash
git clone https://github.com/BommiPriyanka/phishing_email.git
cd phishing_email
```

### Step 2: Download and Place the `models/` Directory
1. Download the `models/` folder shared by the repository owner (e.g., from Google Drive or OneDrive).
2. Extract/copy the `models/` directory directly into the root folder of this project so it looks like:
   ```text
   phishing_email/
   ├── Docs/
   ├── main_code/
   │   ├── backend/
   │   ├── frontend/
   │   └── streamlit-frontend/
   ├── models/
   │   ├── bert_model/
   │   ├── gru_model.h5
   │   ├── lstm_model.h5
   │   └── tokenizer.pkl
   └── requirements.txt
   ```

### Step 3: Run the Backend (FastAPI)
1. Set up a virtual environment and install Python dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Start the FastAPI server:
   ```bash
   # On macOS (especially Apple Silicon):
   export DYLD_LIBRARY_PATH="/opt/homebrew/opt/expat/lib"
   export CUDA_VISIBLE_DEVICES="-1"
   uvicorn main_code.backend.main:app --host 127.0.0.1 --port 8000
   
   # On Windows/Linux:
   uvicorn main_code.backend.main:app --host 127.0.0.1 --port 8000
   ```

### Step 4: Run the Frontend (React + Vite)
1. Open a new terminal window/tab.
2. Install packages and start the Vite dev server:
   ```bash
   cd main_code/frontend
   npm install
   npm run dev
   ```
3. Open your web browser and go to **`http://localhost:3000`** to use the application!

