from fastapi import FastAPI
import pickle
import pandas as pd

app = FastAPI()

model = pickle.load(open("food_recommendation_model.pkl","rb"))

@app.get("/recommend/{item_id}")
def recommend(item_id: str):

    scores = model[item_id].sort_values(ascending=False)[1:6]

    return {
        "recommendations": scores.index.tolist()
    }

#  uvicorn main:app --reload