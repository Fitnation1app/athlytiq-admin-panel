from fastapi import APIRouter
from app.db.supabase_config import supabase
from app.models.userModel import User
import logging

logging.basicConfig(level=logging.INFO)

router = APIRouter()

@router.get("/")
async def get_users():
    response = (
        supabase.table("users")
        .select("id,username,email,status,phone_no,role,profiles(profile_picture_url)")
        .execute()
    )
    users = response.data if isinstance(response.data, list) else [response.data]
    # Flatten profile_picture_url for each user
    for user in users:
        user["profile_picture_url"] = user.get("profiles", {}).get("profile_picture_url", "")
        user.pop("profiles", None)
    return users

@router.get("/{id}")
async def get_user(id: str):
    response = (
        supabase.table("users")
        .select("username,email,status,phone_no,role,profiles(profile_picture_url)")
        .eq("id", id)
        .single()
        .execute()
    )
    user = response.data
    if not user:
        return {"detail": "User not found"}
    user["profile_picture_url"] = user.get("profiles", {}).get("profile_picture_url", "")
    user.pop("profiles", None)
    return user