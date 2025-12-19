"use client"

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-8 relative">
          <div className="w-32 h-32 rounded-full glass-morphism premium-shadow flex items-center justify-center">
            <div className="relative flex items-center justify-center perspective-1000">
              <div className="relative phone-3d">
                <div className="w-16 h-24 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-blue-400/30 shadow-2xl transform rotate-y-15 rotate-x-5 animate-phone-glow">
                  {/* Phone screen with primary color */}
                  <div className="absolute inset-2 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg shadow-inner overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-lg" />
                    {/* Enhanced screen reflection */}
                    <div className="absolute top-2 left-2 w-3 h-4 bg-white/40 rounded-sm blur-sm" />
                    {/* Screen content simulation */}
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20 rounded-full" />
                    <div className="absolute bottom-4 left-2 right-4 h-0.5 bg-white/15 rounded-full" />
                  </div>
                  {/* Enhanced phone details */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-slate-600 rounded-full" />
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-600 rounded-full border-2 border-blue-400/40" />
                  {/* Premium side shadow */}
                  <div className="absolute -right-1 top-0 w-2 h-full bg-gradient-to-b from-slate-800 to-slate-700 rounded-r-xl opacity-40" />
                </div>
              </div>

              <div className="absolute -top-4 -right-4 card-3d animate-premium-tap">
                <div className="w-12 h-8 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg shadow-2xl transform rotate-y-25 rotate-x-minus-10 rotate-z-minus-15 border border-yellow-500/60 overflow-hidden">
                  {/* Card chip with enhanced styling */}
                  <div className="absolute top-1.5 left-1.5 w-2 h-1.5 bg-gradient-to-b from-slate-800 to-slate-700 rounded-sm shadow-inner" />
                  {/* Enhanced card number lines */}
                  <div className="absolute top-3.5 left-1.5 w-7 h-0.5 bg-slate-800/30 rounded-full" />
                  <div className="absolute top-4.5 left-1.5 w-5 h-0.5 bg-slate-800/25 rounded-full" />
                  <div className="absolute top-5.5 left-1.5 w-6 h-0.5 bg-slate-800/20 rounded-full" />
                  {/* Premium holographic overlay */}
                  <div className="absolute inset-0 animate-holographic rounded-lg" />
                  {/* Enhanced edge highlights */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-800/40 to-slate-800/20 rounded-t-lg" />
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-slate-800/30 to-transparent rounded-l-lg" />
                  {/* Premium 3D shadows */}
                  <div className="absolute -right-1 top-1 w-1 h-full bg-gradient-to-b from-yellow-500/60 to-yellow-400/30 rounded-r-lg opacity-60" />
                  <div className="absolute -bottom-1 left-1 w-full h-1 bg-gradient-to-r from-yellow-500/60 to-yellow-400/30 rounded-b-lg opacity-60" />
                </div>
                {/* Enhanced card shadow on phone */}
                <div className="absolute top-10 left-3 w-8 h-4 bg-yellow-400/20 rounded-full blur-lg animate-premium-tap opacity-40" />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-ping" />
          <div className="absolute inset-4 rounded-full border border-pink-400/30 animate-pulse" />
          <div
            className="absolute inset-8 rounded-full border border-purple-400/20 animate-ping"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent font-sans animate-pulse drop-shadow-lg">
          JuanTap
        </h2>

        <p className="text-purple-100/80 text-lg mb-8 animate-pulse font-sans">Your Identity, One Tap Away.</p>

        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin shadow-lg" />
          <div className="absolute inset-3 w-10 h-10 border-2 border-transparent border-t-pink-400 rounded-full animate-spin" />
        </div>

        <div className="flex gap-3 mt-8">
          <div
            className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-lg"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-3 h-3 bg-pink-400 rounded-full animate-bounce shadow-lg"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse" />
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400/40 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-yellow-400/30 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
    </div>
  )
}
