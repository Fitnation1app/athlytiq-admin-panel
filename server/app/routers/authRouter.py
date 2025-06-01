from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.supabase_config import supabase
from datetime import datetime, timedelta
from jose import jwt
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "5345435")  # replace with env var for production
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class LoginRequest(BaseModel):
    email: str
    password: str

def create_access_token(subject: str, expires_delta: timedelta | None = None):
    to_encode = {"sub": subject}
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
async def login(request: LoginRequest):
    email = request.email
    password = request.password

    user_resp = supabase.table("users").select("*").eq("email", email).single().execute()
    user = user_resp.data

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email")

    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not an admin user")

    stored_password = user.get("password_hash")
    if password != stored_password:
        raise HTTPException(status_code=401, detail="Invalid password")

    access_token = create_access_token(subject=user["email"])
    return {"token": access_token}