import os
import re
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    classification_report,
    confusion_matrix
)

# Paths configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'model')
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODEL_PATH = os.path.join(MODEL_DIR, 'model.pkl')
CSV_DATA_PATH = os.path.join(DATA_DIR, 'news_dataset.csv')

# Stylometric & Linguistic Trigger Lists
CLICKBAIT_TRIGGERS = [
    r'shocking', r'miracle', r'you won\'?t believe', r'big pharma', r'banned',
    r'secret', r'doctors are furious', r'what they don\'?t want you to know',
    r'they are lying', r'leaked', r'unbelievable truth', r'share before it\'?s deleted',
    r'mind control', r'alien mothership', r'classified evidence', r'must see',
    r'instant cure', r'destroys all', r'overnight', r'hidden truth'
]

CREDIBLE_TRIGGERS = [
    r'according to', r'published in', r'researchers', r'study', r'official',
    r'journal', r'university', r'spokesperson', r'data shows', r'peer-reviewed',
    r'reporters', r'federal', r'ministry', r'conference', r'announced on',
    r'department', r'international', r'analysts', r'institute'
]

class StylometricFeatureExtractor(BaseEstimator, TransformerMixin):
    """Custom Scikit-Learn Transformer to extract stylometric & linguistic features."""
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        features = []
        for text in X:
            if not isinstance(text, str):
                text = ""
            
            length = len(text) + 1
            words = text.split()
            word_count = len(words) + 1
            
            # 1. Uppercase ratio (capitalized words like BREAKING, SHOCKING)
            uppercase_words = sum(1 for w in words if w.isupper() and len(w) > 1)
            uppercase_ratio = uppercase_words / word_count
            
            # 2. Exclamation mark count
            exclamation_count = text.count('!')
            
            # 3. Question mark count
            question_count = text.count('?')
            
            # 4. Clickbait trigger phrase count
            lower_text = text.lower()
            clickbait_matches = sum(1 for pat in CLICKBAIT_TRIGGERS if re.search(pat, lower_text))
            
            # 5. Credible attribution phrase count
            credible_matches = sum(1 for pat in CREDIBLE_TRIGGERS if re.search(pat, lower_text))
            
            # 6. Average word length
            avg_word_len = sum(len(w) for w in words) / word_count
            
            features.append([
                uppercase_ratio,
                exclamation_count,
                question_count,
                clickbait_matches,
                credible_matches,
                avg_word_len
            ])
        return np.array(features)

def clean_text(text):
    """Normalize text for word TF-IDF vectorization."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def generate_sample_dataset():
    """Generates a rich multi-domain training corpus of real and fake/misleading news articles."""
    print("Generating comprehensive multi-domain training corpus...")
    
    real_articles = [
        # Science & Astronomy
        ("NASA's James Webb Telescope Discovers Exoplanet Atmosphere", 
         "NASA's James Webb Space Telescope has captured detailed atmospheric observations of a rocky exoplanet located 40 light-years from Earth. Researchers confirmed the presence of water vapor and carbon dioxide using transmission spectroscopy. The study, published in Nature astronomy journal, represents a major milestone in interstellar astrophysics."),
        ("Breakthrough Fusion Energy Experiment Achieves Net Energy Gain", 
         "Scientists at Lawrence Livermore National Laboratory repeated a fusion reaction yielding more energy than consumed by the driver lasers. Independent peer review confirmed net energy gain of 3.15 megajoules."),
        ("Deep Sea Exploration Uncovers Previously Unknown Marine Ecosystems", 
         "Oceanographers deploying remote underwater vehicles discovered hydrothermal vent ecosystems teeming with novel tubeworms and chemotrophic bacteria at depths exceeding 4,000 meters in the Pacific Ocean."),
        
        # Economics & Finance
        ("Federal Reserve Holds Interest Rates Steady Amid Inflation Data", 
         "The Federal Reserve announced on Wednesday that benchmark interest rates will remain unchanged. Chairman Powell cited recent CPI data indicating inflation has slowed to 2.4% annually. Financial analysts expect monetary policy to remain data-dependent over the coming quarters."),
        ("European Central Bank Lowers Benchmark Interest Rates by 25 Basis Points", 
         "The European Central Bank announced a quarter-point rate reduction following declining Eurozone inflation metrics. Financial policymakers confirmed the decision reflects stabilized consumer price indexes across member states."),
        ("Global Semiconductor Manufacturing Capacity Expands with New Facilities", 
         "Advanced microchip fabrication facilities opened in Arizona and Dresden today, increasing global semiconductor supply chain resilience for automotive and consumer electronics sectors."),
        
        # Medicine & Health
        ("World Health Organization Approves Next-Generation Malaria Vaccine", 
         "The World Health Organization has recommended the R21/Matrix-M malaria vaccine for child immunization. Clinical trials conducted across four African nations demonstrated 75% efficacy in reducing symptomatic malaria cases over a 12-month period."),
        ("Cancer Immunotherapy Trial Shows Promising Long-Term Remission", 
         "Oncology researchers at Johns Hopkins Medicine reported phase II clinical trial results showing a 62% sustained remission rate in patients receiving targeted CAR-T cell therapy for refractory lymphoma."),
        ("Clinical Trial Validates New Alzheimer's Drug for Early-Stage Patients", 
         "Medical researchers at Harvard Medical School published clinical trial results demonstrating a 30% reduction in cognitive decline among early-stage Alzheimer's patients receiving monoclonal antibody therapy."),

        # Climate & Technology
        ("Global Climate Summit Reaches Accord on Renewable Energy Transition", 
         "Delegates from 195 countries reached a consensus to triple global renewable energy capacity by 2030. The agreement establishes a international fund to support developing nations in phasing out coal power plants."),
        ("Tech Sector Standardizes AI Ethics and Verification Frameworks", 
         "Leading technology companies and research universities have agreed on a unified verification protocol for synthetic media. The standard incorporates cryptographic watermarks to identify AI-generated audio and video content."),
        ("Agricultural Robotics System Cuts Pesticide Use by 40 Percent", 
         "Agritech trials across Midwest farms confirmed that precision AI-guided spraying robots reduced chemical pesticide usage by 40% while preserving crop yields."),

        # Politics & Governance
        ("Bipartisan Infrastructure Bill Passes Senate with 68 Votes", 
         "The United States Senate voted 68-31 to approve a comprehensive infrastructure bill targeting bridges, clean water networks, and high-speed broadband expansion. The legislation now moves to the President's desk for signature."),
        ("European Union Enacts Comprehensive Data Privacy Regulations", 
         "European Union regulators have implemented updated digital market guidelines requiring platform transparency and algorithmic accountability. Compliance reviews will begin next quarter across all member states.")
    ]
    
    fake_articles = [
        # Health & Miracle Cures
        ("MIRACLE CURE: Common Kitchen Ingredient Destroys All Diseases Overnight!", 
         "Big Pharma is terrified! Secret medical documents leaked by anonymous insiders prove drinking diluted baking soda with lemon completely cures stage 4 cancer and diabetes within 24 hours! Doctors are banned from speaking about this simple trick."),
        ("Celebrity Claims Drinking Raw Secret Elixir Reversed Biological Age by 30 Years!", 
         "Hollywood superstars are secretly using an unapproved miracle potion harvested from deep sea crystals that reverses DNA aging instantly! Doctors are furious but millions are ordering online before regulators ban it!"),
        ("Drink This Secret Tea to Lose 50 Pounds in 3 Days Without Exercise!", 
         "Weight loss industry exposed! A rare ancient Amazonian herb melts belly fat instantly while you sleep. Clinical trials were suppressed by diet food manufacturers to protect billion dollar profits!"),
        ("Shocking Discovery: Vegetables Contain Secret Toxins Designed to WEAKEN Humans!", 
         "Health experts warn that common broccoli and spinach were genetically engineered by global authorities to reduce human IQ and cause chronic fatigue. Switch to the all-meat secret diet today!"),

        # Conspiracies & Weather Control
        ("Secret Secret Government Satellite Emits Frequencies Controlling Weather", 
         "Whistleblowers reveal secret military satellites beam scalar energy directly into hurricane centers to manipulate global weather patterns and crash stock markets. Government officials refuse to address the classified electromagnetic grid."),
        ("5G Towers Confirmed to Transmit Mind Control Signals During Nighttime", 
         "Independent researchers discovered 5G towers operate on secret frequencies designed to induce compliance and lethargy in urban populations between 2 AM and 5 AM. Share this before it gets taken down!"),
        ("Billionaire Secretly Replaces City Water Supply with Microchip Fluid", 
         "Shocking investigative report reveals globalist elites added nanotech tracking liquid into municipal tap water across major cities to monitor citizen movements 24/7."),
        ("Government Bans Growing Your Own Food in Backyard Gardens Nationwide!", 
         "Executive order signed last night makes home gardening illegal under penalty of immediate arrest! Authorities claim backyard vegetables threaten corporate agricultural monopolies."),

        # Aliens & Historical Hoaxes
        ("Alien Spacecraft Uncovered Below Antarctic Ice Sheet by Satellite Imagery", 
         "Shocking leaked satellite footage confirms a massive alien mothership buried beneath Antarctic ice for 10,000 years! Military forces have blockaded the continent while secret elites extract alien technology."),
        ("Leaked Documents Prove Dinosaurs Still Alive on Remote Undiscovered Island", 
         "Brave explorers released classified photographs showing living Tyrannosaurus Rex herds roaming an island hidden by government radar cloaking devices in the South Pacific."),
        ("Moon Landing Was Filmed in Underground Studio, Director Confesses on Deathbed", 
         "A legendary Hollywood director left behind a sealed confession recording proving the 1969 Apollo moon landing was staged on a desert film set using miniature models and wires."),
        ("Scientists Discover Time Portal in Bermuda Triangle Teleporting Ships to 1920", 
         "Renowned physicists confirm that temporal anomalies in the Bermuda Triangle open wormholes into past decades. Ships missing since 1945 were recently spotted docked in 1928 ports!")
    ]

    data = []
    
    # Add base articles
    for title, text in real_articles:
        data.append({'title': title, 'text': text, 'label': 0})
    for title, text in fake_articles:
        data.append({'title': title, 'text': text, 'label': 1})

    # Synthesize rich variations with diverse prefixes and structural shifts
    real_prefixes = [
        "According to official reports published today, {body} Policy experts noted that the findings reflect long-term trends.",
        "A formal study conducted by leading researchers revealed that {body} Further peer-reviewed evidence will be released next month.",
        "Official representatives confirmed in a press conference that {body} Market reactions remained stable following the statement.",
        "In a peer-reviewed publication, scientists demonstrated that {body} The methodology was validated across multiple independent trials.",
        "Data released by international regulators highlights that {body} Compliance frameworks are scheduled to take effect next year.",
        "Spokespersons for the organization stated that {body} Additional research teams are verifying the initial data."
    ]
    
    fake_prefixes = [
        "SHOCKING LEAK! Mainstream media won't show you this: {body} Click here before regulators delete this video!",
        "UNBELIEVABLE TRUTH REVEALED! Insiders expose that {body} Share this secret message with everyone you know immediately!",
        "THEY ARE LYING TO YOU! What doctors and government officials don't want you to know: {body} Miracle solution exposed!",
        "CLASSIFIED EVIDENCE EXPOSED! Anonymous sources confirm {body} Big Pharma and corrupt elites are terrified!",
        "DONT BE FOOLED! Secret documents confirm {body} Act now before it is banned forever!",
        "MUST SEE EXPOSURE! Independent whistleblowers reveal {body} Wake up before it is too late!"
    ]
    
    for i in range(25):
        for title, text in real_articles:
            tmpl = real_prefixes[i % len(real_prefixes)]
            data.append({
                'title': f"{title} (Official Update)" if i % 3 == 0 else title,
                'text': tmpl.format(body=text),
                'label': 0
            })
            
        for title, text in fake_articles:
            tmpl = fake_prefixes[i % len(fake_prefixes)]
            data.append({
                'title': f"SHOCKING: {title}" if i % 2 == 0 else title,
                'text': tmpl.format(body=text),
                'label': 1
            })
            
    df = pd.DataFrame(data)
    os.makedirs(DATA_DIR, exist_ok=True)
    df.to_csv(CSV_DATA_PATH, index=False)
    print(f"Dataset successfully created and saved to {CSV_DATA_PATH} (Total samples: {len(df)})")
    return df

def train_and_evaluate():
    """Trains hybrid TF-IDF + Stylometric Logistic Regression pipeline."""
    df = generate_sample_dataset()
    
    df['full_content'] = df['title'].fillna('') + ' ' + df['text'].fillna('')
    X = df['full_content']
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("\n--- Building Hybrid Feature Extraction Pipeline ---")
    
    # 1. Word TF-IDF Vectorizer
    word_vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=4000,
        sublinear_tf=True,
        stop_words='english'
    )
    
    # 2. Character N-Gram Vectorizer (captures sub-word patterns like SHOCKING, !!!, cures, miracle)
    char_vectorizer = TfidfVectorizer(
        analyzer='char_wb',
        ngram_range=(3, 5),
        max_features=4000,
        sublinear_tf=True
    )
    
    # 3. Stylometric Features + Scaler
    stylometric_pipeline = Pipeline([
        ('extractor', StylometricFeatureExtractor()),
        ('scaler', StandardScaler())
    ])
    
    # Combined Feature Union
    feature_union = FeatureUnion([
        ('word_tfidf', word_vectorizer),
        ('char_tfidf', char_vectorizer),
        ('stylometrics', stylometric_pipeline)
    ])
    
    # Classifier Pipeline
    full_pipeline = Pipeline([
        ('features', feature_union),
        ('classifier', LogisticRegression(C=2.0, solver='liblinear', random_state=42))
    ])
    
    print("Fitting model pipeline on training set...")
    full_pipeline.fit(X_train, y_train)
    
    # Evaluate predictions
    y_pred = full_pipeline.predict(X_test)
    y_proba = full_pipeline.predict_proba(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
    cm = confusion_matrix(y_test, y_pred)
    
    print("\n==========================================")
    print("  HYBRID MODEL EVALUATION METRICS (TEST SET)")
    print("==========================================")
    print(f" Accuracy : {accuracy * 100:.2f}%")
    print(f" Precision: {precision * 100:.2f}%")
    print(f" Recall   : {recall * 100:.2f}%")
    print(f" F1-Score : {f1 * 100:.2f}%")
    print("\nClassification Report:\n")
    print(classification_report(y_test, y_pred, target_names=['Reliable (0)', 'Fake/Misleading (1)']))
    print("Confusion Matrix:\n", cm)
    print("==========================================\n")
    
    # Save unified pipeline model
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(full_pipeline, MODEL_PATH)
    print(f"Hybrid ML Model Pipeline saved successfully to: {MODEL_PATH}")
    
    return full_pipeline

if __name__ == '__main__':
    train_and_evaluate()
