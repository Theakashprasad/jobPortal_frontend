"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { getJobById, updateJob } from "@/services/job.service";
import type { Job, UpdateJobDto } from "@/types/job.types";

const roleOptions = ["Select", "Designer", "Developer", "Manager", "Marketing", "Sales", "Other"];
const salaryTypeOptions = ["", "Yearly", "Monthly", "Hourly"];
const educationOptions = ["Select", "Any", "High School", "Graduation", "Bachelor's", "Master's", "PhD"];
const experienceOptions = ["Select", "Any", "0 - 1 year", "1 - 2 years", "2 - 4 years", "3 - 5 years", "5+ years"];
const jobTypeOptions = ["Select", "Full Time", "Part Time", "Contract", "Internship", "Remote"];
const jobLevelOptions = ["Select", "Entry Level", "Mid Level", "Senior Level", "Lead", "Manager", "Director"];
const countryOptions = ["Select", "India", "United States", "United Kingdom", "Germany", "Australia", "Canada"];
const cityOptions: Record<string, string[]> = {
  India: ["Select", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"],
  "United States": ["Select", "New York", "San Francisco", "Austin", "Seattle", "Chicago"],
  "United Kingdom": ["Select", "London", "Manchester", "Birmingham"],
  Germany: ["Select", "Berlin", "Munich", "Hamburg"],
  Australia: ["Select", "Sydney", "Melbourne", "Brisbane"],
  Canada: ["Select", "Toronto", "Vancouver", "Montreal"],
};

function Select({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border border-[#E7E7E7] rounded-lg px-3.5 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all pr-9"
      >
        {options.map((o) => (
          <option key={o} value={o} disabled={o === "Select" || o === ""} className={o === "Select" || o === "" ? "text-[#AAAAAA]" : ""}>
            {o === "" ? placeholder || "Select" : o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767F8C] pointer-events-none"
      />
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  suffix,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: string;
  type?: string;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#E7E7E7] rounded-lg px-3.5 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all placeholder-[#AAAAAA]"
        style={suffix ? { paddingRight: "3.5rem" } : {}}
      />
      {suffix && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#767F8C]">
          {suffix}
        </span>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-[#474C54] mb-1.5">{children}</label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-[#18191C] mb-4 mt-6 first:mt-0">{children}</h2>
  );
}

function formatDateForInput(isoDate?: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  // Format as YYYY-MM-DD for date input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    tags: "",
    jobRole: "Select",
    minSalary: "",
    maxSalary: "",
    salaryType: "",
    educationLevel: "Select",
    experienceLevel: "Select",
    jobType: "Select",
    jobLevel: "Select",
    expirationDate: "",
    country: "Select",
    city: "Select",
    fullyRemote: false,
    description: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const job = await getJobById(id);
        
        // Initialize form with job data
        setForm({
          title: job.title || "",
          tags: job.tags || "",
          jobRole: job.jobRole || "Select",
          minSalary: job.minSalary?.toString() || "",
          maxSalary: job.maxSalary?.toString() || "",
          salaryType: job.salaryType || "",
          educationLevel: job.educationLevel || "Select",
          experienceLevel: job.experienceLevel || "Select",
          jobType: job.jobType || "Select",
          jobLevel: job.jobLevel || "Select",
          expirationDate: formatDateForInput(job.expirationDate),
          country: job.country || "Select",
          city: job.city || "Select",
          fullyRemote: job.fullyRemote || false,
          description: job.description || "",
        });
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

  const set = (key: keyof typeof form) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);
      setSuccess(false);
      setError(null);

      // Basic validation
      if (!form.title || form.title.trim() === "") {
        setError("Job title is required");
        return;
      }

      if (form.country === "Select" || form.city === "Select") {
        setError("Please select country and city");
        return;
      }

      const payload: UpdateJobDto = {
        title: form.title,
        companyId: 123, // TODO: make dynamic
        fullyRemote: form.fullyRemote,
        city: form.city !== "Select" ? form.city : undefined,
        country: form.country !== "Select" ? form.country : undefined,
        minSalary: form.minSalary ? form.minSalary : undefined,
        maxSalary: form.maxSalary ? form.maxSalary : undefined,
        salaryType: form.salaryType || undefined,
        description: form.description,
        tags: form.tags || undefined,
        jobRole: form.jobRole !== "Select" ? form.jobRole : undefined,
        educationLevel: form.educationLevel !== "Select" ? form.educationLevel : undefined,
        experienceLevel: form.experienceLevel !== "Select" ? form.experienceLevel : undefined,
        jobType: form.jobType !== "Select" ? form.jobType : undefined,
        jobLevel: form.jobLevel !== "Select" ? form.jobLevel : undefined,
        expirationDate: form.expirationDate || undefined,
      };

      await updateJob(id, payload);
      setSuccess(true);
      
      // Navigate back to job details after a short delay
      setTimeout(() => {
        router.push(`/jobs/${id}`);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError("Failed to update job. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-[#767F8C]">Loading job details...</p>
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={handleCancel}
          className="px-4 py-2 rounded-lg border border-[#E7E7E7] text-sm font-semibold text-[#474C54] hover:bg-gray-50 transition-all"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden ">
 

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-bold text-[#18191C]">Edit Job Details</h1>
            <div className="flex items-center gap-2">
              {error && (
                <p className="text-sm text-red-500 mr-2">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-500 mr-2">Job updated successfully!</p>
              )}
              <button
                onClick={handleCancel}
                className="px-5 py-2 rounded-lg border border-[#E7E7E7] text-sm font-semibold text-[#474C54] hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-[#0A65CC] text-white text-sm font-semibold hover:bg-[#0855B0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-0">
          {/* Basic info */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Job Title</Label>
              <Input value={form.title} onChange={set("title")} placeholder="e.g. UX Designer" />
            </div>
            <div>
              <Label>Tags (Requirements)</Label>
              <Input 
                value={form.tags} 
                onChange={set("tags")} 
                placeholder="e.g. React, Node.js, TypeScript (comma-separated)" 
              />
            </div>
            <div>
              <Label>Job Role</Label>
              <Select value={form.jobRole} options={roleOptions} onChange={set("jobRole")} />
            </div>
          </div>

          {/* Salary */}
          <SectionTitle>Salary</SectionTitle>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Min Salary</Label>
              <Input 
                value={form.minSalary} 
                onChange={(v) => set("minSalary")(v.replace(/[^0-9]/g, ""))} 
                suffix="USD" 
                placeholder="0"
              />
            </div>
            <div>
              <Label>Max Salary</Label>
              <Input 
                value={form.maxSalary} 
                onChange={(v) => set("maxSalary")(v.replace(/[^0-9]/g, ""))} 
                suffix="USD" 
                placeholder="0"
              />
            </div>
            <div>
              <Label>Salary Type</Label>
              <Select value={form.salaryType} options={salaryTypeOptions} onChange={set("salaryType")} placeholder="Select salary type" />
            </div>
          </div>

          {/* Advance Information */}
          <SectionTitle>Advance Information</SectionTitle>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Education Level</Label>
              <Select value={form.educationLevel} options={educationOptions} onChange={set("educationLevel")} />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Select value={form.experienceLevel} options={experienceOptions} onChange={set("experienceLevel")} />
            </div>
            <div>
              <Label>Job Type</Label>
              <Select value={form.jobType} options={jobTypeOptions} onChange={set("jobType")} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Job Level</Label>
              <Select value={form.jobLevel} options={jobLevelOptions} onChange={set("jobLevel")} />
            </div>
            <div>
              <Label>Expiration Date</Label>
              <Input 
                value={form.expirationDate} 
                onChange={set("expirationDate")} 
                type="date"
                placeholder="YYYY-MM-DD" 
              />
            </div>
          </div>

          {/* Location */}
          <SectionTitle>Location</SectionTitle>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <Label>Country</Label>
              <Select 
                value={form.country} 
                options={countryOptions} 
                onChange={(v) => { 
                  set("country")(v); 
                  set("city")(cityOptions[v]?.[1] || "Select"); // Set to first non-"Select" option
                }} 
              />
            </div>
            <div>
              <Label>City</Label>
              <Select
                value={form.city}
                options={cityOptions[form.country] || [form.city]}
                onChange={set("city")}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 mb-6 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.fullyRemote}
              onChange={(e) => set("fullyRemote")(e.target.checked)}
              className="w-4 h-4 rounded border-[#E7E7E7] accent-[#0A65CC]"
            />
            <span className="text-sm text-[#474C54] group-hover:text-[#18191C] transition-colors">
              Fully remote position
            </span>
          </label>

          {/* Job Description */}
          <SectionTitle>Job Description</SectionTitle>
          <textarea
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
            rows={14}
            className="w-full border border-[#E7E7E7] rounded-xl px-4 py-3 text-sm text-[#474C54] bg-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all resize-none"
            placeholder="Enter job description..."
          />
          </div>
        </div>
      </main>
    </div>
  );
}
