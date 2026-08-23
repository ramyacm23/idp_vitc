import { CheckCircle, XCircle, Wifi, Battery, RefreshCw, Cpu } from 'lucide-react'
import { currentVitals } from '../data/mockData.js'

const sensors = [
  { name: 'MAX30102', desc: 'Heart Rate & SpO₂', status: true },
  { name: 'AD8232',   desc: 'ECG Module',         status: true },
  { name: 'MLX90614', desc: 'IR Temperature',     status: true },
  { name: 'MPU6050',  desc: 'Accelerometer/Gyro', status: true },
  { name: 'GPS',      desc: 'Location Module',    status: true },
  { name: 'SOS',      desc: 'Emergency Button',   status: true },
]

function BatteryBar({ pct }) {
  const color = pct > 50 ? '#16a34a' : pct > 20 ? '#ca8a04' : '#dc2626'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-surface-600 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium text-gray-300 w-8">{pct}%</span>
    </div>
  )
}

function SignalBars({ dbm }) {
  // -50 excellent, -70 good, -80 fair, -90 poor
  const bars = dbm > -60 ? 4 : dbm > -70 ? 3 : dbm > -80 ? 2 : 1
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1,2,3,4].map(b => (
        <div key={b} className={`w-1.5 rounded-sm ${b <= bars ? 'bg-brand-400' : 'bg-surface-500'}`}
          style={{ height: `${b * 25}%` }} />
      ))}
    </div>
  )
}

export default function Device() {
  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-100">Device Management</h2>
        <p className="text-sm text-gray-500 mt-0.5">VitalSync Wearable — ESP32-S3</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main device card */}
        <div className="card lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand-900/50 rounded-xl flex items-center justify-center">
              <Cpu size={24} className="text-brand-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-100">VitalSync Wearable</h3>
              <p className="text-xs text-gray-500 font-mono">ESP32-S3-WROOM-1</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Connection</p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-brand-400 rounded-full animate-pulse-slow" />
                <span className="text-sm font-semibold text-brand-300">Connected</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1.5">Battery</p>
              <BatteryBar pct={currentVitals.device.battery} />
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1.5">Wi-Fi Signal</p>
              <div className="flex items-center gap-2">
                <SignalBars dbm={currentVitals.device.signal} />
                <span className="text-xs text-gray-400 font-mono">{currentVitals.device.signal} dBm</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-500">
              {[
                ['Firmware', 'v2.1.4'],
                ['Uptime', '14h 32m'],
                ['Last Sync', 'Just now'],
                ['IP Address', '192.168.1.42'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-500">{k}</p>
                  <p className="text-xs font-medium text-gray-300 font-mono mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="flex items-center gap-2 btn-primary w-full justify-center mt-6">
            <RefreshCw size={14} />
            Sync Now
          </button>
        </div>

        {/* Sensors */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-200 mb-4">Sensor Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sensors.map(s => (
              <div key={s.name} className="flex items-center gap-3 bg-surface-700 rounded-xl p-4">
                {s.status
                  ? <CheckCircle size={18} className="text-brand-400 flex-shrink-0" />
                  : <XCircle size={18} className="text-red-400 flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 font-mono">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
                <span className={s.status ? 'badge-normal' : 'badge-danger'}>
                  {s.status ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}
          </div>

          {/* Network info */}
          <div className="mt-4 bg-surface-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wifi size={15} className="text-brand-400" />
              <h4 className="text-sm font-semibold text-gray-200">Network</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                ['SSID', 'VIT-IoT-Lab'],
                ['Protocol', 'Wi-Fi 802.11n'],
                ['Frequency', '2.4 GHz'],
                ['Security', 'WPA2'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-gray-500">{k}</p>
                  <p className="text-gray-300 font-medium mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
