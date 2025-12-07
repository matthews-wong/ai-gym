"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Dumbbell, Loader2, Check, ArrowLeft } from "lucide-react";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, user, loading: authLoading, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authError) setLocalError(authError);
  }, [authError]);

  const validatePassword = (pass: string): string | null => {
    if (pass.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError("Please enter your email address");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setLocalError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    const { error, needsConfirmation } = await signUp(email, password, username || email.split("@")[0]);

    if (error) {
      setLocalError(error);
      setIsSubmitting(false);
    } else if (needsConfirmation) {
      setSuccess(true);
      setIsSubmitting(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignup = async () => {
    setLocalError(null);
    clearError();
    setIsGoogleLoading(true);
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      setLocalError(error);
      setIsGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
        <div className="fixed inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-stone-400 mb-8">
            We sent a confirmation link to <span className="text-white font-medium">{email}</span>
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 rounded-xl shadow-lg shadow-teal-500/20 transition-all duration-300"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">GymBRO</span>
          </Link>
        </div>

        <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800/50 rounded-2xl p-7 sm:p-8">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
            <p className="text-stone-500">Start your fitness journey</p>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            ) : (
              <>
                <GoogleIcon className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-stone-900 text-stone-500">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isSubmitting || isGoogleLoading}
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-stone-300 mb-2">
                Username <span className="text-stone-500">(optional)</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="your_username"
                disabled={isSubmitting || isGoogleLoading}
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
              />
              <p className="text-xs text-stone-500 mt-1">Letters, numbers, and underscores only</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                disabled={isSubmitting || isGoogleLoading}
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-300 mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isSubmitting || isGoogleLoading}
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
              />
            </div>

            {localError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{localError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 disabled:from-stone-700 disabled:to-stone-700 disabled:text-stone-500 rounded-xl shadow-lg shadow-teal-500/20 disabled:shadow-none transition-all duration-300"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-7">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 text-sm text-stone-600 hover:text-stone-400 mt-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
