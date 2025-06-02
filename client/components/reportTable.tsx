import React from "react";
import { Report } from '../app/types/report';
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

type ReportTableProps = {
  reports: Report[];
  onPostClick: (report: Report) => void;
};


const ReportTable: React.FC<ReportTableProps> = ({ reports, onPostClick }) => {
  const ignoreReport = async (reported_post_id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/reported_posts/ignore/${reported_post_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to ignore report");
      toast.success("Report ignored successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error ignoring report");
    }
  };

  const removePost = (reported_post_id: string) => {
    if (!confirm("Are you sure you want to remove this post permanently?")) return;
    fetch(`/api/reported_posts/remove/${reported_post_id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to remove post");
        toast.success("Post removed successfully!");
      })
      .catch(err => toast.error(err.message || "Error removing post"));
  };

  return (
    <div className="p-6">
      <Toaster position="bottom-right" />
      <h2 className="text-2xl font-semibold mb-4">Reported Posts - FitNation</h2>
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.reported_post_id} // Use reported_post_id as key!
            className="flex items-center justify-between bg-white rounded-lg shadow border px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {report.reportedByPhoto ? (
                <img
                  src={report.reportedByPhoto}
                  alt={report.reportedBy}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                  {report.reportedBy[0]?.toUpperCase() || "?"}
                </div>
              )}
              <Link href={`/users/${report.reportedById}`}>
                <span className="text-sm font-bold text-black hover:underline">{report.reportedBy}</span>
              </Link>

              <span className="text-sm text-gray-500">reported a post by</span>

              {report.reportedUserPhoto ? (
                <img
                  src={report.reportedUserPhoto}
                  alt={report.author}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                  {report.author[0]?.toUpperCase() || "?"}
                </div>
              )}
              <Link href={`/users/${report.reportedUserId}`}>
                <span className="text-sm font-bold text-black hover:underline">{report.author}</span>
              </Link>
            </div>

            <div className="flex flex-col text-sm">
              <span className="text-xs text-gray-500">
                Reason:{" "}
                {Array.isArray(report.report_tags) && report.report_tags.length > 0 ? (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {report.report_tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  typeof report.report_tags === "string" && report.report_tags ? (
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {report.report_tags}
                      </span>
                    </div>
                  ) : null
                )}
              </span>
              <span className="text-xs text-gray-600 mt-1">
                View post:{" "}
                <span
                  onClick={() => onPostClick(report)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {report.postTitle}
                </span>
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => ignoreReport(report.reported_post_id)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-green-200"
              >
                Ignore
              </button>
              <button
                onClick={() => removePost(report.reported_post_id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Remove Post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportTable;
