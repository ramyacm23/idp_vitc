import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { RefreshCw, Wifi, Battery, CheckCircle } from 'lucide-react'
import { currentVitals, heartRateToday, spo2Today, temperatureToday } from '../data/mockData.js'
import EcgMini from '../components/EcgMini.jsx'

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-surface-400 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-brand-300 font-semibold">{payload[0].value}</p>
    </div>
  )
}

function LiveCard({ icon, label, value, unit, status, color, data, yDomain, children }) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-sm font-medium text-gray-400">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
          <span className="text-xs text-brand-300">Live</span>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold text-gray-100">{value}</span>
        <span className="text-gray-400 mb-1">{unit}</span>
      </div>
      <span className={`badge-${status === 'normal' ? 'normal' : 'warning'} self-start`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {data && (
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a231a" />
            <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis domain={yDomain} tick={{ fill: '#6b7280', fontSize: 9 }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
      {children}
    </div>
  )
}

export default function LiveMonitoring() {
  const [lastRefresh, setLastRefresh] = useState(new Date())

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Live Monitoring</h2>
          <p className="text-sm text-gray-500 mt-0.5">Real-time vitals from ESP32-S3 wearable</p>
        </div>
        <button
          onClick={() => setLastRefresh(new Date())}
          className="flex items-center gap-2 btn-primary"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
        <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <LiveCard icon="❤️" label="Heart Rate" value={currentVitals.heartRate.value} unit="BPM"
          status={currentVitals.heartRate.status} color="#f87171"
          data={heartRateToday} yDomain={[50, 110]} />

        <LiveCard
          icon="🫁"
          label={<>SpO<sub className="text-xs">2</sub></>}
          value={currentVitals.spo2.value}
          unit="%"
          status={currentVitals.spo2.status}
          color="#60a5fa"
          data={spo2Today}
          yDomain={[90, 100]}
        />

        <LiveCard icon="🌡️" label="Temperature" value={currentVitals.temperature.value} unit="°C"
          status={currentVitals.temperature.status} color="#fb923c"
          data={temperatureToday} yDomain={[35.5, 38]} />

        {/* ECG */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <span className="text-sm font-medium text-gray-400">ECG</span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-brand-300">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />Live
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-100">Normal Sinus Rhythm</div>
          <div className="bg-surface-900 rounded-xl p-3">
            <EcgMini width="100%" height={60} animated />
          </div>
          <span className="badge-normal self-start">Normal</span>
        </div>

        {/* Motion */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏃</span>
            <span className="text-sm font-medium text-gray-400">Motion / Activity</span>
          </div>
          <div className="text-4xl font-bold text-gray-100">{currentVitals.motion.status}</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-700 rounded-lg p-3">
              <p className="text-xs text-gray-500">Steps Today</p>
              <p className="text-lg font-bold text-gray-200 mt-1">{currentVitals.motion.steps.toLocaleString()}</p>
            </div>
            <div className="bg-surface-700 rounded-lg p-3">
              <p className="text-xs text-gray-500">Activity</p>
              <p className="text-lg font-bold text-gray-200 mt-1">{currentVitals.motion.activity}</p>
            </div>
          </div>
        </div>

        {/* Device */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📡</span>
            <span className="text-sm font-medium text-gray-400">Device Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-brand-400 rounded-full animate-pulse-slow" />
            <span className="text-xl font-bold text-brand-300">Connected</span>
          </div>
          <div className="space-y-2">
            {[
              [<Wifi size={13}/>, 'Wi-Fi', 'Connected (-62 dBm)'],
              [<Battery size={13}/>, 'Battery', `${currentVitals.device.battery}%`],
            ].map(([icon, k, v]) => (
              <div key={k} className="flex items-center gap-2 text-sm">
                <span className="text-brand-500">{icon}</span>
                <span className="text-gray-500">{k}</span>
                <span className="text-gray-300 ml-auto font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {['MAX30102','AD8232','MLX90614','MPU6050','GPS'].map(s => (
              <div key={s} className="flex items-center gap-2 text-xs">
                <CheckCircle size={11} className="text-brand-500" />
                <span className="text-gray-400 font-mono">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
