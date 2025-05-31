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
        response = (
            supabase.table("posts")
            .select(
                """
                id,
                content,
                created_at,
                user:user_id(username),
                post_type
                """
            )
            .order("created_at", desc=True)
            .limit(5)
            .execute()
        )

        if not response.data:
            return {"recent_posts": []}

        # Format response
        posts = []
        for item in response.data:
            posts.append({
                "id": item["id"],
                "username": item.get("user", {}).get("username", "Unknown"),
                "content": item["content"],
                "created_at": item["created_at"],
                "post_type": item.get("post_type", "unknown")
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
        restricted = count_rows("users", "created_at", start_iso, end_iso, extra_filter={"status": "suspended"})
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


def count_rows(table: str, time_col: str, start: str, end: str, extra_filter: dict = None) -> int:
    query = supabase.table(table).select("id").gte(time_col, start).lte(time_col, end)
    if extra_filter:
        for k, v in extra_filter.items():
            query = query.eq(k, v)
    result = query.execute()
    return len(result.data or [])


def calculate_change(current: int, previous: int) -> float:
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - previous) / previous) * 100, 2)