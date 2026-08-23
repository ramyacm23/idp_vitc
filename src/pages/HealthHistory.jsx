import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts'
import {
  heartRateToday, heartRate7Days, heartRate30Days,
  spo2Today, spo27Days,
  temperatureToday, temperature7Days,
  activityToday
} from '../data/mockData.js'

const FILTERS = ['Today', '7 Days', '30 Days']

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-surface-400 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

function HistoryChart({ title, data, color, yDomain, unit, refLines = [] }) {
  const vals = data.map(d => d.value)
  const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  const min = Math.min(...vals)
  const max = Math.max(...vals)

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Avg <span className="font-semibold text-gray-300">{avg} {unit}</span></span>
          <span>Min <span className="font-semibold text-gray-300">{min} {unit}</span></span>
          <span>Max <span className="font-semibold text-gray-300">{max} {unit}</span></span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a231a" />
          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis domain={yDomain} tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          {refLines.map(r => <ReferenceLine key={r.y} y={r.y} stroke={r.color} strokeDasharray="4 4" />)}
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} name={unit} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function HealthHistory() {
  const [filter, setFilter] = useState('Today')

  const hrData = filter === 'Today' ? heartRateToday : filter === '7 Days' ? heartRate7Days : heartRate30Days
  const spo2Data = filter === 'Today' ? spo2Today : spo27Days
  const tempData = filter === 'Today' ? temperatureToday : temperature7Days

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Health History</h2>
          <p className="text-sm text-gray-500 mt-0.5">Historical trends and analysis</p>
        </div>
        <div className="flex bg-surface-700 rounded-xl p-1 gap-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-brand-800 text-brand-200' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HistoryChart title="Heart Rate (BPM)" data={hrData} color="#f87171" yDomain={[50, 120]} unit="BPM"
          refLines={[{ y: 100, color: '#fca5a5' }, { y: 60, color: '#fca5a5' }]} />
        <HistoryChart
          title={<>SpO<sub>2</sub> (%)</>}
          data={spo2Data}
          color="#60a5fa"
          yDomain={[88, 100]}
          unit="%"
          refLines={[{ y: 95, color: '#93c5fd' }]}
        />
        <HistoryChart title="Body Temperature (°C)" data={tempData} color="#fb923c" yDomain={[35, 38.5]} unit="°C"
          refLines={[{ y: 37.5, color: '#fdba74' }]} />

        {/* Activity bar chart */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-200 mb-4">Activity — Steps Today</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={activityToday} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a231a" />
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="steps" fill="#166534" radius={[3, 3, 0, 0]} name="Steps" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          ['Avg Heart Rate', '77 BPM', '❤️'],
          ['Avg SpO₂', '98%', '🫁'],
          ['Avg Temperature', '36.7 °C', '🌡️'],
          ['Total Steps', '4,820', '🏃'],
        ].map(([label, value, icon]) => (
          <div key={label} className="card-sm text-center">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-100 mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
