from fastapi import FastAPI
import pickle
import pandas as pd
import os

app = FastAPI()

# Load model safely
MODEL_PATH = "food_recommendation_model.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"{MODEL_PATH} not found")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)


# ✅ Root route (no more 404)
@app.get("/")
def home():
    return {"message": "Food Recommendation API is running 🚀"}


# ✅ Get available items (VERY useful)
@app.get("/items")
def get_items():
    try:
        return {"items": list(model.keys())[:50]}
    except Exception as e:
        return {"error": str(e)}


# ✅ Recommendation endpoint (fixed)
@app.get("/recommend/{item_id}")
def recommend(item_id: str):
    try:
        # Check if item exists
        if item_id not in model:
            return {
                "error": f"{item_id} not found",
                "available_items_sample": list(model.keys())[:10]
            }

        scores = model[item_id].sort_values(ascending=False)[1:6]

        return {
            "item": item_id,
            "recommendations": scores.index.tolist()
        }

    except Exception as e:
        return {"error": str(e)}