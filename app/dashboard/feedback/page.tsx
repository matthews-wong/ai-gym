"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, MessageSquare, Loader2, Check } from "lucide-react";

const skipReasons = [
  { id: "no_time", label: "Didn't have time" },
  { id: "not_feeling_well", label: "Not feeling well" },
  { id: "no_ingredients", label: "Missing ingredients" },
  { id: "too_difficult", label: "Too difficult/complex" },
  { id: "not_hungry", label: "Not hungry" },
  { id: "social_event", label: "Social event/eating out" },
  { id: "other", label: "Other reason" },
];

function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useRequireAuth();
  
  const [itemId, setItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = searchParams.get("item");
    if (item) {
      setItemId(item);
      fetchItemDetails(item);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchItemDetails = async (id: string) => {
    try {
      const { data } = await supabase
        .from("plan_items")
        .select("item_name")
        .eq("id", id)
        .single();

      if (data) {
        setItemName(data.item_name);
      }
    } catch {
      // Error fetching item
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !itemId || !selectedReason) return;

    setSubmitting(true);

    try {
      await supabase.from("plan_feedback").insert({
        user_id: user.id,
        plan_item_id: itemId,
        feedback_type: "skipped",
        reason: skipReasons.find(r => r.id === selectedReason)?.label || selectedReason,
        additional_notes: additionalNotes || null,
      });

      await supabase
        .from("plan_items")
        .update({ 
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq("id", itemId);

      setSubmitted(true);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch {
      // Error submitting feedback
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="fixed inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Thanks for your feedback</h2>
          <p className="text-stone-500">Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <header className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-300 text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Skip Item</h1>
              {itemName && (
                <p className="text-sm text-stone-500">{itemName}</p>
              )}
            </div>
          </div>
        </header>

        {/* Feedback Form */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-stone-400 mb-5">
              Help us improve your plans by telling us why you&apos;re skipping this item.
            </p>
            
            <div className="space-y-3">
              {skipReasons.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    selectedReason === reason.id
                      ? "bg-sky-500/10 border-sky-500/30 text-white"
                      : "bg-stone-900 border-stone-800/50 text-stone-300 hover:border-stone-700"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selectedReason === reason.id
                      ? "bg-sky-500 border-sky-500"
                      : "border-stone-600"
                  }`}>
                    {selectedReason === reason.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{reason.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-stone-400 mb-2">
              Additional notes (optional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Tell us more..."
              rows={3}
              className="w-full bg-stone-900 border border-stone-800/50 rounded-xl p-4 text-white placeholder:text-stone-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 resize-none text-sm transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard"
              className="flex-1 py-3.5 text-center text-sm font-semibold text-stone-400 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={!selectedReason || submitting}
              className="flex-1 py-3.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 disabled:from-stone-700 disabled:to-stone-700 disabled:text-stone-500 rounded-xl shadow-lg shadow-sky-500/20 disabled:shadow-none transition-all duration-300"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  );
}
