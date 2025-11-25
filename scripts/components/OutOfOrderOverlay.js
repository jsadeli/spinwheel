// Out of Order Overlay Component
window.OutOfOrderOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  const Icon = window.Icon;
  const ZapIcon = window.ZapIcon;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center overflow-hidden cursor-not-allowed backdrop-blur-sm">

      {/* Sparks Generator */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-8 bg-yellow-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
              animation: `sparkFlash ${0.2 + Math.random() * 0.5}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
              transformOrigin: 'center',
              boxShadow: '0 0 10px #fff, 0 0 20px #fbbf24'
            }}
          ></div>
        ))}
      </div>

      <div className="relative border-8 border-gray-800 bg-gray-900 p-10 rounded-xl shadow-2xl transform -rotate-2 max-w-lg text-center">
        {/* Metal bolts */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-gray-400 rounded-full shadow-inner border border-gray-600"></div>
        <div className="absolute top-2 right-2 w-4 h-4 bg-gray-400 rounded-full shadow-inner border border-gray-600"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-gray-400 rounded-full shadow-inner border border-gray-600"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-gray-400 rounded-full shadow-inner border border-gray-600"></div>

        <h1
          className="text-6xl md:text-7xl font-black text-transparent bg-clip-text uppercase tracking-tighter mb-4"
          style={{
            color: 'rgba(255, 0, 0, 0.1)',
            WebkitTextStroke: '2px #ff0000',
            animation: 'neonFlicker 4s infinite alternate',
            fontFamily: 'Courier New, monospace'
          }}
        >
          OUT OF ORDER
        </h1>

        <div className="text-red-500 font-mono text-lg tracking-widest opacity-80 animate-pulse">
          SYSTEM FAILURE // OVERHEAT
        </div>

        <div className="mt-8 p-4 bg-black/50 border border-red-900/50 rounded text-red-400/60 text-xs font-mono">
          ERROR_CODE: 0xDEAD_WHEEL <br />
          CHECKSUM: JEΔFREYSA?ELi <br />
          Please refresh to reboot system.
        </div>

      </div>
    </div>
  );
};
