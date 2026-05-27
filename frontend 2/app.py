import sys
import pathlib

import streamlit as st

ROOT_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT_DIR))

from backend.inference import predict_lstm, predict_gru, predict_transformer


def build_input_text(subject: str, body: str, sender: str, timestamp: str) -> str:
    components = [sender.strip(), subject.strip(), body.strip(), timestamp.strip()]
    return "\n".join([part for part in components if part])


def render_result(card_title: str, prediction: dict) -> None:
    st.subheader(card_title)
    st.metric("Prediction", prediction["prediction"])
    st.metric("Phishing Probability", f"{prediction['probability'] * 100:.2f}%")

    st.write(
        "Model details: "
        f"{prediction['model']}\n\n"
        "A probability above 50% is treated as phishing in this deployment. "
        "Adjust the threshold in the backend for enterprise sensitivity tuning."
    )


def main():
    st.set_page_config(
        page_title="Phishing Email Detection",
        page_icon="🛡️",
        layout="wide",
    )

    st.title("Phishing Email Detection Dashboard")
    st.markdown(
        "This application compares LSTM, GRU, and Transformer-based phishing email classifiers. "
        "Enter email content below and inspect how each model interprets the message."
    )

    with st.expander("Project overview", expanded=True):
        st.markdown(
            "- **Industry:** Cybersecurity / Email Security AI\n"
            "- **Models:** LSTM, GRU, Transformer (BERT-style)\n"
            "- **Output:** phishing probability score and final label\n"
            "- **Evaluation focus:** sensitivity vs false-positive rates"
        )

    with st.sidebar:
        st.header("Email features")
        sender = st.text_input("Sender address", value="phisher@example.com")
        subject = st.text_input("Subject line", value="Please verify your account immediately")
        body = st.text_area(
            "Email body",
            value="Dear user, your account is at risk. Click the secure link below to update your credentials now.",
            height=240,
        )
        timestamp = st.text_input("Timestamp", value="2026-05-27 14:32:00")
        models = st.multiselect(
            "Select models to compare",
            ["LSTM", "GRU", "Transformer"],
            default=["LSTM", "Transformer"],
        )
        threshold = st.slider("Phishing threshold", min_value=0.0, max_value=1.0, value=0.5, step=0.01)

    if st.button("Run inference"):
        input_text = build_input_text(subject, body, sender, timestamp)
        if not input_text.strip():
            st.error("Please enter at least some email content before running inference.")
            return

        results = {}
        if "LSTM" in models:
            results["LSTM"] = predict_lstm(input_text)
        if "GRU" in models:
            results["GRU"] = predict_gru(input_text)
        if "Transformer" in models:
            results["Transformer"] = predict_transformer(input_text)

        score_columns = st.columns(len(results))
        for column, (name, prediction) in zip(score_columns, results.items()):
            with column:
                st.metric(f"{name} label", prediction["prediction"])
                st.metric(
                    "Probability",
                    f"{prediction['probability'] * 100:.2f}%",
                )

        st.markdown("---")
        st.subheader("Model comparison details")
        for name, prediction in results.items():
            st.write(f"**{name}**: {prediction['model']} — {prediction['prediction']} ")

        st.markdown(
            "### Deployment notes\n"
            "- Lower thresholds increase sensitivity and may raise false positives.\n"
            "- Higher thresholds reduce false positives but risk false negatives.\n"
            "- Use the Transformer model for best contextual understanding on complex phishing phrasing."
        )

    st.sidebar.markdown("---")
    st.sidebar.write(
        "This dashboard is a production-ready prototype for email security teams. "
        "Use the backend API at `uvicorn backend.main:app --reload` if you want a separately hosted inference service."
    )


if __name__ == "__main__":
    main()
