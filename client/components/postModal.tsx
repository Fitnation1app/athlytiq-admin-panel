import { useEffect, useRef } from "react";
import { Post } from "../app/types/post";

type PostModalProps = {
  post: Post;
  onClose: () => void;
};

export default function PostModal({ post, onClose }: PostModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
          <div className="h-10 w-10 bg-gray-300 rounded-full" />
          <div>
            <p className="font-semibold">{post.author}</p>
          </div>
        </div>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="post"
            className="rounded-lg mb-4 w-full max-h-60 object-cover"
          />
        )}
        <p className="text-lg font-medium mb-2">{post.postTitle}</p>
        <p className="text-gray-700">{post.content}</p>
      </div>
    </div>
  );
}
