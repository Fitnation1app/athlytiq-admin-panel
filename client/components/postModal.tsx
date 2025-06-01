import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type PostModalProps = {
  post: any // Accept any, or define a type matching your backend
  onClose: () => void
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  if (!post) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white max-w-lg w-full rounded-xl shadow-lg p-6 relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          X
        </button>
        <div className="flex items-center space-x-3 mb-4">
<Avatar className="h-10 w-10">
  {post.profile_picture_url ? (
    <img src={post.profile_picture_url} alt={post.username} className="h-10 w-10 rounded-full object-cover" />
  ) : (
    <AvatarFallback>{post.username?.[0] ?? "U"}</AvatarFallback>
  )}
</Avatar>
          <div>
            <p className="font-semibold">{post.username}</p>
          </div>
        </div>
        {post.media_url && (
          <img
            src={post.media_url}
            alt="post"
            className="rounded-lg mb-4 w-full max-h-60 object-cover"
          />
        )}
        <div className="font-mono break-words mb-2">{post.id}</div>
        <p className="text-gray-700">{post.content}</p>
      </div>
    </div>
  )
}