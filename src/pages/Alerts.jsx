import { useState } from 'react'
import { Filter, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { alerts } from '../data/mockData.js'

const severityIcon = {
  info:    <Info size={15} className="text-blue-400" />,
  warning: <AlertCircle size={15} className="text-yellow-400" />,
  danger:  <AlertTriangle size={15} className="text-red-400" />,
}

const severityBadge = {
  info:    'badge-info',
  warning: 'badge-warning',
  danger:  'badge-danger',
}

export default function Alerts() {
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Active', 'Resolved', 'Warning', 'Danger']

  const filtered = alerts.filter(a => {
    if (filter === 'All') return true
    if (filter === 'Active') return a.status === 'active'
    if (filter === 'Resolved') return a.status === 'resolved'
    return a.severity === filter.toLowerCase()
  })

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Alerts</h2>
          <p className="text-sm text-gray-500 mt-0.5">{alerts.filter(a => a.status === 'active').length} active alerts</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-500" />
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-brand-800 text-brand-200' : 'bg-surface-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          ['Total', alerts.length, 'text-gray-200'],
          ['Active', alerts.filter(a => a.status === 'active').length, 'text-yellow-300'],
          ['Resolved', alerts.filter(a => a.status === 'resolved').length, 'text-brand-300'],
          ['Critical', alerts.filter(a => a.severity === 'danger').length, 'text-red-300'],
        ].map(([label, count, color]) => (
          <div key={label} className="card-sm text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{count}</p>
          </div>
        ))}
      </div>

      {/* Alerts table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-500 bg-surface-700">
                {['Severity', 'Message', 'Type', 'Sensor', 'Value', 'Time', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} className={`border-b border-surface-600/50 hover:bg-surface-700 transition-colors ${i % 2 === 0 ? '' : 'bg-surface-800/50'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {severityIcon[a.severity]}
                      <span className={severityBadge[a.severity]}>{a.severity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 max-w-xs">{a.message}</td>
                  <td className="px-4 py-3 text-gray-400">{a.type}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{a.sensor}</td>
                  <td className="px-4 py-3 text-gray-300 font-medium">{a.value}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{a.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {a.status === 'resolved'
                        ? <CheckCircle size={13} className="text-brand-500" />
                        : <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      }
                      <span className={a.status === 'resolved' ? 'text-brand-400' : 'text-yellow-400'}>
                        {a.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">No alerts match this filter.</div>
          )}
        </div>
      </div>
    </div>
  )
}
