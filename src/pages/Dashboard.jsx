import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import {
  ArrowRight, TrendingUp, TrendingDown, Minus,
  CheckCircle, AlertCircle, Info, Wifi, Battery
} from 'lucide-react'
import {
  currentVitals, user, heartRateToday, spo2Today, temperatureToday,
  alerts, location, aiInsights
} from '../data/mockData.js'
import VitalCard from '../components/VitalCard.jsx'
import EcgMini from '../components/EcgMini.jsx'
import SosButton from '../components/SosButton.jsx'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-surface-400 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-brand-300 font-semibold">{payload[0].value} {payload[0].unit || ''}</p>
    </div>
  )
}

function MiniChart({ data, color = '#4ade80', unit }) {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
        <Tooltip content={<ChartTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function StatChart({ data, color, yDomain, unit, label }) {
  const vals = data.map(d => d.value)
  const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  const min = Math.min(...vals)
  const max = Math.max(...vals)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-200">{label}</h3>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Avg <span className="text-gray-300 font-medium">{avg}</span></span>
          <span>Min <span className="text-gray-300 font-medium">{min}</span></span>
          <span>Max <span className="text-gray-300 font-medium">{max}</span></span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a231a" />
          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis domain={yDomain} tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: color }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">

      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{greeting()}, {user.name} 👋</h2>
          <p className="text-gray-500 text-sm mt-0.5">Here's your health overview · {today}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-brand-300 bg-brand-900/30 border border-brand-800/40 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-slow" />
            ESP32-S3 Connected
          </div>
          <SosButton />
        </div>
      </div>

      {/* Vital Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Heart Rate */}
        <VitalCard icon="❤️" label="Heart Rate" value={currentVitals.heartRate.value} unit="BPM" status={currentVitals.heartRate.status} trend={`${currentVitals.heartRate.trend} BPM`}>
          <MiniChart data={heartRateToday.slice(-6)} color="#f87171" />
        </VitalCard>

        {/* SpO2 */}
        <VitalCard
          icon="🫁"
          label={<>SpO<sub className="text-xs">2</sub></>}
          value={currentVitals.spo2.value}
          unit="%"
          status={currentVitals.spo2.status}
          trend={`${currentVitals.spo2.trend}%`}
        >
          <MiniChart data={spo2Today.slice(-6)} color="#60a5fa" />
        </VitalCard>

        {/* Temperature */}
        <VitalCard icon="🌡️" label="Temperature" value={currentVitals.temperature.value} unit="°C" status={currentVitals.temperature.status} trend={`${currentVitals.temperature.trend}°`}>
          <MiniChart data={temperatureToday.slice(-6)} color="#fb923c" />
        </VitalCard>

        {/* ECG */}
        <div className="card hover:border-brand-700 transition-colors duration-200 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <span className="text-sm font-medium text-gray-400">ECG</span>
            </div>
            <span className="badge-normal">Normal</span>
          </div>
          <div className="text-base font-bold text-gray-100">Normal Rhythm</div>
          <EcgMini width={120} height={32} animated />
        </div>

        {/* Motion */}
        <VitalCard icon="🏃" label="Motion" value={currentVitals.motion.status} status="normal" sub={`${currentVitals.motion.steps.toLocaleString()} steps today`} />

        {/* Device */}
        <div className="card hover:border-brand-700 transition-colors duration-200 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📡</span>
            <span className="text-sm font-medium text-gray-400">Device</span>
          </div>
          <div className="text-xl font-bold text-brand-300">Connected</div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-mono">ESP32-S3</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Wifi size={11} className="text-brand-500" />
              <span>Wi-Fi Connected</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Battery size={11} className="text-brand-500" />
              <span>{currentVitals.device.battery}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <StatChart data={heartRateToday} color="#f87171" yDomain={[50, 110]} label="Heart Rate (BPM)" />
        </div>
        <div className="lg:col-span-1">
          <StatChart data={spo2Today} color="#60a5fa" yDomain={[90, 100]} label={<>SpO<sub>2</sub> (%)</>} />
        </div>
        <div className="lg:col-span-1">
          <StatChart data={temperatureToday} color="#fb923c" yDomain={[35.5, 38]} label="Temperature (°C)" />
        </div>
      </div>

      {/* ECG + AI Insights row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ECG Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200">ECG Monitoring</h3>
              <p className="text-xs text-gray-500 mt-0.5">Real-time cardiac rhythm</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-brand-300 bg-brand-900/40 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              Monitoring
            </span>
          </div>
          <div className="bg-surface-900 rounded-xl p-3 mb-4 overflow-hidden">
            <EcgMini width="100%" height={60} animated />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              ['Heart Rate', '78 BPM'],
              ['Rhythm', 'Normal Sinus'],
              ['Status', 'Normal'],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface-700 rounded-lg p-2.5">
                <p className="text-xs text-gray-500">{k}</p>
                <p className="text-sm font-semibold text-gray-200 mt-0.5">{v}</p>
              </div>
            ))}
          </div>
          <Link to="/ecg" className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
            View Full ECG <ArrowRight size={14} />
          </Link>
        </div>

        {/* AI Insights */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200">VitalSync AI Insights</h3>
              <p className="text-xs text-gray-500 mt-0.5">AI-assisted — not a medical diagnosis</p>
            </div>
            {/* Health Score circle */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#1a231a" strokeWidth="5" />
                <circle cx="28" cy="28" r="22" fill="none" stroke="#16a34a" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 22 * aiInsights.healthScore / 100} ${2 * Math.PI * 22}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-brand-300 leading-none">{aiInsights.healthScore}</span>
                <span className="text-[9px] text-gray-500">/ 100</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            {aiInsights.observations.slice(0, 4).map((obs, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                {obs.type === 'normal'  && <CheckCircle size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />}
                {obs.type === 'warning' && <AlertCircle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />}
                {obs.type === 'info'    && <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />}
                <span className="text-gray-300 leading-snug">{obs.text}</span>
              </li>
            ))}
          </ul>
          <Link to="/insights" className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Full AI Analysis <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Alerts + Location + Device row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alerts */}
        <div className="card">
          <div className="section-title">Recent Alerts</div>
          <ul className="space-y-2.5 mb-4">
            {alerts.slice(0, 3).map(a => (
              <li key={a.id} className="flex items-start gap-2.5">
                <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  a.severity === 'danger' ? 'bg-red-400' :
                  a.severity === 'warning' ? 'bg-yellow-400' : 'bg-brand-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 leading-snug">{a.message}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{a.time}</p>
                </div>
                <span className={a.status === 'active' ? 'badge-warning' : 'badge-normal'}>
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/alerts" className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
            View All Alerts <ArrowRight size={14} />
          </Link>
        </div>

        {/* Location */}
        <div className="card">
          <div className="section-title">Current Location</div>
          {/* Map placeholder */}
          <div className="bg-surface-900 rounded-xl h-28 mb-3 relative overflow-hidden border border-surface-500">
            <svg width="100%" height="100%" viewBox="0 0 200 112" preserveAspectRatio="xMidYMid slice">
              {/* Grid */}
              {[20,40,60,80,100,120,140,160,180].map(x => <line key={x} x1={x} y1="0" x2={x} y2="112" stroke="#1a231a" strokeWidth="1"/>)}
              {[20,40,60,80,100].map(y => <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#1a231a" strokeWidth="1"/>)}
              {/* Roads */}
              <path d="M0,56 Q50,50 100,56 Q150,62 200,56" stroke="#243024" strokeWidth="4" fill="none"/>
              <path d="M100,0 Q104,30 100,56 Q96,80 100,112" stroke="#243024" strokeWidth="3" fill="none"/>
              {/* Location pin */}
              <circle cx="100" cy="56" r="8" fill="#166534" opacity="0.4"/>
              <circle cx="100" cy="56" r="4" fill="#4ade80"/>
              <circle cx="100" cy="56" r="12" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.5"/>
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><p className="text-gray-500">Latitude</p><p className="text-gray-200 font-mono font-medium">{location.lat}</p></div>
            <div><p className="text-gray-500">Longitude</p><p className="text-gray-200 font-mono font-medium">{location.lng}</p></div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
            <span className="text-xs text-brand-300">{location.status}</span>
          </div>
        </div>

        {/* Device */}
        <div className="card">
          <div className="section-title">VitalSync Wearable</div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-slow" />
            <span className="text-sm font-semibold text-gray-200">ESP32-S3</span>
            <span className="badge-normal ml-auto">Connected</span>
          </div>
          <div className="space-y-1.5 mb-3">
            {['MAX30102','AD8232','MLX90614','MPU6050','GPS','SOS Button'].map(s => (
              <div key={s} className="flex items-center gap-2 text-xs">
                <CheckCircle size={12} className="text-brand-500" />
                <span className="text-gray-400 font-mono">{s}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-surface-500 pt-3">
            <div><p className="text-gray-500">Battery</p><p className="text-gray-200 font-medium">{currentVitals.device.battery}%</p></div>
            <div><p className="text-gray-500">Signal</p><p className="text-gray-200 font-medium">{currentVitals.device.signal} dBm</p></div>
            <div className="col-span-2"><p className="text-gray-500">Last Sync</p><p className="text-gray-200 font-medium">Just now</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
