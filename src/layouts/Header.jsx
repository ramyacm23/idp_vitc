import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Search, Bell, Wifi, ChevronDown, X, Check } from 'lucide-react'
import { user } from '../data/mockData.js'
import { alerts } from '../data/mockData.js'

const pageTitles = {
  '/':          'Dashboard',
  '/live':      'Live Monitoring',
  '/ecg':       'ECG Monitor',
  '/history':   'Health History',
  '/insights':  'AI Insights',
  '/alerts':    'Alerts',
  '/location':  'Location',
  '/device':    'Device',
  '/profile':   'Profile',
  '/settings':  'Settings',
}

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')

  const unread = alerts.filter(a => a.status === 'active').length

  return (
    <header className="sticky top-0 z-20 bg-surface-800/90 backdrop-blur border-b border-surface-500 px-4 lg:px-6 h-16 flex items-center gap-4">
      {/* Hamburger */}
      <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-gray-100 p-1">
        <Menu size={22} />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-gray-100 hidden sm:block min-w-max">
        {pageTitles[pathname] || 'VitalSync AI'}
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-xs relative hidden md:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search vitals, alerts…"
          className="w-full bg-surface-700 border border-surface-400 rounded-lg pl-9 pr-3 py-1.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-700 transition-colors"
        />
      </div>

      <div className="flex-1" />

      {/* Device status */}
      <div className="hidden sm:flex items-center gap-2 bg-brand-900/40 border border-brand-800/50 px-3 py-1.5 rounded-lg">
        <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-slow" />
        <Wifi size={13} className="text-brand-400" />
        <span className="text-xs font-medium text-brand-300">ESP32-S3 Connected</span>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(v => !v); setProfileOpen(false) }}
          className="relative p-2 rounded-lg hover:bg-surface-600 text-gray-400 hover:text-gray-100 transition-colors"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 bg-surface-700 border border-surface-400 rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-500">
              <span className="text-sm font-semibold text-gray-100">Notifications</span>
              <button onClick={() => setNotifOpen(false)}><X size={15} className="text-gray-500" /></button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {alerts.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-600 border-b border-surface-600/50 last:border-0">
                  <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    a.severity === 'danger' ? 'bg-red-400' :
                    a.severity === 'warning' ? 'bg-yellow-400' : 'bg-brand-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 leading-snug">{a.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.time}</p>
                  </div>
                  {a.status === 'resolved' && <Check size={13} className="text-brand-500 mt-0.5 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
          className="flex items-center gap-2 hover:bg-surface-600 px-2 py-1.5 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 bg-brand-800 rounded-full flex items-center justify-center text-brand-300 font-bold text-sm">
            {user.name[0]}
          </div>
          <span className="text-sm font-medium text-gray-300 hidden sm:block">{user.name}</span>
          <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-12 w-52 bg-surface-700 border border-surface-400 rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-surface-500">
              <p className="text-sm font-semibold text-gray-100">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            {[['Profile', '/profile'], ['Settings', '/settings']].map(([label, path]) => (
              <a key={path} href={path} className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-surface-600 hover:text-gray-100 transition-colors">
                {label}
              </a>
            ))}
            <div className="border-t border-surface-500">
              <button className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-surface-600 transition-colors">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
