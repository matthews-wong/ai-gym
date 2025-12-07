"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProgressFormProps {
  onSubmit: (data: { date: string; weight: number; notes: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ProgressForm({ onSubmit, onCancel, loading }: ProgressFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      weight: parseFloat(weight),
      notes,
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date" className="text-gray-200">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-gray-700/50 border-gray-600 text-white mt-1"
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-gray-200">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 75.5"
            required
            className="bg-gray-700/50 border-gray-600 text-white mt-1"
          />
        </div>
        <div>
          <Label htmlFor="notes" className="text-gray-200">
            Notes
          </Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling? Any observations..."
            className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-md p-3 mt-1 min-h-[100px]"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? "Saving..." : "Save Progress"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
