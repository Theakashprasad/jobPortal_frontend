"use client";

import axios from "axios";
import {
  LayoutDashboard,
  User,
  PlusSquare,
  Briefcase,
  Bookmark,
  CreditCard,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Employers profile", icon: User },
  { label: "Post a Job", icon: PlusSquare },
  { label: "My Jobs", icon: Briefcase },
  { label: "Saved Candidate", icon: Bookmark },
  { label: "Plans & Billing", icon: CreditCard },
  { label: "Settings", icon: Settings },
];

interface SidebarProps {
  activeNav?: string;
  onNavClick?: (label: string) => void;
}

export default function Sidebar({ activeNav = "Overview", onNavClick }: SidebarProps) {

  const router = useRouter(); // ✅ MUST BE HERE (TOP LEVEL)

  const logoutHandler = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true, // 🔥 important for cookies
      });

      router.replace("/login"); // better than push
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-[#E7E7E7] flex flex-col h-full">
      
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#E7E7E7]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0A65CC] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-lg text-[#18191C] tracking-tight">
            JobPilot
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onNavClick?.(label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 ${
              activeNav === label
                ? "bg-[#E8F1FB] text-[#0A65CC]"
                : "text-[#474C54] hover:bg-gray-50 hover:text-[#18191C]"
            }`}
          >
            <Icon size={16} className={activeNav === label ? "text-[#0A65CC]" : "text-[#767F8C]"} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={logoutHandler}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#474C54] hover:bg-red-50 hover:text-red-500 transition-all duration-150 group"
        >
          <LogOut size={16} className="text-[#767F8C] group-hover:text-red-400" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
