from fastapi import APIRouter
from app.db.supabase_config import supabase
from app.models.userModel import User
import logging

logging.basicConfig(level=logging.INFO)

router = APIRouter()

@router.get("/")
async def get_users():
    print("get_users endpoint called") 
    response = supabase.table("users").select("id,username,email,role,status,phone_no").execute()
    users = response.data if isinstance(response.data, list) else [response.data]
    print("Fetched users:", users)
    logging.info(f"Fetched users: {users}")
    return users

@router.get("/{id}")
async def get_user(id: str):
    response = supabase.table("users").select("username,email,role,status,phone_no").eq("id", id).single().execute()
    if not response.data:
        return {"detail": "User not found"}
    return response.data
