"use client";

import { Dumbbell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkoutCardProps {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  onDelete?: (id: string) => void;
}

export function WorkoutCard({
  id,
  name,
  description,
  createdAt,
  onDelete,
}: WorkoutCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{name}</h3>
            <p className="text-gray-400 mt-1">{description}</p>
            <p className="text-gray-500 text-sm mt-2">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
