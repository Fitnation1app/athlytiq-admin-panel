"use client"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThumbsUp } from "lucide-react"
import PostModal from "./postModal"

export function RecentTransactions() {
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [visibleCount, setVisibleCount] = useState(5)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/dashboard_stats/recent-posts")
      .then(res => res.json())
      .then(data => setPosts(data.recent_posts || []))
  }, [])

  const sortedPosts = [...posts].sort((a, b) => {
    // Sort by total reactions (sum of all reaction types)
    const reactsA = Object.values(a.reactions || {}).reduce((sum: number, v: any) => sum + Number(v), 0)
    const reactsB = Object.values(b.reactions || {}).reduce((sum: number, v: any) => sum + Number(v), 0)
    return reactsB - reactsA
  })
  const visiblePosts = sortedPosts.slice(0, visibleCount)

  return (
    <div className="space-y-8">
      {visiblePosts.map((post) => (
        <div
          key={post.id}
          className="flex items-center cursor-pointer hover:bg-muted/40 rounded p-2"
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
  {new Date(post.created_at).toLocaleDateString()} •{" "}
  {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
</p>

            <p className="text-xs text-muted-foreground truncate max-w-xs">{post.content}</p>
            {post.media_url && (
  <img
    src={post.media_url}
    alt="Post media"
    className="mt-2 rounded-lg border max-h-64 object-cover"
  />
)}
          </div>
          <div className="ml-auto flex items-center font-medium text-blue-600">
            <ThumbsUp className="h-4 w-4 mr-1" />
            {Object.values(post.reactions || {}).reduce((sum: number, v: any) => sum + Number(v), 0)}
          </div>
        </div>
      ))}
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
