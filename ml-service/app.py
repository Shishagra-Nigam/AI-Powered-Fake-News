import os
import re
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

from train import StylometricFeatureExtractor, CLICKBAIT_TRIGGERS, CREDIBLE_TRIGGERS
from neural_llm import analyze_with_neural_llm

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'model')
MODEL_PATH = os.path.join(MODEL_DIR, 'model.pkl')

app = Flask(__name__)
CORS(app)

pipeline = None

def load_ml_pipeline():
    global pipeline
    if os.path.exists(MODEL_PATH):
        try:
            pipeline = joblib.load(MODEL_PATH)
            print("Successfully loaded hybrid ML model pipeline.")
        except Exception as e:
            print(f"Error loading model artifact: {e}. Attempting auto-retrain...")
            from train import train_and_evaluate
            pipeline = train_and_evaluate()
    else:
        print("Model artifact not found. Auto-training hybrid model...")
        from train import train_and_evaluate
        pipeline = train_and_evaluate()

load_ml_pipeline()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'fake-news-ml-microservice',
        'model_loaded': pipeline is not None,
        'neural_llm_active': True
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({'error': 'Request payload must be JSON'}), 400
    
    data = request.get_json()
    text = data.get('text', '')
    headline = data.get('headline', '')
    
    combined_content = f"{headline} {text}".strip()
    if not combined_content:
        return jsonify({'error': 'No text or headline provided for classification'}), 400
    
    if pipeline is None:
        load_ml_pipeline()

    try:
        # 1. Classical Hybrid ML Model Inference
        probabilities = pipeline.predict_proba([combined_content])[0]
        prob_reliable = float(probabilities[0])
        prob_fake = float(probabilities[1])

        # 2. Dedicated Local Neural LLM Transformer Inference
        neural_res = analyze_with_neural_llm(text, headline)

        # Synthesize ML Probabilities with Neural LLM Outputs
        blended_prob_fake = (prob_fake * 0.40) + (neural_res['prob_fake'] * 0.60)
        blended_prob_reliable = 1.0 - blended_prob_fake

        lower_content = combined_content.lower()
        clickbait_hits = sum(1 for pat in CLICKBAIT_TRIGGERS if re.search(pat, lower_content))
        credible_hits = sum(1 for pat in CREDIBLE_TRIGGERS if re.search(pat, lower_content))

        if clickbait_hits >= 2:
            blended_prob_fake = min(0.99, blended_prob_fake + 0.25)
            blended_prob_reliable = 1.0 - blended_prob_fake
        elif credible_hits >= 2 and clickbait_hits == 0:
            blended_prob_reliable = min(0.99, blended_prob_reliable + 0.20)
            blended_prob_fake = 1.0 - blended_prob_reliable

        raw_label = 1 if blended_prob_fake >= 0.50 else 0
        
        if blended_prob_fake >= 0.60:
            classification = 'misleading'
            confidence = blended_prob_fake * 100
        elif blended_prob_fake <= 0.35:
            classification = 'reliable'
            confidence = blended_prob_reliable * 100
        else:
            classification = 'unverified'
            confidence = max(blended_prob_fake, blended_prob_reliable) * 100

        return jsonify({
            'status': 'success',
            'classification': classification,
            'label': raw_label,
            'fake_probability': round(blended_prob_fake, 4),
            'reliable_probability': round(blended_prob_reliable, 4),
            'confidence_score': round(confidence, 2),
            'dedicated_neural_llm': neural_res
        }), 200

    except Exception as err:
        print(f"[PREDICT ERROR] {err}")
        return jsonify({'error': f"Prediction error: {str(err)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting Python ML REST Service with Dedicated Neural LLM on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
