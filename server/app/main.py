from app.routers import authRouter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from typing import List 
from app.routers import users_router,workouts_router,community_router,reportedPostsRouter,dashboardRouter
from app.db import * 
from dotenv import load_dotenv
import uuid 
import os

load_dotenv()

origins = [
    "*"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router.router, prefix="/users", tags=["Users"])
app.include_router(workouts_router.router, prefix="/workouts", tags=["Workouts"])
app.include_router(community_router.router, prefix="/communities", tags=["Communities"])
app.include_router(reportedPostsRouter.router, prefix="/reported_posts", tags=["Reported Posts"])
app.include_router(dashboardRouter.router, prefix="/dashboard_stats", tags=["Dashboard"])
app.include_router(authRouter.router, prefix="/auth", tags=["Auth"])

@app.get("/")
async def root():
    return {"message":"Hello world from fastAPI"}