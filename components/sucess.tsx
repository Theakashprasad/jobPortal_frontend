"use client";

import { Zap } from "lucide-react";

interface ProfileCompleteProps {
  onViewDashboard?: () => void;
  onPostJob?: () => void;
}

export default function ProfileComplete({ onViewDashboard, onPostJob }: ProfileCompleteProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo */}
      <div className="px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0A65CC] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-lg text-[#18191C] tracking-tight">JobPilot</span>
        </div>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          {/* Check icon circle */}
          <div className="w-16 h-16 rounded-full bg-[#E8E8F4] flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17L4 12"
                stroke="#7B7FC4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-[#18191C] mb-2">
            🎉 Congratulations, Your profile is 100% complete!
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-[#767F8C] mb-8">
            🎉 Congratulations, Your profile is 100% complete!
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onViewDashboard}
              className="px-7 py-2.5 rounded-full border border-[#D6D6F5] text-sm font-semibold text-[#474C54] hover:bg-gray-50 transition-all"
            >
              View Dashboard
            </button>
            <button
              onClick={onPostJob}
              className="px-7 py-2.5 rounded-full bg-[#5B52F3] text-white text-sm font-semibold hover:bg-[#4A42D8] transition-all"
            >
              Post a Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}