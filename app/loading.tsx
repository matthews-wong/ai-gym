export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center">
      {/* Circular Spinner */}
      <div className="relative mb-8">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-emerald-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-400 rounded-full animate-spin opacity-60" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></div>
      </div>

      {/* Brand */}
      <div className="text-center animate-pulse">
        <h1 className="text-2xl font-light text-white tracking-wide">
          AI Gym<span className="text-emerald-400 font-medium">BRO</span>
        </h1>
        <div className="mt-2 text-gray-400 text-sm">
          Loading...
        </div>
      </div>
    </div>
  )
}