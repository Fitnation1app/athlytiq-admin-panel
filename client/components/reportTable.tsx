import React from "react";
import { Report } from '../app/types/report';
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
            <img
              src={report.reportedByPhoto}
              alt={report.reportedBy}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                <span className="font-bold">{report.reportedBy}</span> has reported a post made by <span className="font-bold">{report.postedBy}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Reason: {report.reason}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-600 mr-1">View post:</span>
                <span
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                  onClick={() => onPostClick(report)}
                >
                  {report.postTitle}
                </span>
              </div>
            </div>
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
)
};

export default ReportTable;
