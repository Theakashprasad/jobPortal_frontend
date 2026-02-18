"use client";

import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

function getActiveNav(pathname: string) {
  if (pathname.startsWith("/jobs/post")) return "Post a Job";
  if (pathname !== "/jobs" && pathname.startsWith("/jobs/")) return "My Jobs";
  return "Overview";
}

function getRouteForNav(label: string) {
  switch (label) {
    case "Overview":
      return "/jobs";
    case "Post a Job":
      return "/jobs/post";
    case "My Jobs":
      return "/jobs";
    default:
      return null;
  }
}

export default function JobsLayoutShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar
        activeNav={getActiveNav(pathname)}
        onNavClick={(label) => {
          const route = getRouteForNav(label);
          if (route) router.push(route);
        }}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

