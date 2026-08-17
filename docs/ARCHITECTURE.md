# Architecture & Technical Design Document

## 1. Hybrid ML + LLM System Methodology

VeritasAI combines classical statistical Machine Learning with modern Large Language Models to achieve optimal speed, auditability, and deep contextual reasoning.

```text
[ Article Text / URL Input ]
           │
           ├──► [ Express Web Scraper ] (Extracts title + paragraphs via Cheerio)
           │
           ├──► [ Python ML Microservice ] (TF-IDF + Logistic Regression)
           │      └── Output: Fake/Reliable Probability Score & ML Label
           │
           ├──► [ LLM Reasoning Layer ] (Claude API / Fallback Heuristic Engine)
           │      └── Output: Categorical Summaries & Red-Flag Inline Phrases
           │
           ▼
[ Weighted Credibility Score Synthesizer ]
           │
           ▼
[ React Frontend UI Dashboard & MongoDB Record ]
```

---

## 2. Mathematical Credibility Formula

When both the Python ML microservice and LLM reasoning layer return outputs, the final score ($S_{final} \in [0, 100]$) is calculated as:

$$S_{final} = \text{round}\left( \big((1 - P_{fake}) \times 100 \times w_{ml}\big) + \big(S_{llm} \times w_{llm}\big) \right)$$

Where:
- $P_{fake}$: Probability output by Logistic Regression model that the text is fake ($P_{fake} \in [0, 1]$).
- $S_{llm}$: Score returned by LLM analysis ($S_{llm} \in [0, 100]$).
- $w_{ml} = 0.40$ (40% weight to statistical feature frequency).
- $w_{llm} = 0.60$ (60% weight to contextual reasoning & sourcing).

---

## 3. Microservice Vectorization Pipeline

The classical classifier utilizes:
- **TF-IDF Sublinear Scaling**: Dampens high-frequency word counts to prevent dominant terms from skewing predictions ($tf = 1 + \log(tf)$).
- **N-Gram Ranges**: Evaluates single words and bigrams (`ngram_range=(1, 2)`), capturing phrases like "miracle cure", "big pharma", and "classified evidence".
- **Logistic Regression Classifier**: Fitted with L2 regularization ($C=1.5$, `solver='liblinear'`).

---

## 4. API Endpoints Contract

### Python ML Service (`http://127.0.0.1:5001`)
- `GET /health`: Returns service health status and artifact state.
- `POST /predict`: Accepts `{ text, headline }`, returns `{ classification, label, fake_probability, reliable_probability, confidence_score }`.

### Express Gateway Server (`http://127.0.0.1:5000`)
- `POST /api/analyze`: Main analysis pipeline (accepts raw text or URL).
- `POST /api/auth/register`: User registration.
- `POST /api/auth/login`: User login, returns JWT token.
- `GET /api/history`: Retrieves saved analysis records with pagination & search.
- `DELETE /api/history/:id`: Deletes specific analysis record.
