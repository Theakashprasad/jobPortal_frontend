"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  GraduationCap,
  MapPin,
  Briefcase,
  DollarSign,
  Pencil,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getJobById, deleteJob } from "@/services/job.service";
import type { Job } from "@/types/job.types";

export type JobDetail = {
  id: string;
  title: string;
  type: string;
  daysRemaining: string;
  status: "Active" | "Expired";
  applications: number;
  salary: string;
  location: string;
  jobPosted: string;
  jobExpires: string;
  jobLevel: string;
  experience: string;
  education: string;
  description: string;
};

function formatDate(isoDate?: string) {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDaysRemaining(expirationDate?: string) {
  if (!expirationDate) return "-";
  const expiry = new Date(expirationDate);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (Number.isNaN(diffDays)) return "-";
  if (diffDays <= 0) return "Expired";
  return `${diffDays} Days Remaining`;
}

function mapJobToDetail(job: Job): JobDetail {
  const salaryRange =
    (job.minSalary != null && job.maxSalary != null
      ? `${job.minSalary} - ${job.maxSalary} ${job.salaryType ?? ""}`.trim()
      : job.salary) ?? "Not specified";

  const isExpired =
    !!job.expirationDate &&
    new Date(job.expirationDate).getTime() < Date.now();

  const location = job.fullyRemote
    ? "Remote"
    : [job.city, job.country].filter(Boolean).join(", ") || "Not specified";



  return {
    id: job._id,
    title: job.title,
    type: job.jobType ?? "-",
    daysRemaining: getDaysRemaining(job.expirationDate),
    status: isExpired ? "Expired" : "Active",
    applications: 0,
    salary: salaryRange,
    location,
    jobPosted: formatDate(job.createdAt),
    jobExpires: formatDate(job.expirationDate),
    jobLevel: job.jobLevel ?? "-",
    experience: job.experienceLevel ?? "-",
    education: job.educationLevel ?? "-",
    description: job.description ?? "",
  };
}

export default function JobDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJobById(id);
        setJob(mapJobToDetail(data));
        setError(null);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    if (id) {
      router.push(`/jobs/${id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    try {
      setDeleting(true);
      await deleteJob(id);
      router.push("/jobs");
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-[#767F8C]">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-red-500">{error ?? "Job not found."}</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg border border-[#E7E7E7] text-sm font-semibold text-[#474C54] hover:bg-gray-50 transition-all"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="w-8 h-8 rounded-lg border border-[#E7E7E7] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} className="text-[#474C54]" />
            </button>
            <h1 className="text-lg font-bold text-[#18191C]">Job Details</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="w-8 h-8 rounded-lg border border-[#E7E7E7] flex items-center justify-center hover:bg-red-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={15} className="text-[#767F8C] group-hover:text-red-500" />
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0A65CC] text-white text-sm font-semibold hover:bg-[#0855B0] transition-all">
              <Pencil size={13} />
              Edit Job
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left: Job description */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#18191C] mb-3">{job.title}</h2>
            <p className="text-sm text-[#474C54] leading-relaxed mb-5">{job.description}</p>

          </div>

         {/* Right: Meta panel */}
<div className="w-145 flex-shrink-0 space-y-4">

{/* Salary card */}
<div className="bg-white rounded-2xl border border-[#E7E7E7] p-5">
  <div className="flex items-center justify-between gap-4">
    
    {/* Salary */}
    <div className="text-center flex-1">
      <p className="text-xs text-[#767F8C] mb-1">Salary (USD)</p>
      <p className="text-base font-bold text-[#0BA02C]">{job.salary}</p>
      <p className="text-xs text-[#767F8C] mt-0.5">Yearly salary</p>
    </div>

    {/* Vertical divider */}
    <div className="w-px h-14 bg-[#F0F0F0] flex-shrink-0" />

    {/* Location */}
    <div className="flex flex-col items-center flex-1 gap-1">
      <div className="w-8 h-8 rounded-lg bg-[#F0F5FF] flex items-center justify-center mb-1">
        <MapPin size={15} className="text-[#0A65CC]" />
      </div>
      <p className="text-xs text-[#767F8C]">Job Location</p>
      <p className="text-sm font-semibold text-[#18191C]">{job.location}</p>
    </div>

  </div>
</div>

{/* Job Overview card */}
<div className="bg-white rounded-2xl border border-[#E7E7E7] p-4">
  <h4 className="text-sm font-semibold text-[#18191C] mb-4">Job Overview</h4>
  <div className="grid grid-cols-3 gap-y-4 gap-x-2">
    <OverviewItem
      icon={<Calendar size={14} className="text-[#0A65CC]" />}
      label="Job Posted"
      value={job.jobPosted}
    />
    <OverviewItem
      icon={<Clock size={14} className="text-[#E05151]" />}
      label="Job Expires on"
      value={job.jobExpires}
    />
    <OverviewItem
      icon={<Briefcase size={14} className="text-[#767F8C]" />}
      label="Job Level"
      value={job.jobLevel}
    />
    <OverviewItem
      icon={<Calendar size={14} className="text-[#767F8C]" />}
      label="Experience"
      value={job.experience}
    />
    <OverviewItem
      icon={<GraduationCap size={14} className="text-[#767F8C]" />}
      label="Education"
      value={job.education}
    />
  </div>
</div>

</div>


        </div>
      </main>
    </div>
  );
}

function OverviewItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="w-7 h-7 rounded-md bg-[#F5F7FA] flex items-center justify-center mb-1">
        {icon}
      </div>
      <p className="text-[10px] text-[#767F8C]">{label}</p>
      <p className="text-xs font-semibold text-[#18191C]">{value}</p>
    </div>
  );
}