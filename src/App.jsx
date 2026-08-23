import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LiveMonitoring from './pages/LiveMonitoring.jsx'
import EcgMonitor from './pages/EcgMonitor.jsx'
import HealthHistory from './pages/HealthHistory.jsx'
import AiInsights from './pages/AiInsights.jsx'
import Alerts from './pages/Alerts.jsx'
import Location from './pages/Location.jsx'
import Device from './pages/Device.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/"          element={<Dashboard />} />
        <Route path="/live"      element={<LiveMonitoring />} />
        <Route path="/ecg"       element={<EcgMonitor />} />
        <Route path="/history"   element={<HealthHistory />} />
        <Route path="/insights"  element={<AiInsights />} />
        <Route path="/alerts"    element={<Alerts />} />
        <Route path="/location"  element={<Location />} />
        <Route path="/device"    element={<Device />} />
        <Route path="/profile"   element={<Profile />} />
        <Route path="/settings"  element={<Settings />} />
      </Route>
    </Routes>
  )
}
