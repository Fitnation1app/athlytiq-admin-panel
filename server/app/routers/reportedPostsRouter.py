from fastapi import APIRouter, HTTPException
from app.db.supabase_config import supabase
import logging

router = APIRouter()

@router.get("/", status_code=200)
async def get_reported_posts():
    try:
        logging.info("Fetching reported posts with usernames and profile pictures...")

        response = supabase.table("reported_posts").select(
            """
            reported_post_id,
            posts(id, content, media_url),
            reporter:reportedby_userid(id, username, profiles(profile_picture_url)),
            reported_user:reported_userid(id, username, profiles(profile_picture_url))
            """
        ).execute()

        if not response.data:
            return {
                "message": "No reported posts found.",
                "data": []
            }

        return {
            "message": "Reported posts fetched successfully",
            "data": response.data
        }

    except Exception as e:
        logging.exception("🔥 FULL ERROR STACK TRACE")
        raise HTTPException(status_code=500, detail=f"Backend crashed: {str(e)}")
