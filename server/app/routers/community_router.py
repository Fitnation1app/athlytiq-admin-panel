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
        .select("id, name, image_url, member_count, users(username)")
        .execute()
    )
    communities_raw = response.data if isinstance(response.data, list) else [response.data]

    communities = []
    for item in communities_raw:
        community = {
            "id": item["id"],
            "name": item["name"],
            "image_url": item["image_url"],
            "member_count": item.get("member_count", 0),
            "creator_name": item.get("users", {}).get("username", "Unknown")
        }
        communities.append(community)

    return communities
