import { useState } from 'react'
import { Play, Square, ZoomIn, ZoomOut } from 'lucide-react'
import EcgWaveform from '../components/EcgWaveform.jsx'

export default function EcgMonitor() {
  const [monitoring, setMonitoring] = useState(true)
  const [timeScale, setTimeScale] = useState(25)

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100">ECG Monitor</h2>
          <p className="text-sm text-gray-500 mt-0.5">12-lead equivalent cardiac rhythm analysis</p>
        </div>
        <div className="flex items-center gap-3">
          {monitoring && (
            <span className="flex items-center gap-1.5 text-xs text-red-300 bg-red-900/30 border border-red-800/40 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Recording
            </span>
          )}
          <button
            onClick={() => setMonitoring(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              monitoring
                ? 'bg-red-900/40 hover:bg-red-800/60 text-red-300 border border-red-700/40'
                : 'btn-primary'
            }`}
          >
            {monitoring ? <><Square size={14} /> Stop Monitoring</> : <><Play size={14} /> Start Monitoring</>}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          ['Heart Rate', '78 BPM', 'text-red-300'],
          ['Rhythm', 'Normal Sinus', 'text-brand-300'],
          ['PR Interval', '160 ms', 'text-blue-300'],
          ['QRS Duration', '90 ms', 'text-purple-300'],
        ].map(([label, value, color]) => (
          <div key={label} className="card-sm">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-lg font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Main ECG display */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-200">Lead II — Continuous</h3>
            <span className={`badge-${monitoring ? 'normal' : 'info'}`}>
              {monitoring ? 'Monitoring' : 'Paused'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Time scale:</span>
            <button onClick={() => setTimeScale(v => Math.max(10, v - 5))} className="btn-ghost p-1.5 rounded-lg">
              <ZoomOut size={14} />
            </button>
            <span className="text-xs font-mono text-gray-300 w-12 text-center">{timeScale} mm/s</span>
            <button onClick={() => setTimeScale(v => Math.min(50, v + 5))} className="btn-ghost p-1.5 rounded-lg">
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        <div className="bg-surface-900 rounded-xl p-4 border border-surface-600">
          <EcgWaveform height={160} animated={monitoring} />
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
          <span>0 s</span>
          <span>2 s</span>
          <span>4 s</span>
          <span>6 s</span>
          <span>8 s</span>
          <span>10 s</span>
        </div>
      </div>

      {/* Rhythm analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-200 mb-4">Rhythm Analysis</h3>
          <div className="space-y-3">
            {[
              ['Rhythm Type', 'Normal Sinus Rhythm', 'normal'],
              ['Rate', '78 BPM', 'normal'],
              ['Regularity', 'Regular', 'normal'],
              ['P Wave', 'Present, Normal', 'normal'],
              ['ST Segment', 'No deviation', 'normal'],
              ['T Wave', 'Normal', 'normal'],
            ].map(([k, v, s]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-surface-600 last:border-0">
                <span className="text-sm text-gray-400">{k}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200">{v}</span>
                  <span className="badge-normal">{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-gray-200 mb-4">Session Info</h3>
          <div className="space-y-3">
            {[
              ['Device', 'AD8232 ECG Module'],
              ['Electrode', '3-lead configuration'],
              ['Sample Rate', '250 Hz'],
              ['Duration', '00:12:34'],
              ['Artifacts', 'None detected'],
              ['Quality', 'Excellent'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-surface-600 last:border-0">
                <span className="text-sm text-gray-400">{k}</span>
                <span className="text-sm font-medium text-gray-200">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
