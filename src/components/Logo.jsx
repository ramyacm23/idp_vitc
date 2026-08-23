// VitalSync AI — Logo component
// Replace with <img src="/logo.png"> if you add a real logo file to /public
export default function Logo({ size = 'md', collapsed = false }) {
  const sizes = { sm: 28, md: 36, lg: 48 }
  const px = sizes[size] || 36

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Icon mark */}
      <svg width={px} height={px} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#166534"/>
        <rect width="40" height="40" rx="10" fill="url(#grad)" opacity="0.4"/>
        <path
          d="M5 20 L10 20 L13 12 L17 28 L21 8 L25 24 L28 17 L31 20 L35 20"
          stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#166534"/>
            <stop offset="1" stopColor="#14532d"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Wordmark — hidden when sidebar is collapsed */}
      {!collapsed && (
        <div className="leading-tight">
          <div className="text-white font-bold text-base tracking-tight">VitalSync</div>
          <div className="text-brand-400 font-semibold text-xs tracking-widest uppercase">AI</div>
        </div>
      )}
    </div>
  )
}
