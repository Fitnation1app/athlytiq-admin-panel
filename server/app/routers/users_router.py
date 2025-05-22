from fastapi import APIRouter
from app.db.supabase_config import supabase
router = APIRouter()

@router.get("/")
async def getUsers():
    response = supabase.table("users").select("id,username,email,profiles(bio)").execute()
    print(response.data[0])
    return response.data[0]
