"use client"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThumbsUp } from "lucide-react"
import PostModal from "./postModal"

const reactionEmojis: Record<string, string> = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  wow: "😮",
  angry: "😡",
};

export function RecentTransactions() {
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [visibleCount, setVisibleCount] = useState(5)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


useEffect(() => {
  fetch("http://localhost:8000/dashboard_stats/recent-posts")
    .then(res => res.json())
    .then(data => {
      setPosts(data.recent_posts || [])
      setLoading(false)
    })
}, [])

if (loading) {
  return <div className="text-center text-muted-foreground text-sm">Loading recent posts...</div>
}



  const sortedPosts = [...posts].sort((a, b) => {
    // Sort by total reactions (sum of all reaction types)
    const reactsA = Object.values(a.reactions || {}).reduce((sum: number, v: any) => sum + Number(v), 0)
    const reactsB = Object.values(b.reactions || {}).reduce((sum: number, v: any) => sum + Number(v), 0)
    return reactsB - reactsA
  })
  const visiblePosts = sortedPosts.slice(0, visibleCount)

return (
  <div className="space-y-8">
    <div
      style={{ maxHeight: 400, overflowY: "auto" }}
      className="pr-2"
    >
      {visiblePosts.map((post) => (
        <div
          key={post.id}
          className="flex items-center min-h-[100px] cursor-pointer hover:bg-muted/40 rounded p-2"
          onClick={() => setSelectedPost(post)}
        >
          <Avatar className="h-9 w-9 border">
            {post.profile_picture_url ? (
              <img src={post.profile_picture_url} alt={post.username} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <AvatarFallback>{post.username?.[0] ?? "U"}</AvatarFallback>
            )}
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{post.username}</p>
<p className="text-sm text-muted-foreground">
  {(() => {
    const d = new Date(post.created_at);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  })()} •{" "}
  {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
</p>
            <p className="text-xs text-muted-foreground truncate max-w-xs">{post.content}</p>
            {post.media_url && (
              <img
                src={post.media_url}
                alt="Post media"
                loading="lazy"
                className="mt-2 rounded-lg object-cover border"
                style={{ height: "200px", width: "100%", objectFit: "cover" }}
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Not+Found")}
              />
            )}
            {post.reactions && Object.keys(post.reactions).length > 0 && (
              <div className="flex gap-2 mt-1">
                {Object.entries(post.reactions).map(([type, count]) => (
                  <span
                    key={type}
                    className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-muted/30"
                  >
                    {reactionEmojis[type] || type} <span className="ml-1 font-semibold">{count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
      ))}
    </div>
    {visibleCount < sortedPosts.length && (
      <div className="flex justify-center">
        <button
          className="text-blue-600 hover:underline text-sm font-medium"
          onClick={() => setVisibleCount((c) => c + 5)}
        >
          See more
        </button>
      </div>
    )}
    {selectedPost && (
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    )}
  </div>
)
}
