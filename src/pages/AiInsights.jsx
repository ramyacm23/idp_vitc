import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { CheckCircle, AlertCircle, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { aiInsights, heartRateToday, spo2Today, temperatureToday, activityToday } from '../data/mockData.js'

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-surface-400 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-brand-300 font-semibold">{payload[0].value}</p>
    </div>
  )
}

function TrendChip({ trend }) {
  if (trend === 'stable') return <span className="flex items-center gap-1 text-xs text-brand-300"><Minus size={12}/>Stable</span>
  if (trend === 'rising') return <span className="flex items-center gap-1 text-xs text-yellow-300"><TrendingUp size={12}/>Rising</span>
  if (trend === 'moderate') return <span className="flex items-center gap-1 text-xs text-blue-300"><TrendingUp size={12}/>Moderate</span>
  return <span className="flex items-center gap-1 text-xs text-red-300"><TrendingDown size={12}/>Declining</span>
}

function MiniTrendChart({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={70}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a231a" />
        <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={false} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function AiInsights() {
  const score = aiInsights.healthScore
  const circumference = 2 * Math.PI * 54

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-100">AI Health Insights</h2>
        <p className="text-sm text-gray-500 mt-0.5">Powered by VitalSync AI — not a substitute for medical advice</p>
      </div>

      {/* Health Score + Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score */}
        <div className="card flex flex-col items-center justify-center py-8 gap-4">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="54" fill="none" stroke="#1a231a" strokeWidth="10" />
              <circle cx="64" cy="64" r="54" fill="none" stroke="#16a34a" strokeWidth="10"
                strokeDasharray={`${circumference * score / 100} ${circumference}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-brand-300">{score}</span>
              <span className="text-sm text-gray-500">/ 100</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-gray-200">Health Score</p>
            <p className="text-xs text-gray-500 mt-1">Excellent — Keep it up!</p>
          </div>
        </div>

        {/* Observations */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200">AI Observations</h3>
            <span className="text-xs text-gray-600 italic">AI-assisted — not a medical diagnosis</span>
          </div>
          <ul className="space-y-3">
            {aiInsights.observations.map((obs, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-surface-700 rounded-xl">
                {obs.type === 'normal'  && <CheckCircle size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />}
                {obs.type === 'warning' && <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />}
                {obs.type === 'info'    && <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />}
                <p className="text-sm text-gray-300 leading-relaxed">{obs.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Heart Rate', data: heartRateToday, color: '#f87171', trend: aiInsights.trends.heartRate, unit: 'BPM' },
          { label: 'SpO₂', data: spo2Today, color: '#60a5fa', trend: aiInsights.trends.spo2, unit: '%' },
          { label: 'Temperature', data: temperatureToday, color: '#fb923c', trend: aiInsights.trends.temperature, unit: '°C' },
          { label: 'Activity', data: activityToday.map(d => ({ ...d, value: d.steps })), color: '#a78bfa', trend: aiInsights.trends.activity, unit: 'steps' },
        ].map(({ label, data, color, trend, unit }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">{label}</span>
              <TrendChip trend={trend} />
            </div>
            <MiniTrendChart data={data} color={color} />
            <p className="text-xs text-gray-600 mt-1">{unit}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-surface-700 border border-surface-400 rounded-xl p-4">
        <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-400 leading-relaxed">
          <span className="font-semibold text-gray-300">Disclaimer: </span>
          VitalSync AI insights are generated from sensor data for informational purposes only.
          They do not constitute medical advice, diagnosis, or treatment.
          Always consult a qualified healthcare professional for medical concerns.
        </p>
      </div>
    </div>
  )
}
