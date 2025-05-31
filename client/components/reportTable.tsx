import React from "react";
import { Report } from '../app/types/report';
import Link from "next/link";

type ReportTableProps = {
  reports: Report[];
  onPostClick: (report: Report) => void;
};

const ReportTable: React.FC<ReportTableProps> = ({ reports, onPostClick }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Reported Posts - FitNation</h2>
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between bg-white rounded-lg shadow border px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {/* Reporter */}
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

              {/* Reported User */}
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
              <span className="text-xs text-gray-500">Reason: {report.reason}</span>
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
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-green-200">
                Ignore
              </button>
              <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
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
