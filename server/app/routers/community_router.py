from fastapi import APIRouter
from app.db.supabase_config import supabase
import app.models.communityModel as communityModel
import logging

logging.basicConfig(level=logging.INFO)

router = APIRouter()

@router.get("/", response_model=list[communityModel.Community])
async def get_communities():
    response = (
        supabase.table("communities")
        .select("id, name, image_url, member_count, community_status, users!communities_creator_user_id_fkey(username, phone_no)")
        .execute()
    )
    communities_raw = response.data if isinstance(response.data, list) else [response.data]

    communities = []
    for item in communities_raw:
        user_info = item.get("users", {})
        community = {
            "id": item["id"],
            "name": item["name"],
            "image_url": item["image_url"],
            "member_count": item.get("member_count", 0),
            "community_status": item.get("community_status", "active"),
            "creator_name": user_info.get("username", "Unknown"),
            "creator_phone": user_info.get("phone_no", ""),
        }
        communities.append(community)

    return communities

@router.get("/{id}")
async def get_community(id: str):
    response = (
        supabase.table("communities")
        .select(
            "id, name, image_url, member_count, community_status, users!communities_creator_user_id_fkey(username, phone_no, email)"
        )
        .eq("id", id)
        .single()
        .execute()
    )
    item = response.data
    if not item:
        return {"detail": "Community not found"}
    user_info = item.get("users", {})
    community = {
        "id": item["id"],
        "name": item["name"],
        "image_url": item["image_url"],
        "member_count": item.get("member_count", 0),
        "community_status": item.get("community_status", "active"),
        "creator_name": user_info.get("username", "Unknown"),
        "creator_phone": user_info.get("phone_no", ""),
        "creator_email": user_info.get("email", ""),
    }
    return community

@router.put("/{id}")
async def update_community(id: str, data: dict):
    response = (
        supabase.table("communities")
        .update({"name": data["name"]})
        .eq("id", id)
        .execute()
    )
    return {"success": True}