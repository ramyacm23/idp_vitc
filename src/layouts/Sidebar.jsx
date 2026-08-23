import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Activity, Heart, History, Brain,
  Bell, MapPin, Cpu, User, Settings, LogOut, X
} from 'lucide-react'
import Logo from '../components/Logo.jsx'

const navItems = [
  { to: '/',               icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/live',           icon: Activity,        label: 'Live Monitoring' },
  { to: '/ecg',            icon: Heart,           label: 'ECG Monitor'     },
  { to: '/history',        icon: History,         label: 'Health History'  },
  { to: '/insights',       icon: Brain,           label: 'AI Insights'     },
  { to: '/alerts',         icon: Bell,            label: 'Alerts'          },
  { to: '/location',       icon: MapPin,          label: 'Location'        },
  { to: '/device',         icon: Cpu,             label: 'Device'          },
  { to: '/profile',        icon: User,            label: 'Profile'         },
  { to: '/settings',       icon: Settings,        label: 'Settings'        },
]

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
     ${isActive
       ? 'bg-brand-900/60 text-brand-300 nav-active'
       : 'text-gray-400 hover:bg-surface-600 hover:text-gray-100'}`

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        bg-surface-800 border-r border-surface-500
        w-60 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-surface-500">
          <Logo size="md" />
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-300">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass} onClick={onClose}>
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-surface-500">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-surface-600 hover:text-red-400 transition-colors"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
