"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { getProfile, updateUsername, Profile } from "@/lib/services/profileService";
import { User, Loader2, Check, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getProfile(user.id);
    if (data) {
      setProfile(data);
      setUsername(data.username || "");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    const result = await updateUsername(user.id, username);

    if (result.success) {
      setMessage({ type: "success", text: "Username updated successfully!" });
      setProfile((prev) => (prev ? { ...prev, username: username.trim().toLowerCase() } : null));
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update username" });
    }

    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-stone-500 mt-1">Manage your account settings</p>
        </header>

        <section className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile</h2>
              <p className="text-sm text-stone-500">Update your profile information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-xl text-stone-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-stone-400 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
              />
              <p className="mt-2 text-xs text-stone-500">
                Only letters, numbers, and underscores. 3-30 characters.
              </p>
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl ${
                  message.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {message.type === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving || !username.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 disabled:from-stone-700 disabled:to-stone-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-teal-500/20 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
