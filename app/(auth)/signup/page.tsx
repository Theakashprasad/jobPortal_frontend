"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signUp } from "@/services/auth.service";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!firstName.trim()) {
      setError("first name is required");
      return;
    }

    if (!lastName.trim()) {
      setError("Username is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

         console.log(response)
      // Store user data if provided
      if (response) {
        localStorage.setItem("userId", JSON.stringify(response._id));
      }

      // Navigate to account setup or login page
      router.push("/accountSetup");
    } catch (err: any) {
      console.error("Signup error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create account. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* ── Left Panel ── */}
      <div className="w-[825px] flex-shrink-0 flex flex-col px-12 py-10 bg-white border border-[#E7E7E7] rounded-r-3xl relative z-10 shadow-xl overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#0A65CC" />
            <path
              d="M10 16.5C10 13.46 12.46 11 15.5 11H22v2h-6.5C13.57 13 12 14.57 12 16.5S13.57 20 15.5 20H22v2h-6.5C12.46 22 10 19.54 10 16.5Z"
              fill="white"
            />
            <circle cx="21" cy="16.5" r="2" fill="white" />
          </svg>
          <span className="font-bold text-lg text-[#18191C] tracking-tight">JobPilot</span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#18191C] mb-1.5">Welcome to JobPilot</h1>
          <p className="text-sm text-[#767F8C]">
            Already have an account?{" "}
            <a href="/login" className="text-[#0A65CC] font-semibold hover:underline">
              Log In
            </a>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Full Name + Username */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#474C54] mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-[#E7E7E7] rounded-lg px-3 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#474C54] mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-[#E7E7E7] rounded-lg px-3 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#474C54] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E7E7E7] rounded-lg px-3 py-2.5 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-[#474C54] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#E7E7E7] rounded-lg px-3 py-2.5 pr-10 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767F8C] hover:text-[#474C54] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-[#474C54] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-[#E7E7E7] rounded-lg px-3 py-2.5 pr-10 text-sm text-[#18191C] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A65CC]/20 focus:border-[#0A65CC] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767F8C] hover:text-[#474C54] transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-[#767F8C] leading-relaxed">
            By creating an account, you agree to the{" "}
            <a href="#" className="text-[#18191C] underline hover:text-[#0A65CC] transition-colors">
              Terms of use
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#18191C] underline hover:text-[#0A65CC] transition-colors">
              Privacy Policy
            </a>
            .
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#0A65CC] text-white text-sm font-semibold hover:bg-[#0855B0] active:scale-[0.99] transition-all mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0A65CC]"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#E7E7E7]" />
          <span className="text-xs text-[#767F8C] font-medium">OR</span>
          <div className="flex-1 h-px bg-[#E7E7E7]" />
        </div>

        {/* Social Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E7E7E7] rounded-lg text-sm font-medium text-[#18191C] hover:bg-gray-50 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Sign up with Facebook
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E7E7E7] rounded-lg text-sm font-medium text-[#18191C] hover:bg-gray-50 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </button>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"
          alt="Team collaboration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}