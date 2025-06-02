from fastapi import APIRouter, Query
from app.db.supabase_config import supabase
from datetime import datetime, timedelta
import calendar

router = APIRouter()

@router.get("/post-overview")
async def get_post_overview():
    try:
        monthly_counts = []
        year = datetime.now().year

        for month in range(1, 13):
            start_date = datetime(year, month, 1).isoformat()
            if month == 12:
                end_date = datetime(year + 1, 1, 1).isoformat()
            else:
                end_date = datetime(year, month + 1, 1).isoformat()

            response = (
                supabase.table("posts")
                .select("id", count="exact")
                .gte("created_at", start_date)
                .lt("created_at", end_date)
                .execute()
            )

            count = len(response.data) if response.data else 0
            monthly_counts.append({
                "month": calendar.month_name[month],
                "post_count": count
            })

        return {"year": year, "post_overview": monthly_counts}

    except Exception as e:
        return {"error": str(e)}

@router.get("/recent-posts")
async def get_recent_posts():
    try:
        # Step 1: Fetch all posts with user info and profile picture
        posts_response = (
            supabase.table("posts")
            .select("""
                id,
                content,
                created_at,
                post_type,
                media_url,
                user:user_id(
                    username,
                    profiles(profile_picture_url)
                )
            """)
            .order("created_at", desc=True)
            .execute()
        )

        if not posts_response.data:
            return {"recent_posts": []}

        posts = []
        post_ids = [post["id"] for post in posts_response.data]

        # Step 2: Fetch all reactions for those posts
        reacts_response = (
            supabase.table("post_reacts")
            .select("post_id, react_type")
            .in_("post_id", post_ids)
            .execute()
        )

        # Step 3: Group reactions by post and type
        react_map = {}
        for react in reacts_response.data:
            pid = react["post_id"]
            rtype = react["react_type"]
            if pid not in react_map:
                react_map[pid] = {}
            react_map[pid][rtype] = react_map[pid].get(rtype, 0) + 1

        # Step 4: Combine everything
        for post in posts_response.data:
            if not post.get("content"):
                continue
            user = post.get("user", {})
            profile = user.get("profiles") or {}
            posts.append({
                "id": post["id"],
                "username": user.get("username", "Unknown"),
                "profile_picture_url": profile.get("profile_picture_url", ""),
                "content": post["content"],
                "created_at": post["created_at"],
                "post_type": post.get("post_type", "unknown"),
                "media_url": post.get("media_url", ""),
                "reactions": react_map.get(post["id"], {})
            })

        return {"recent_posts": posts}

    except Exception as e:
        return {"error": str(e)}

@router.get("/dashboard-metrics")
async def get_dashboard_metrics(view: str = Query("daily", enum=["daily", "weekly", "monthly"])):
    try:
        now = datetime.now()

        if view == "daily":
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end = now.replace(hour=23, minute=59, second=59, microsecond=999999)
            prev_start = start - timedelta(days=1)
            prev_end = end - timedelta(days=1)
            label = "from yesterday"
        elif view == "weekly":
            start = now - timedelta(days=now.weekday())  # Start of this week (Monday)
            end = start + timedelta(days=6, hours=23, minutes=59, seconds=59)
            prev_start = start - timedelta(days=7)
            prev_end = end - timedelta(days=7)
            label = "from last week"
        elif view == "monthly":
            start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            next_month = start.replace(day=28) + timedelta(days=4)  # Guarantees jump to next month
            end = next_month.replace(day=1) - timedelta(seconds=1)
            prev_start = (start - timedelta(days=1)).replace(day=1)
            prev_end = start - timedelta(seconds=1)
            label = "from last month"

        # Convert datetime to ISO format
        start_iso, end_iso = start.isoformat(), end.isoformat()
        prev_start_iso, prev_end_iso = prev_start.isoformat(), prev_end.isoformat()

        # --- New Users ---
        new_users = count_rows("users", "created_at", start_iso, end_iso)
        new_users_prev = count_rows("users", "created_at", prev_start_iso, prev_end_iso)
        new_users_change = calculate_change(new_users, new_users_prev)

        # --- Total Users (unchanging view-based logic) ---
        total_users = supabase.table("users").select("id").execute()
        total_users_count = len(total_users.data or [])
        prev_total_users = supabase.table("users").select("id").lte("created_at", prev_end_iso).execute()
        total_users_prev_count = len(prev_total_users.data or [])
        total_users_change = calculate_change(total_users_count, total_users_prev_count)

        # --- Posts ---
        posts = sum([count_rows(tbl, "created_at", start_iso, end_iso) for tbl in ["posts", "challenge_posts", "workout_posts"]])
        posts_prev = sum([count_rows(tbl, "created_at", prev_start_iso, prev_end_iso) for tbl in ["posts", "challenge_posts", "workout_posts"]])
        posts_change = calculate_change(posts, posts_prev)

        # --- Restricted Users ---
        restricted = count_rows("users", extra_filter={"status": "suspended"})
        restricted_prev = count_rows("users", "created_at", prev_start_iso, prev_end_iso, extra_filter={"status": "suspended"})
        restricted_change = calculate_change(restricted, restricted_prev)

        return {
            "view": view,
            "new_users": {
                "count": new_users,
                "change": new_users_change,
                "label": label
            },
            "total_users": {
                "count": total_users_count,
                "change": total_users_change,
                "label": label
            },
            "posts": {
                "count": posts,
                "change": posts_change,
                "label": label
            },
            "restricted_users": {
                "count": restricted,
                "change": restricted_change,
                "label": label
            }
        }

    except Exception as e:
        return {"error": str(e)}


def count_rows(table: str, time_col: str = None, start: str = None, end: str = None, extra_filter: dict = None) -> int:
    query = supabase.table(table).select("id")
    if time_col and start and end:
        query = query.gte(time_col, start).lte(time_col, end)
    if extra_filter:
        for k, v in extra_filter.items():
            query = query.eq(k, v)
    result = query.execute()
    return len(result.data or [])


def calculate_change(current: int, previous: int) -> float | str:
    if previous == 0:
        if current == 0:
            return 0.0
        return "New"

    change = ((current - previous) / previous) * 100
    capped_change = min(change, 500)  # cap to +500% for display sanity
    return round(capped_change, 2)



@router.get("/notifications")
async def get_notifications():
    try:
        notifications = []

        # --- 1. New User Signups ---
        users = (
            supabase.table("users")
            .select("id, username, created_at")
            .order("created_at", desc=True)
            .limit(10)
            .execute()
        )
        for user in users.data:
            notifications.append({
                "type": "signup",
                "user": user["username"],
                "time": user["created_at"],
                "message": f"{user['username']} has signed up!"
            })

        # --- 2. New Posts ---
        posts = (
            supabase.table("posts")
            .select("id, created_at, user_id, users!posts_user_id_fkey(username)")
            .order("created_at", desc=True)
            .limit(10)
            .execute()
        )
        for post in posts.data:
            username = post.get("users", {}).get("username", "Unknown")
            notifications.append({
                "type": "post_upload",
                "user": username,
                "time": post["created_at"],
                "message": f"{username} uploaded a post."
            })

        # --- 3. Reported Posts (no created_at column yet) ---
        reports = (
            supabase.table("reported_posts")
            .select("reportedby_userid, users!reported_posts_reportedby_userid_fkey(username)")
            .limit(10)
            .execute()
        )
        for report in reports.data:
            username = report.get("users", {}).get("username", "Unknown")
            notifications.append({
                "type": "report",
                "user": username,
                "time": "Unknown time",  # fallback since no timestamp
                "message": f"{username} reported a post."
            })

        # --- 4. Comments ---
        comments = (
            supabase.table("post_comments")
            .select("id, created_at, user_id, users!post_comments_user_id_fkey(username)")
            .order("created_at", desc=True)
            .limit(10)
            .execute()
        )
        for comment in comments.data:
            username = comment.get("users", {}).get("username", "Unknown")
            notifications.append({
                "type": "comment",
                "user": username,
                "time": comment["created_at"],
                "message": f"{username} commented on a post."
            })

        # Sort only those with timestamps
        def sort_key(x):
            try:
                return x["time"]
            except:
                return ""

        notifications.sort(key=sort_key, reverse=True)

        return {"notifications": notifications}

    except Exception as e:
        return {"error": str(e)}
