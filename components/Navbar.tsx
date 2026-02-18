"use client";

import { useRouter } from "next/navigation";


interface NavbarProps {
  onPostJob?: () => void;
}


export default function Navbar({onPostJob }: NavbarProps) {
    const router = useRouter();

  return (
    <header className="flex items-center justify-end gap-3 px-8 py-4 bg-white border-b border-[#E7E7E7] flex-shrink-0">
      <button
        onClick={()=> router.push("/jobs/post")}
        className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#0A65CC] text-[#0A65CC] text-sm font-semibold hover:bg-[#E8F1FB] transition-all"
      >
        Post a Job
      </button>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
        D
      </div>
    </header>
  );
}