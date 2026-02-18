"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, ChevronDown } from "lucide-react";
import { completeAccountSetup } from "@/services/auth.service";

export default function AccountSetupPage() {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Get userId from localStorage
    const userIdStr = localStorage.getItem("userId");
    if (!userIdStr) {
      setError("User session expired. Please sign up again.");
      setTimeout(() => {
        router.push("/singup");
      }, 2000);
      return;
    }

    let userId: string;
    try {
      // Parse userId (it's stored as JSON string)
      userId = JSON.parse(userIdStr);
    } catch {
      // If parsing fails, try using it directly
      userId = userIdStr;
    }

    // Basic validation
    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }

    if (!orgType) {
      setError("Organization type is required");
      return;
    }

    if (!industryType) {
      setError("Industry type is required");
      return;
    }

    if (!teamSize) {
      setError("Team size is required");
      return;
    }

    if (!yearEstablished.trim()) {
      setError("Year of establishment is required");
      return;
    }

    if (!location.trim()) {
      setError("Location is required");
      return;
    }

    if (!contactNumber.trim()) {
      setError("Contact number is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      await completeAccountSetup({
        userId,
        companyName: companyName.trim(),
        orgType,
        industryType,
        teamSize,
        yearEstablished: yearEstablished.trim(),
        aboutUs: aboutUs.trim(),
        location: location.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim(),
        // logo: logoPreview,
      });

      // After successful setup, go to jobs dashboard
      router.push("/jobs");
    } catch (err: any) {
      console.error("Account setup error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to finish account setup. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectClass =
    "w-full border border-[#E7E7E7] rounded-lg px-3 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all appearance-none";
  const inputClass =
    "w-full border border-[#E7E7E7] rounded-lg px-3 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all";
  const labelClass = "block text-xs font-medium text-[#474C54] mb-1.5";

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Top Nav */}
      <header className="bg-white border-b border-[#E7E7E7] px-8 py-4">
        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#0A65CC" />
            <path d="M10 16.5C10 13.46 12.46 11 15.5 11H22v2h-6.5C13.57 13 12 14.57 12 16.5S13.57 20 15.5 20H22v2h-6.5C12.46 22 10 19.54 10 16.5Z" fill="white" />
            <circle cx="21" cy="16.5" r="2" fill="white" />
          </svg>
          <span className="font-bold text-base text-[#18191C] tracking-tight">JobPilot</span>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-[#18191C] mb-4">Account Setup</h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* ── Logo Upload ── */}
          <section>
            <h2 className="text-sm font-semibold text-[#18191C] mb-3">Logo Upload</h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`w-[220px] h-[140px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragging ? "border-[#0A65CC] bg-[#EBF3FF]" : "border-[#C8CDD6] bg-white hover:border-[#0A65CC] hover:bg-[#F5F9FF]"
              }`}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded-xl p-2" />
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <div className="w-10 h-10 rounded-full border border-[#E7E7E7] flex items-center justify-center bg-white">
                    <Upload size={16} className="text-[#767F8C]" />
                  </div>
                  <p className="text-xs text-[#474C54]">
                    <span className="font-semibold text-[#0A65CC]">Browse photo</span> or drop here
                  </p>
                  <p className="text-[10px] text-[#A0A9B4] leading-snug">
                    A photo larger than 400 pixels works best.<br />Max file size 5 MB.
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          </section>

          {/* ── Company Info ── */}
          <section>
            <h2 className="text-sm font-semibold text-[#18191C] mb-4">Company Info</h2>
            <div className="flex flex-col gap-4">

              {/* Row 1: Company Name, Org Type, Industry Type */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Organization Type</label>
                  <div className="relative">
                    <select
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                      className={selectClass}
                    >
                      <option value=""></option>
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                      <option value="nonprofit">Non-Profit</option>
                      <option value="government">Government</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767F8C] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Industry Type</label>
                  <div className="relative">
                    <select
                      value={industryType}
                      onChange={(e) => setIndustryType(e.target.value)}
                      className={selectClass}
                    >
                      <option value=""></option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767F8C] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Team Size, Year of Establishment */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Team Size</label>
                  <div className="relative">
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className={selectClass}
                    >
                      <option value=""></option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="201-500">201–500</option>
                      <option value="500+">500+</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767F8C] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Year of Establishment</label>
                  <input
                    type="date"
                    placeholder="e.g. 2010"
                    value={yearEstablished}
                    onChange={(e) => setYearEstablished(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* About Us */}
              <div>
                <label className={labelClass}>About Us</label>
                <textarea
                  value={aboutUs}
                  onChange={(e) => setAboutUs(e.target.value)}
                  rows={4}
                  className="w-full border border-[#E7E7E7] rounded-lg px-3 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* ── Contact Info ── */}
          <section>
            <h2 className="text-sm font-semibold text-[#18191C] mb-4">Contact Info</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Location */}
              <div>
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Contact Number with flag */}
              <div>
                <label className={labelClass}>Contact Number</label>
                <div className="flex items-center border border-[#E7E7E7] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0A65CC]/20 focus-within:border-[#0A65CC] transition-all bg-white">
                  <div className="flex items-center gap-1 px-2.5 border-r border-[#E7E7E7] h-full py-2.5 bg-white shrink-0">
                    {/* US Flag emoji */}
                    <span className="text-base text-black leading-none">🇺🇸</span>
                    <span className="text-xs text-[#474C54] font-medium">+1</span>
                  </div>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="flex-1 px-3 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-lg bg-[#0A65CC] text-white text-sm font-semibold hover:bg-[#0855B0] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0A65CC]"
            >
              {loading ? "Finishing Setup..." : "Finish Setup"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}