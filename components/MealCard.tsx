"use client";

import { Utensils, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MealCardProps {
  id: string;
  title: string;
  calories: number;
  createdAt: string;
  onDelete?: (id: string) => void;
}

export function MealCard({
  id,
  title,
  calories,
  createdAt,
  onDelete,
}: MealCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
            <Utensils className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-green-400 font-medium">{calories} calories</p>
            <p className="text-gray-500 text-sm mt-1">
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
