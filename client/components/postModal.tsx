import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Report = {
  id: number
  postTitle: string
  content: string
  imageUrl: string
  reason?: string

  reportedBy: string
  reportedById: string
  reportedByPhoto: string

  author: string
  reportedUserId: string
  reportedUserPhoto: string
  report_tags?: string[]
}

type PostModalProps = {
  post: Report
  onClose: () => void
};

export default function PostModal({ post, onClose }: PostModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!post) return null;

return (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div
      ref={modalRef}
      className="bg-white max-w-lg w-full rounded-xl shadow-lg p-6 relative"
    >
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 font-bold text-xl"
        onClick={onClose}
        aria-label="Close modal"
      >
        ×
      </button>

      {/* Author avatar and name */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-10 w-10">
          {/* Use profile_picture_url and username if present, fallback to report fields */}
          {post.profile_picture_url ? (
            <img
              src={post.profile_picture_url}
              alt={post.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : post.reportedUserPhoto ? (
            <img
              src={post.reportedUserPhoto}
              alt={post.author}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <AvatarFallback>
              {post.username?.[0] ?? post.author?.[0] ?? "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-semibold text-lg">{post.username ?? post.author}</p>
          {post.created_at && (
            <div className="text-xs text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Report Tags */}
      {Array.isArray(post.report_tags) && post.report_tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {post.report_tags.map((tag: string) => (
            <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Post image */}
      {(post.media_url || post.imageUrl) && (
        <img
          src={post.media_url || post.imageUrl}
          alt="Post media"
          className="rounded-lg mb-4 w-full max-h-60 object-cover"
        />
      )}

      {/* Post title */}
      {(post.postTitle || post.title) && (
        <div className="font-mono break-words mb-2 text-sm text-gray-600">
          {post.postTitle || post.title}
        </div>
      )}

      {/* Post content */}
      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
    </div>
  </div>
)
}