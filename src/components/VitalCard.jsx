// Reusable stat card used across Dashboard and Live Monitoring
export default function VitalCard({ icon, label, value, unit, status, sub, trend, children }) {
  const statusColor = {
    normal:  'badge-normal',
    warning: 'badge-warning',
    danger:  'badge-danger',
  }[status] || 'badge-info'

  const trendColor = trend && trend.startsWith('+') ? 'text-brand-400' : trend && trend.startsWith('-') ? 'text-red-400' : 'text-gray-500'

  return (
    <div className="card flex flex-col gap-3 hover:border-brand-700 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-sm font-medium text-gray-400">{label}</span>
        </div>
        {status && <span className={statusColor}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-100 leading-none">{value}</span>
        {unit && <span className="text-sm text-gray-400 mb-0.5">{unit}</span>}
        {trend && <span className={`text-xs font-medium mb-0.5 ${trendColor}`}>{trend}</span>}
      </div>

      {sub && <p className="text-xs text-gray-500">{sub}</p>}
      {children}
    </div>
  )
}
