"use client"

interface MealSkeletonProps {
  progress?: number
  stage?: string
}

export default function MealSkeleton({ progress = 0, stage }: MealSkeletonProps) {
  return (
    <div className="min-h-screen bg-stone-950 pt-20 animate-in fade-in duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress indicator */}
        {progress > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-amber-400">{stage || "Generating..."}</span>
              <span className="text-stone-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-20 bg-stone-800 rounded-lg skeleton" />
          <div className="h-10 w-32 bg-stone-800 rounded-lg skeleton" />
        </div>

        {/* Plan header skeleton */}
        <div className="bg-stone-900/80 border border-stone-800/50 rounded-2xl p-6 mb-6">
          <div className="h-8 w-48 bg-stone-800 rounded-lg skeleton mb-3" />
          <div className="h-4 w-full bg-stone-800 rounded skeleton mb-2" />
          <div className="h-4 w-2/3 bg-stone-800 rounded skeleton mb-4" />
          
          <div className="flex flex-wrap gap-4">
            <div className="h-6 w-28 bg-stone-800 rounded skeleton" />
            <div className="h-6 w-24 bg-stone-800 rounded skeleton" />
          </div>
        </div>

        {/* Day selector skeleton */}
        <div className="flex items-center justify-between bg-stone-900/80 border border-stone-800/50 rounded-xl p-4 mb-6">
          <div className="h-8 w-8 bg-stone-800 rounded-lg skeleton" />
          <div className="text-center">
            <div className="h-6 w-24 bg-stone-800 rounded skeleton mx-auto mb-1" />
            <div className="h-4 w-16 bg-stone-800 rounded skeleton mx-auto" />
          </div>
          <div className="h-8 w-8 bg-stone-800 rounded-lg skeleton" />
        </div>

        {/* Macro summary skeleton */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {["Calories", "Protein", "Carbs", "Fat"].map((macro, i) => (
            <div
              key={macro}
              className="bg-stone-900/80 border border-stone-800/50 rounded-xl p-3 text-center"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-6 w-12 bg-stone-800 rounded skeleton mx-auto mb-1" />
              <div className="h-3 w-10 bg-stone-800 rounded skeleton mx-auto" />
            </div>
          ))}
        </div>

        {/* Meals skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((meal) => (
            <div
              key={meal}
              className="bg-stone-900/80 border border-stone-800/50 rounded-xl overflow-hidden"
              style={{ animationDelay: `${meal * 150}ms` }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-800 rounded-lg skeleton" />
                    <div>
                      <div className="h-5 w-24 bg-stone-800 rounded skeleton mb-1" />
                      <div className="h-4 w-20 bg-stone-800 rounded skeleton" />
                    </div>
                  </div>
                  <div className="h-5 w-5 bg-stone-800 rounded skeleton" />
                </div>

                {/* Food items */}
                {meal === 1 && (
                  <div className="space-y-2 pt-3 border-t border-stone-800/50">
                    {[1, 2, 3].map((food) => (
                      <div key={food} className="flex items-center justify-between py-2">
                        <div className="h-4 w-36 bg-stone-800 rounded skeleton" />
                        <div className="flex gap-3">
                          <div className="h-4 w-12 bg-stone-800 rounded skeleton" />
                          <div className="h-4 w-12 bg-stone-800 rounded skeleton" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .skeleton {
            background: linear-gradient(
              90deg,
              rgb(41 37 36) 0%,
              rgb(68 64 60) 50%,
              rgb(41 37 36) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    </div>
  )
}
