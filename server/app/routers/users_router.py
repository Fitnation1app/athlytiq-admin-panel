from fastapi import APIRouter, Request
from app.db.supabase_config import supabase
from app.models.userModel import User
from datetime import datetime

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
        profiles = user.get("profiles")
        if profiles and isinstance(profiles, dict):
            user["profile_picture_url"] = profiles.get("profile_picture_url", "")
        else:
            user["profile_picture_url"] = ""
        user.pop("profiles", None)
    return users

@router.get("/count")
async def get_users_count():
    response = supabase.table("users").select("id", count="exact").execute()
    return {"count": response.count or 0}

@router.get("/{id}")
async def get_user(id: str):
    response = (
        supabase.table("users")
        .select("id,username,email,status,phone_no,role,profiles(display_name,profile_picture_url)")
        .eq("id", id)
        .single()
        .execute()
    )
    user = response.data
    if not user:
        return {"detail": "User not found"}

    profiles = user.get("profiles")
    if profiles and isinstance(profiles, dict):
        user["profile_picture_url"] = profiles.get("profile_picture_url", "")
        user["display_name"] = profiles.get("display_name", None)
    else:
        user["profile_picture_url"] = ""
        user["display_name"] = None

    user.pop("profiles", None)
    return user


@router.get("/{id}/followers")
async def get_user_followers(id: str):
    try:
        # Step 1: Get all entries where someone has this user as a buddy
        response = (
            supabase.table("gym_buddies")
            .select("user_id")  # these are the followers
            .eq("buddy_id", id)
            .execute()
        )

        if not response.data:
            return {
                "user_id": id,
                "followers_count": 0,
                "followers": []
            }

        follower_ids = [row["user_id"] for row in response.data]

        # Step 2: Get follower details from users table
        followers_response = (
            supabase.table("users")
            .select("id, username, email, status, phone_no, role, profiles(profile_picture_url)")
            .in_("id", follower_ids)
            .execute()
        )

        followers = followers_response.data if isinstance(followers_response.data, list) else [followers_response.data]

        # Step 3: Flatten profile_picture_url
        for user in followers:
            profile = user.get("profiles")
            user["profile_picture_url"] = profile.get("profile_picture_url", "") if isinstance(profile, dict) else ""
            user.pop("profiles", None)

        return {
            "user_id": id,
            "followers_count": len(followers),
            "followers": followers
        }

    except Exception as e:
        return {"error": str(e)}

@router.get("/{id}/connections")
async def get_user_connections(id: str):
    try:
        # Followers: users who have this user as their buddy
        followers_resp = (
            supabase.table("gym_buddies")
            .select("user_id")
            .eq("buddy_id", id)
            .execute()
        )
        followers = followers_resp.data or []

        # Following: buddies this user has
        following_resp = (
            supabase.table("gym_buddies")
            .select("buddy_id")
            .eq("user_id", id)
            .execute()
        )
        following = following_resp.data or []

        return {
            "user_id": id,
            "followers_count": len(followers),
            "following_count": len(following),
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

    except Exception as e:
        return {"error": str(e)}


@router.get("/{id}/following")
async def get_user_following(id: str):
    try:
        response = (
            supabase.table("gym_buddies")
            .select("buddy_id")
            .eq("user_id", id)
            .execute()
        )

        if not response.data:
            return {
                "user_id": id,
                "following_count": 0,
                "following": []
            }

        buddy_ids = [row["buddy_id"] for row in response.data]

        following_response = (
            supabase.table("users")
            .select("id, username, email, status, phone_no, role, profiles(profile_picture_url)")
            .in_("id", buddy_ids)
            .execute()
        )

        following = following_response.data if isinstance(following_response.data, list) else [following_response.data]

        for user in following:
            profile = user.get("profiles")
            user["profile_picture_url"] = profile.get("profile_picture_url", "") if isinstance(profile, dict) else ""
            user.pop("profiles", None)

        return {
            "user_id": id,
            "following_count": len(following),
            "following": following
        }

    except Exception as e:
        return {"error": str(e)}



@router.get("/{id}/history")
async def get_user_history(id: str):
    try:
        activity_log = []

        # 1. Posts
        posts = supabase.table("posts").select("id, created_at").eq("user_id", id).execute().data or []
        for post in posts:
            ts_obj = format_timestamp(post["created_at"])
            activity_log.append({
                "type": "post",
                "message": "Made a post",
                "timestamp": ts_obj["formatted"],
                "timestamp_sort": ts_obj["timestamp_sort"]
            })

        # 2. Post Comments
        post_comments = supabase.table("post_comments").select("post_id, created_at, content").eq("user_id", id).execute().data or []
        for comment in post_comments:
            post_data = supabase.table("posts").select("user_id").eq("id", comment["post_id"]).single().execute().data
            author_id = post_data["user_id"] if post_data else None
            author_name = get_username(author_id) if author_id else "Unknown User"
            ts_obj = format_timestamp(comment["created_at"])
            activity_log.append({
                "type": "comment",
                "message": f"Commented on a post made by {author_name}",
                "content": comment.get("content", ""),
                "timestamp": ts_obj["formatted"],
                "timestamp_sort": ts_obj["timestamp_sort"]
            })

        # 3. Comments table
        comments = supabase.table("comments").select("post_id, created_at, content").eq("user_id", id).execute().data or []
        for comment in comments:
            post_data = supabase.table("posts").select("user_id").eq("id", comment["post_id"]).single().execute().data
            author_id = post_data["user_id"] if post_data else None
            author_name = get_username(author_id) if author_id else "Unknown User"
            ts_obj = format_timestamp(comment["created_at"])
            activity_log.append({
                "type": "comment",
                "message": f"Commented on a post made by {author_name}",
                "content": comment.get("content", ""),
                "timestamp": ts_obj["formatted"],
                "timestamp_sort": ts_obj["timestamp_sort"]
            })

        # 4. Stories
        stories = supabase.table("stories").select("created_at").eq("user_id", id).execute().data or []
        for story in stories:
            ts_obj = format_timestamp(story["created_at"])
            activity_log.append({
                "type": "story",
                "message": "Posted a story",
                "timestamp": ts_obj["formatted"],
                "timestamp_sort": ts_obj["timestamp_sort"]
            })

        # Sort all activities by datetime
        sorted_log = sorted(activity_log, key=lambda x: x["timestamp_sort"], reverse=True)

        # Remove internal sort field before returning
        for item in sorted_log:
            item.pop("timestamp_sort", None)

        return {
            "user_id": id,
            "activity_count": len(sorted_log),
            "history": sorted_log
        }

    except Exception as e:
        return {"error": str(e)}

@router.put("/{id}")
async def update_user(id: str, request: Request):
    data = await request.json()
    status = data.get("status")
    if status not in ["active", "suspended"]:
        return {"error": "Invalid status"}
    response = (
        supabase.table("users")
        .update({"status": status})
        .eq("id", id)
        .execute()
    )
    return {"success": True}



def format_timestamp(ts: str) -> dict:
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return {
            "formatted": dt.strftime("%I:%M %p on %B %d, %Y"),  # Example: 08:32 PM on May 30, 2025
            "timestamp_sort": dt.isoformat()
        }
    except Exception:
        return {
            "formatted": ts,
            "timestamp_sort": ts
        }

def get_username(user_id: str) -> str:
    try:
        user = supabase.table("users").select("username").eq("id", user_id).single().execute().data
        return user["username"] if user else "Unknown User"
    except:
        return "Unknown User"
