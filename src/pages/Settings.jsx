import { useState } from 'react'
import { Bell, Shield, Palette, User, Cpu, ChevronRight } from 'lucide-react'

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${value ? 'bg-brand-600' : 'bg-surface-500'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-surface-500">
        <div className="w-8 h-8 bg-brand-900/50 rounded-lg flex items-center justify-center">
          <Icon size={15} className="text-brand-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const [s, setS] = useState({
    pushNotif: true, emailNotif: false, smsNotif: true,
    hrAlert: true, spo2Alert: true, tempAlert: true, motionAlert: false,
    darkTheme: true, compactMode: false,
    twoFactor: false, dataSharing: false,
    autoSync: true, highFreq: false,
  })
  const set = key => val => setS(p => ({ ...p, [key]: val }))

  const [hrThreshold, setHrThreshold] = useState(100)
  const [spo2Threshold, setSpo2Threshold] = useState(95)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-100">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your preferences and account</p>
      </div>

      <Section icon={Bell} title="Notifications">
        <SettingRow label="Push Notifications" desc="Receive alerts on your device">
          <Toggle value={s.pushNotif} onChange={set('pushNotif')} />
        </SettingRow>
        <SettingRow label="Email Notifications" desc="Get alerts via email">
          <Toggle value={s.emailNotif} onChange={set('emailNotif')} />
        </SettingRow>
        <SettingRow label="SMS Alerts" desc="Critical alerts via SMS">
          <Toggle value={s.smsNotif} onChange={set('smsNotif')} />
        </SettingRow>
      </Section>

      <Section icon={Shield} title="Alert Preferences">
        <SettingRow label="Heart Rate Alerts" desc={`Alert above ${hrThreshold} BPM`}>
          <div className="flex items-center gap-3">
            <input type="range" min="80" max="140" value={hrThreshold}
              onChange={e => setHrThreshold(+e.target.value)}
              className="w-24 accent-brand-600" />
            <span className="text-xs font-mono text-gray-300 w-14">{hrThreshold} BPM</span>
            <Toggle value={s.hrAlert} onChange={set('hrAlert')} />
          </div>
        </SettingRow>
        <SettingRow label="SpO₂ Alerts" desc={`Alert below ${spo2Threshold}%`}>
          <div className="flex items-center gap-3">
            <input type="range" min="88" max="98" value={spo2Threshold}
              onChange={e => setSpo2Threshold(+e.target.value)}
              className="w-24 accent-brand-600" />
            <span className="text-xs font-mono text-gray-300 w-10">{spo2Threshold}%</span>
            <Toggle value={s.spo2Alert} onChange={set('spo2Alert')} />
          </div>
        </SettingRow>
        <SettingRow label="Temperature Alerts">
          <Toggle value={s.tempAlert} onChange={set('tempAlert')} />
        </SettingRow>
        <SettingRow label="Motion Alerts">
          <Toggle value={s.motionAlert} onChange={set('motionAlert')} />
        </SettingRow>
      </Section>

      <Section icon={Palette} title="Appearance">
        <SettingRow label="Dark Theme" desc="VitalSync dark green theme">
          <Toggle value={s.darkTheme} onChange={set('darkTheme')} />
        </SettingRow>
        <SettingRow label="Compact Mode" desc="Reduce card padding">
          <Toggle value={s.compactMode} onChange={set('compactMode')} />
        </SettingRow>
      </Section>

      <Section icon={User} title="Account">
        <SettingRow label="Two-Factor Authentication" desc="Extra security for your account">
          <Toggle value={s.twoFactor} onChange={set('twoFactor')} />
        </SettingRow>
        <SettingRow label="Data Sharing" desc="Share anonymized data for research">
          <Toggle value={s.dataSharing} onChange={set('dataSharing')} />
        </SettingRow>
        <div className="pt-2 border-t border-surface-500 space-y-2">
          {['Change Password', 'Export Health Data', 'Delete Account'].map(label => (
            <button key={label} className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${label === 'Delete Account' ? 'text-red-400 hover:bg-red-900/20' : 'text-gray-300 hover:bg-surface-600'}`}>
              {label}
              <ChevronRight size={14} className="text-gray-600" />
            </button>
          ))}
        </div>
      </Section>

      <Section icon={Cpu} title="Device Preferences">
        <SettingRow label="Auto Sync" desc="Sync data automatically every 5 minutes">
          <Toggle value={s.autoSync} onChange={set('autoSync')} />
        </SettingRow>
        <SettingRow label="High Frequency Sampling" desc="Sample at 250 Hz (uses more battery)">
          <Toggle value={s.highFreq} onChange={set('highFreq')} />
        </SettingRow>
      </Section>
    </div>
  )
}
