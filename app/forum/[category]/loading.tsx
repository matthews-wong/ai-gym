export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-stone-800 rounded-md animate-pulse mb-2" />
          <div className="h-4 w-72 bg-stone-800/60 rounded animate-pulse" />
        </div>

        {/* Action bar skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-5 w-24 bg-stone-800 rounded animate-pulse" />
          <div className="h-10 w-32 bg-stone-800 rounded-lg animate-pulse" />
        </div>

        {/* Thread list skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-stone-900/50 border border-stone-800 rounded-xl p-5"
            >
              <div className="flex items-start gap-4">
                {/* Avatar skeleton */}
                <div className="h-10 w-10 rounded-full bg-stone-800 animate-pulse flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  {/* Title skeleton */}
                  <div className="h-5 w-3/4 bg-stone-800 rounded animate-pulse mb-3" />
                  
                  {/* Content preview skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="h-3 w-full bg-stone-800/60 rounded animate-pulse" />
                    <div className="h-3 w-5/6 bg-stone-800/60 rounded animate-pulse" />
                  </div>
                  
                  {/* Meta info skeleton */}
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-20 bg-stone-800/50 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-stone-800/50 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-stone-800/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
