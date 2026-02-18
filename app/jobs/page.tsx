"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
// import JobDetailView, { JobDetail } from "@/components/Jobdetailview";

type View = "overview" | "job-detail";

export default function Home() {
  const [view, setView] = useState<View>("overview");
  // const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null);

  // const handleViewJob = (job: JobDetail) => {
  //   setSelectedJob(job);
  //   setView("job-detail");
  // };

  return (
    <>
      {/* {view === "job-detail" && selectedJob && (
        <JobDetailView job={selectedJob} onBack={() => setView("overview")} />
      )} */}
      {view === "overview" && <Dashboard />}
    </>
  );
}