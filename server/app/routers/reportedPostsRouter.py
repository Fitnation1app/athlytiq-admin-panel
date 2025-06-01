from fastapi import APIRouter, HTTPException, status
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
            report_tags,
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


@router.delete("/ignore/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def ignore_report(post_id: str):
    try:
        # Delete the report entry only
        response = supabase.table("reported_posts").delete().eq("reported_post_id", post_id).execute()

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to ignore the report.")

        return

    except Exception as e:
        logging.exception("🔥 FULL ERROR STACK TRACE")
        raise HTTPException(status_code=500, detail=f"Backend crashed: {str(e)}")

@router.delete("/remove/{reported_post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_post(reported_post_id: str):
    try:
        # Fetch the real post id from reported_posts
        reported_post = supabase.table("reported_posts").select("posts(id)").eq("reported_post_id", reported_post_id).execute()
        if not reported_post.data or len(reported_post.data) == 0 or not reported_post.data[0].get("posts"):
            raise HTTPException(status_code=404, detail="Reported post not found.")

        post_id = reported_post.data[0]["posts"]["id"]

        # Delete from posts table
        post_delete = supabase.table("posts").delete().eq("id", post_id).execute()
        if post_delete.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to delete post.")

        # Delete related reports
        report_delete = supabase.table("reported_posts").delete().eq("reported_post_id", reported_post_id).execute()
        if report_delete.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to delete associated reports.")

        return

    except HTTPException:
        raise  # Let FastAPI handle HTTPException as intended
    except Exception as e:
        logging.exception("🔥 FULL ERROR STACK TRACE")
        raise HTTPException(status_code=500, detail=f"Backend crashed: {str(e)}")