"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, CheckCircle, XCircle, Users, Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteJob } from "@/services/job.service";

type JobsTableJob = {
  id: string;
  title: string;
  type: string;
  daysRemaining: string;
  status: "Active" | "Expired";
  applications: number;
};
function ActionMenu({
  jobId,
  onEdit,
  onDelete,
  onClose,
}: {
  jobId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void | Promise<void>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleEdit = () => {
    onEdit(jobId);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    try {
      setDeleting(true);
      await deleteJob(jobId);
      await onDelete(jobId);
      onClose();
    } catch (err) {
      console.error("Error deleting job:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-50 w-36 bg-white rounded-xl shadow-lg border border-[#E7E7E7] py-1.5 animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        type="button"
        onClick={handleEdit}
        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#474C54] hover:bg-gray-50 transition-colors"
      >
        <Pencil size={14} className="text-[#767F8C]" />
        Edit Job
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={14} />
        {deleting ? "Deleting..." : "Delete Job"}
      </button>
    </div>
  );
}

export default function JobsTable({
  jobs,
  loading,
  onDelete,
}: {
  jobs: JobsTableJob[];
  loading: boolean;
  onDelete?: (id: string) => void | Promise<void>;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/jobs/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    await onDelete?.(id);
  };

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[#18191C]">Recently Posted Jobs</h2>
        <button className="text-sm font-medium text-[#0A65CC] hover:underline transition-all">
          View all
        </button>
      </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E7E7E7] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_120px] px-5 py-3 border-b border-[#E7E7E7]">
          {["Jobs", "Status", "Applications", "Actions"].map((h) => (
            <span key={h} className="text-xs font-semibold text-[#767F8C] uppercase tracking-wide">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {loading && jobs.length === 0 && (
          <div className="px-5 py-4 text-sm text-[#767F8C]">Loading jobs...</div>
        )}
        {!loading && jobs.length === 0 && (
          <div className="px-5 py-4 text-sm text-[#767F8C]">No jobs found.</div>
        )}
        {jobs.map((job, idx) => (
          <div
            key={job.id}
            className={`grid grid-cols-[2fr_1fr_1fr_120px] items-center px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors ${
              idx !== jobs.length - 1 ? "border-b border-[#F0F0F0]" : ""
            }`}
          >
            {/* Job info */}
            <div>
              <p className="text-sm font-semibold text-[#18191C]">{job.title}</p>
              <p className="text-xs text-[#767F8C] mt-0.5">
                {job.type} &nbsp;·&nbsp; {job.daysRemaining}
              </p>
            </div>

            {/* Status */}
            <div>
              {job.status === "Active" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0BA02C]">
                  <CheckCircle size={13} className="fill-[#E2F5E9] stroke-[#0BA02C]" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E05151]">
                  <XCircle size={13} className="fill-[#FEECEC] stroke-[#E05151]" />
                  Expired
                </span>
              )}
            </div>

            {/* Applications */}
            <div className="flex items-center gap-1.5 text-sm text-[#474C54]">
              <Users size={14} className="text-[#767F8C]" />
              {job.applications} Applications
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => router.push(`/jobs/${job.id}`)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E8F1FB] text-[#0A65CC] text-xs font-semibold hover:bg-[#0A65CC] hover:text-white transition-all duration-150"
              >
                <Eye size={12} />
                View Job
              </button>
              <button
                onClick={() => setOpenMenu(openMenu === job.id ? null : job.id)}
                className="w-7 h-7 rounded-lg border border-[#E7E7E7] flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={14} className="text-[#767F8C]" />
              </button>
              {openMenu === job.id && (
                <ActionMenu
                  jobId={job.id}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClose={() => setOpenMenu(null)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}