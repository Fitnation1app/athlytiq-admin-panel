from fastapi import APIRouter, HTTPException
from app.db.supabase_config import supabase
from app.models.reportedPostsModel import ReportedPost
import logging

router = APIRouter()

@router.get("/", status_code=201)
async def report_post(report: ReportedPost):
    
   
    post_check = supabase.table("posts").select("id").eq("id", str(report.reported_post_id)).execute()
    if not post_check.data:
        raise HTTPException(status_code=404, detail="Post not found")

    
    reporter_check = supabase.table("users").select("id").eq("id", str(report.reportedby_userid)).execute()
    if not reporter_check.data:
        raise HTTPException(status_code=404, detail="Reporting user not found")

   
    reported_user_check = supabase.table("users").select("id").eq("id", str(report.reported_userid)).execute()
    if not reported_user_check.data:
        raise HTTPException(status_code=404, detail="Reported user not found")

    
    existing_report = (
        supabase.table("reported_posts")
        .select("*")
        .eq("reported_post_id", str(report.reported_post_id))
        .eq("reportedby_userid", str(report.reportedby_userid))
        .execute()
    )
    if existing_report.data:
        raise HTTPException(status_code=400, detail="You have already reported this post")

    
    response = supabase.table("reported_posts").insert(report.dict()).execute()
    if response.error:
        logging.error(f"Supabase insert error: {response.error}")
        raise HTTPException(status_code=500, detail="Failed to report post")

    return {"message": "Post reported successfully"}
