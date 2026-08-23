import { MapPin, Navigation, Clock, Activity } from 'lucide-react'
import { location, locationHistory } from '../data/mockData.js'

function MapPlaceholder() {
  return (
    <div className="relative w-full h-64 bg-surface-900 rounded-xl overflow-hidden border border-surface-500">
      <svg width="100%" height="100%" viewBox="0 0 400 256" preserveAspectRatio="xMidYMid slice">
        {/* Background */}
        <rect width="400" height="256" fill="#0a0f0a"/>
        {/* Grid */}
        {[40,80,120,160,200,240,280,320,360].map(x => <line key={x} x1={x} y1="0" x2={x} y2="256" stroke="#1a231a" strokeWidth="1"/>)}
        {[40,80,120,160,200,240].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#1a231a" strokeWidth="1"/>)}
        {/* Roads */}
        <path d="M0,128 Q100,120 200,128 Q300,136 400,128" stroke="#243024" strokeWidth="6" fill="none"/>
        <path d="M200,0 Q204,64 200,128 Q196,192 200,256" stroke="#243024" strokeWidth="5" fill="none"/>
        <path d="M0,80 Q80,76 160,80" stroke="#1e2a1e" strokeWidth="3" fill="none"/>
        <path d="M240,176 Q320,172 400,176" stroke="#1e2a1e" strokeWidth="3" fill="none"/>
        <path d="M120,0 Q124,40 120,80" stroke="#1e2a1e" strokeWidth="3" fill="none"/>
        {/* Buildings */}
        {[[60,50,30,20],[80,160,25,18],[300,60,35,22],[320,180,28,20],[140,100,20,15],[260,140,22,16]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#1a231a" rx="2"/>
        ))}
        {/* Location pulse */}
        <circle cx="200" cy="128" r="24" fill="#166534" opacity="0.15"/>
        <circle cx="200" cy="128" r="16" fill="#166534" opacity="0.25"/>
        <circle cx="200" cy="128" r="8" fill="#166534" opacity="0.5"/>
        <circle cx="200" cy="128" r="5" fill="#4ade80"/>
        {/* Pin */}
        <path d="M200,108 C193,108 187,114 187,121 C187,131 200,143 200,143 C200,143 213,131 213,121 C213,114 207,108 200,108 Z" fill="#16a34a" opacity="0.9"/>
        <circle cx="200" cy="121" r="4" fill="white" opacity="0.9"/>
        {/* Labels */}
        <text x="200" y="160" textAnchor="middle" fill="#4ade80" fontSize="10" fontFamily="monospace">
          {location.lat}°N, {location.lng}°E
        </text>
        <text x="200" y="175" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">
          {location.address}
        </text>
      </svg>
    </div>
  )
}

export default function Location() {
  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-100">Location</h2>
        <p className="text-sm text-gray-500 mt-0.5">GPS tracking via ESP32-S3 wearable</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200">Current Location</h3>
            <span className="flex items-center gap-1.5 text-xs text-brand-300">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              {location.status}
            </span>
          </div>
          <MapPlaceholder />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              [<MapPin size={13}/>, 'Latitude', location.lat],
              [<MapPin size={13}/>, 'Longitude', location.lng],
              [<Clock size={13}/>, 'Last Updated', location.lastUpdated],
              [<Activity size={13}/>, 'Movement', location.movement],
            ].map(([icon, label, value]) => (
              <div key={label} className="bg-surface-700 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  {icon}
                  <span className="text-xs">{label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-200 font-mono">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location history */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-200 mb-4">Location History</h3>
          <div className="space-y-0">
            {locationHistory.map((h, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-surface-600/50 last:border-0">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${i === locationHistory.length - 1 ? 'bg-brand-400' : 'bg-surface-400'}`} />
                  {i < locationHistory.length - 1 && <div className="w-px h-8 bg-surface-500 mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200">{h.place}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{h.lat}, {h.lng}</p>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
