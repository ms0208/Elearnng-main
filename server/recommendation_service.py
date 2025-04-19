# recommendation_service.py
import pickle
import numpy as np
import joblib 
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
from datetime import datetime
import json

# Initialize FastAPI app
app = FastAPI(
    title="Course Recommendation API",
    description="API for recommending courses based on user data using LightGBM",
    version="1.0.0"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load the preprocessor and model
MODEL_PATH = "C:\\Users\\user\\Desktop\\Elearnng-main\\server\\mlmodel\\preprocessor_lgbm.pkl"
COURSES_DATA_PATH = "realistic_course_data.json"

try:
    # Load the preprocessor and model
    preprocessor = joblib.load('C:\\Users\\user\\Desktop\\Elearnng-main\\server\\mlmodel\\preprocessor_lgbm.pkl')
    model = joblib.load('C:\\Users\\user\\Desktop\\Elearnng-main\\server\\mlmodel\\course_recommender_lgbm.pkl')
    
    # Load course data
    with open(COURSES_DATA_PATH, 'r') as f:
        courses = pd.DataFrame(json.load(f))
except Exception as e:
    raise RuntimeError(f"Failed to load model or data: {str(e)}")

# Define request/response models
class CourseInfo(BaseModel):
    CourseID: str
    CourseTitle: str
    Description: str
    # Tags: str
    # Category: str
    # CourseRating: float
    Duration:str
    DifficultyLevel:str

class UserProfile(BaseModel):
    UserID: str
    total_courses_taken: int
    avg_rating: float

class RecommendationRequest(BaseModel):
    user_profile: UserProfile
    course_profile:CourseInfo
    # candidate_course_ids: Optional[List[str]] = None
    num_recommendations: int = 10
    exclude_taken_courses: bool = True

class RecommendedCourse(BaseModel):
    course_id: str
    course_title: str
    score: float
    description: Optional[str] = None
    tags: Optional[str] = None
    category: Optional[str] = None
    rating: Optional[float] = None

class RecommendationResponse(BaseModel):
    user_id: str
    recommendations: List[RecommendedCourse]
    timestamp: str

@app.get("/")
def read_root():
    return {
        "message": "Course Recommendation Service is running",
        "model_loaded": model is not None,
        "courses_loaded": not courses.empty
    }

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get personalized course recommendations for a user.
    
    Args:
        user_profile: User information and engagement metrics
        candidate_course_ids: Optional list of course IDs to consider
        num_recommendations: Number of recommendations to return
        exclude_taken_courses: Whether to exclude courses the user has already taken
    
    Returns:
        List of recommended courses with metadata and prediction scores
    """
    try:
        start_time = datetime.now()
        user_data = request.user_profile.dict()
        
        # Get candidate courses
        if request.candidate_course_ids:
            candidate_courses = courses[courses['CourseID'].isin(request.candidate_course_ids)].copy()
        else:
            candidate_courses = courses.copy()
        
        # Prepare features for prediction
        candidate_courses['content_features'] = (
            candidate_courses['Description'].fillna('') + ' ' +
            candidate_courses['Tags'].fillna('') + ' ' +
            candidate_courses['Category'].fillna('')
        )
        
        # Add user features
        candidate_courses['UserID'] = user_data['UserID']
        candidate_courses['total_courses_taken'] = user_data['total_courses_taken']
        candidate_courses['avg_rating'] = user_data['avg_rating']
        
        # Transform features
        X = preprocessor.transform(candidate_courses)
        
        # Get predictions
        candidate_courses['pred_score'] = model.predict_proba(X)[:, 1]
        
        # Prepare recommendations
        recommendations = (
            candidate_courses.sort_values('pred_score', ascending=False)
            .head(request.num_recommendations)
        )
        
        # Format response
        response = {
            "user_id": user_data['UserID'],
            "timestamp": datetime.now().isoformat(),
            "recommendations": [
            {
                "course_id": str(row['CourseID']),  # <-- Converted to string
                "course_title": row['CourseTitle'],
                "score": float(row['pred_score']),
                "description": row['Description'],
                "tags": row['Tags'],
                "category": row['Category'],
                "rating": float(row['CourseRating']) if pd.notna(row['CourseRating']) else None
            }
            for _, row in recommendations.iterrows()
        ]
    }

        
        processing_time = (datetime.now() - start_time).total_seconds()
        print(f"Generated {len(response['recommendations'])} recommendations in {processing_time:.2f}s")
        print(response.items())
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/courses", response_model=List[CourseInfo])
async def get_courses(limit: int = 100):
    """Get a list of available courses"""
    try:
        return courses.head(limit).to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch-recommend")
async def get_batch_recommendations(requests: List[RecommendationRequest]):
    """Get recommendations for multiple users at once"""
    try:
        return [await get_recommendations(request) for request in requests]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,host="127.0.0.1",port=8000)
