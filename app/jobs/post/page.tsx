"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { createJob } from "@/services/job.service";
import { useRouter } from "next/navigation";

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
        className="w-full appearance-none border border-[#E7E7E7] rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all pr-9 text-[#18191C]"
      >
        {options.map((o) => (
          <option key={o} value={o} disabled={o === "Select" || o === ""} className={o === "Select" || o === "" ? "text-[#AAAAAA]" : ""}>
            {o === "" ? placeholder || "Select" : o}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767F8C] pointer-events-none" />
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
        className="w-full border border-[#E7E7E7] rounded-lg px-3.5 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all placeholder-[#BBBBBB]"
        style={suffix ? { paddingRight: "3.5rem" } : {}}
      />
      {suffix && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#767F8C] select-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-[#474C54] mb-1.5">{children}</label>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-bold text-[#18191C] mb-4 pt-2">{children}</h2>;
}

const empty = {
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
};

interface PostJobViewProps {
  onPosted?: () => void;
}

export default function PostJobView({ onPosted }: PostJobViewProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userIdStr = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (userIdStr) {
      try {
        setUserId(JSON.parse(userIdStr));
      } catch {
        setUserId(userIdStr);
      }
    }
  }, []);

  const set = (key: keyof typeof form) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));


  const handleSubmit = async () => {
    setSuccess(false);
    setError(null);

    // Validation
    if (!userId) {
      const msg = "Session expired. Please log in again.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!form.title?.trim()) {
      const msg = "Job title is required";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (form.jobRole === "Select" || !form.jobRole) {
      const msg = "Job role is required";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (form.country === "Select" || form.city === "Select") {
      const msg = "Please select country and city";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!form.description?.trim()) {
      const msg = "Job description is required";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        companyId: userId,
        location: form.fullyRemote,
        city: form.city,
        country: form.country,
        minSalary: form.minSalary,
        maxSalary: form.maxSalary,
        salaryType: form.salaryType,
        description: form.description.trim(),
        tags: form.tags,
        jobRole: form.jobRole,
        educationLevel: form.educationLevel,
        experienceLevel: form.experienceLevel,
        jobType: form.jobType,
        jobLevel: form.jobLevel,
        expirationDate: form.expirationDate,
      };
      await createJob(payload);

      setSuccess(true);
      setForm(empty);
      toast.success("Job posted successfully! Redirecting...");
      router.push("/jobs");
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create job. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
   

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-lg font-bold text-[#18191C] mb-5">Post a job</h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Basic info */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Job Tiles</Label>
              <Input value={form.title} onChange={set("title")} placeholder="" />
            </div>
            <div>
              <Label>Tags</Label>
              <Input value={form.tags} onChange={set("tags")} placeholder="" />
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
              <Input value={form.minSalary} onChange={set("minSalary")} suffix="USD" placeholder="" />
            </div>
            <div>
              <Label>Max Salary</Label>
              <Input value={form.maxSalary} onChange={set("maxSalary")} suffix="USD" placeholder="" />
            </div>
            <div>
              <Label>Salary Type</Label>
              <Select value={form.salaryType} options={salaryTypeOptions} onChange={set("salaryType")} placeholder="Select" />
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
                placeholder="dd/mm/yyyy"
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
                  set("city")("Select");
                }}
              />
            </div>
            <div>
              <Label>City</Label>
              <Select
                value={form.city}
                options={cityOptions[form.country] || ["Select"]}
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
          <SectionTitle>Job Descriptions</SectionTitle>
          <textarea
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
            placeholder="Add job description"
            rows={8}
            className="w-full border border-[#E7E7E7] rounded-xl px-4 py-3 text-sm text-[#474C54] bg-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all resize-none placeholder-[#BBBBBB] mb-6"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#0A65CC] text-white hover:bg-[#0855B0] disabled:hover:bg-[#0A65CC]"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Posting...
              </>
            ) : success ? (
              "✓ Job Posted!"
            ) : (
              "Post Job"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}