"use client";
import { useEffect, useState } from "react";
import { Briefcase, UserRound } from "lucide-react";
import { getJobs } from "@/services/job.service";
import JobsTable from "./JobsTable";

type JobsTableJob = {
  id: string;
  title: string;
  type: string;
  daysRemaining: string;
  status: "Active" | "Expired";
  applications: number;
};

function StatCard({
  value,
  label,
  icon: Icon,
  color,
  bg,
}: {
  value: number;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-5 py-4 flex-1"
      style={{ background: bg }}
    >
      <div>
        <p className="text-2xl font-bold text-[#18191C]">{value}</p>
        <p className="text-sm text-[#474C54] mt-0.5">{label}</p>
      </div>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: color + "22" }}
      >
        <Icon size={22} style={{ color }} />
      </div>
    </div>
  );
}

function formatDaysRemaining(expirationDate?: string) {
  if (!expirationDate) return "N/A";
  const diffMs = new Date(expirationDate).getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Expires today";
  return `${diffDays} days remaining`;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobsTableJob[]>([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const userIdStr = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      let userId: string | null = null;
      if (userIdStr) {
        try {
          userId = JSON.parse(userIdStr);
        } catch {
          userId = userIdStr;
        }
      }
      if (!userId) {
        setJobs([]);
        return;
      }
      const apiJobs = await getJobs(userId);

      const mapped: JobsTableJob[] = apiJobs.map((job: any) => {
        const status: "Active" | "Expired" =
          job.expirationDate && new Date(job.expirationDate) < new Date()
            ? "Expired"
            : "Active";

        return {
          id: job._id,
          title: job.title,
          type: job.jobType,
          daysRemaining: formatDaysRemaining(job.expirationDate),
          status,
          applications: 0,
        };
      });

      setJobs(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleJobDelete = async () => {
    await loadJobs();
  };
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#18191C]">Hello, Designic</h1>
          <p className="text-sm text-[#767F8C] mt-0.5">
            Here is your daily activity and applications
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-2 w-1/2">          <StatCard
          value={loading ? 0 : jobs.length}
          label="Open Jobs"
          icon={Briefcase}
          color="#0A65CC"
          bg="#EEF5FF"
        />
          <StatCard
            value={0}
            label="Saved Candidates"
            icon={UserRound}
            color="#E05151"
            bg="#FFF5F3"
          />
        </div>

        {/* Jobs Table */}
        <JobsTable jobs={jobs} loading={loading} onDelete={handleJobDelete} />
      </main>
    </div>
  );
}