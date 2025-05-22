from fastapi import APIRouter
from app.db.supabase_config import supabase
from typing import List
from app.models.workoutModel import Workout

router = APIRouter()

@router.get("/")
async def getWorkouts():
    response = supabase.table("workouts").select("id,name,description,difficulty,imageUrl").execute()
    workouts = response.data if isinstance(response.data, list) else [response.data]
    print(workouts)
    return workouts


@router.post("/")
async def postWorkouts(workout:Workout):
    response = supabase.table("workouts").insert(workout.dict()).execute
    return response.data[0]

@router.put("/{id}")
async def updateWorkouts(id:str,workout:Workout):
    response = supabase.table("workouts").update(workout.dict()).eq("id",id).execute()
    return response.data[0]
@router.delete("/{id}")
async def deleteWorkouts(id:str):
    response = supabase.table("workouts").delete().eq("id",id).execute()
    return {"message": "Workout deleted", "id": id}