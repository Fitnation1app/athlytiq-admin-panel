from fastapi import APIRouter, HTTPException
from app.db.supabase_config import supabase
import app.models.communityModel as communityModel
import logging

logging.basicConfig(level=logging.INFO)

router = APIRouter()

@router.get("/", response_model=list[communityModel.Community])
async def get_communities():
    # Step 1: Get all communities and their creators
    response = (
        supabase.table("communities")
        .select("id, name, image_url, community_status, users!communities_creator_user_id_fkey(username, phone_no)")
        .execute()
    )

    communities_raw = response.data if isinstance(response.data, list) else [response.data]
    communities = []

    # Step 2: Count members for each community from community_members table
    member_counts_resp = supabase.table("community_members").select("community_id").execute()
    member_counts_raw = member_counts_resp.data or []

    # Build a dictionary to count members
    from collections import Counter
    member_counts = Counter([row["community_id"] for row in member_counts_raw])

    # Step 3: Construct the response
    for item in communities_raw:
        user_info = item.get("users", {})
        comm_id = item["id"]
        community = {
            "id": comm_id,
            "name": item["name"],
            "image_url": item["image_url"],
            "member_count": member_counts.get(comm_id, 0),
            "community_status": item.get("community_status", "active"),
            "creator_name": user_info.get("username", "Unknown"),
            "creator_phone": user_info.get("phone_no", ""),
        }
        communities.append(community)

    return communities


@router.get("/{id}")
async def get_community(id: str):
    try:
        response = (
            supabase.table("communities")
            .select(
                "id, name, image_url, member_count, community_status, "
                "users!communities_creator_user_id_fkey(username, phone_no, email),"
                "community_members(user_id, role, users(id, username, email, phone_no, status, profiles(profile_picture_url)))"
            )
            .eq("id", id)
            .single()
            .execute()
        )
        item = response.data
        if not item:
            raise HTTPException(status_code=404, detail="Community not found")

        user_info = item.get("users", {})
        members = []
        for member in item.get("community_members", []):
            user = member.get("users", {})
            profile = user.get("profiles") or {}
            members.append({
                "id": member.get("user_id"),
                "name": user.get("username"),
                "email": user.get("email"),
                "phone": user.get("phone_no"),
                "status": user.get("status"),
                "photo": profile.get("profile_picture_url", ""),
                "role": member.get("role"),
            })

        return {
            "id": item["id"],
            "name": item["name"],
            "image_url": item["image_url"],
            "member_count": item.get("member_count", 0),
            "community_status": item.get("community_status", "active"),
            "creator_name": user_info.get("username", "Unknown"),
            "creator_phone": user_info.get("phone_no", ""),
            "creator_email": user_info.get("email", ""),
            "members": members,
        }
    except Exception as e:
        import traceback
        logging.error(f"Exception: {str(e)}")
        logging.error(f"Traceback: {traceback.format_exc()}")

        if hasattr(e, 'message'):
            logging.error(f"Supabase error: {e.message}")

        raise HTTPException(status_code=500, detail="Internal server error")
@router.put("/{id}")
async def update_community(id: str, data: dict):
    response = (
        supabase.table("communities")
        .update({"name": data["name"]})
        .eq("id", id)
        .execute()
    )
    return {"success": True}