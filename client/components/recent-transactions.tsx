"use client"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThumbsUp } from "lucide-react"

export function RecentTransactions() {
  const [visibleCount, setVisibleCount] = useState(5)
  const sortedPosts = [...communityPosts].sort((a, b) => b.reacts - a.reacts)
  const visiblePosts = sortedPosts.slice(0, visibleCount)

  return (
    <div className="space-y-8">
      {visiblePosts.map((post) => (
        <div key={post.id} className="flex items-center">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback>{post.author[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{post.author}</p>
            <p className="text-sm text-muted-foreground">{post.date}</p>
            <p className="text-xs text-muted-foreground truncate max-w-xs">{post.content}</p>
          </div>
          <div className="ml-auto flex items-center font-medium text-blue-600">
            <ThumbsUp className="h-4 w-4 mr-1" />
            {post.reacts}
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
    </div>
  )
}

const communityPosts = [
  {
    id: "1",
    author: "Ibrahim Reza Rabbi",
    content: "Just finished a 10km run with the club! 🏃‍♂️",
    date: "14/11/2023",
    reacts: 25,
  },
  {
    id: "2",
    author: "Arcum Bin Almas",
    content: "Yoga session at sunrise was amazing! 🌅",
    date: "13/11/2023",
    reacts: 40,
  },
  {
    id: "3",
    author: "Iftekharul Islam Iftee",
    content: "Who's joining the HIIT challenge this weekend?",
    date: "12/11/2023",
    reacts: 18,
  },
  {
    id: "4",
    author: "Ruslan Sunbeeb",
    content: "Meal prep tips for busy athletes?",
    date: "11/11/2023",
    reacts: 12,
  },
  {
    id: "5",
    author: "Mir Sayef Ali",
    content: "Congrats to everyone who completed the marathon!",
    date: "10/11/2023",
    reacts: 33,
  },
]