from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_VERSION = "1.0"

# Load model safely
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "iris_model.pkl")
model = joblib.load(model_path)

# Class names
class_names = ["setosa", "versicolor", "virginica"]


class FlowerInput(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float


@app.get("/")
def home():
    return {"message": "Iris ML API is running 🚀"}


@app.post("/predict")
def predict(data: FlowerInput):

    input_data = [[
        data.sepal_length,
        data.sepal_width,
        data.petal_length,
        data.petal_width
    ]]

    prediction_index = model.predict(input_data)[0]
    prediction_label = class_names[prediction_index]

    probabilities = model.predict_proba(input_data)[0]
    confidence = max(probabilities)

    return {
        "prediction": prediction_label,
        "confidence": float(confidence),
        "model_version": MODEL_VERSION
    }