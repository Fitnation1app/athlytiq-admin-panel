"use client";
import { useEffect, useState } from "react";
import ReportTable from "../../../components/reportTable";
import PostModal from "../../../components/postModal";
import { Report } from "../../types/report";
import useAuthGuard from "@/hooks/useAuthGuard";

export default function ReportsPage() {
  const isChecking = useAuthGuard();
 
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedPost, setSelectedPost] = useState<Report | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/reported_posts/")
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
// In your ReportsPage or wherever you fetch reports
const formatted: Report[] = data.data.map((item: any, index: number) => ({
  id: index + 1,
  reported_post_id: item.reported_post_id, // <-- THIS IS CRUCIAL
  postTitle: item.posts?.id || "Untitled Post",
  content: item.posts?.content || "Content preview not available",
  imageUrl: item.posts?.media_url || "/placeholder.png",
  report_tags: item.report_tags || [],
  reportedBy: item.reporter?.username || "Unknown",
  reportedById: item.reporter?.id || "",
  reportedByPhoto: item.reporter?.profiles?.profile_picture_url || "",
  author: item.reported_user?.username || "Unknown",
  reportedUserId: item.reported_user?.id || "",
  reportedUserPhoto: item.reported_user?.profiles?.profile_picture_url || ""
}));
setReports(formatted); // <-- Make sure this line is present!
        }
      })
      .catch(err => {
        console.error("Failed to fetch reports:", err);
      });
  }, []);

   if (isChecking) return null; // Wait until auth check is done

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <ReportTable
          reports={reports}
          onPostClick={(report: Report) => setSelectedPost(report)}
        />
      </div>
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </main>
  );
}
