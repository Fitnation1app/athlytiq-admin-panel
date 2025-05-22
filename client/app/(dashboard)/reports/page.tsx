"use client"
import Head from "next/head";
import ReportTable from "../../../components/reportTable";
import { useState } from "react";
import PostModal from "../../../components/postModal";
import { Report } from '../../types/report';
import {Post} from '../../types/post'

const dummyReports: Report[] = [
  {
    id: 1,
    postTitle: "Best HIIT Routine 🔥",
    author:"Arqam",
    reportedBy: "user123",
    reason: "Inappropriate language",
    content: "Here's my favorite HIIT workout: 30s burpees, 30s rest, repeat for 10 rounds!",
    imageUrl: "https://i.ytimg.com/vi/5O1TTduK6mw/sddefault.jpg"
  },
  {
    id: 2,
    postTitle: "Supplements You Must Avoid",
    author:"Iftee",
    reportedBy: "fitfan98",
    reason: "Misinformation",
    content: "These supplements are proven to be harmful. Avoid XYZ and ABC.",
    imageUrl: "https://m.media-amazon.com/images/I/51x+EEmiHyL._AC_UF894,1000_QL80_.jpg"
  },
  {
    id: 3,
    postTitle: "Fat loss in 5 days!",
    author:"Ruslan",
    reportedBy: "lean_machine",
    reason: "Clickbait / False claim",
    content: "Lose fat fast with this one weird trick. No exercise needed!",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8rzaKIm7q1qL63iSmLBK9OD6Ojjpi1Y4y7g&s"
  },
];

export default function ReportsPage() {
  const [selectedPost, setSelectedPost] = useState<Report | null>(null);

  return (
    <>
      <main className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <ReportTable reports={dummyReports} onPostClick={(report: Report) => setSelectedPost(report)} />
        </div>
        {selectedPost && (
          <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </main>
    </>
  );
}
