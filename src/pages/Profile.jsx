import { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { user } from '../data/mockData.js'

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...user })

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Profile</h2>
          <p className="text-sm text-gray-500 mt-0.5">Your personal health profile</p>
        </div>
        <button
          onClick={() => setEditing(v => !v)}
          className={editing ? 'btn-ghost border border-surface-400 rounded-lg' : 'btn-primary'}
        >
          {editing ? <><X size={14} className="inline mr-1.5" />Cancel</> : <><Edit2 size={14} className="inline mr-1.5" />Edit</>}
        </button>
      </div>

      {/* Avatar + name */}
      <div className="card flex items-center gap-5">
        <div className="w-20 h-20 bg-brand-800 rounded-full flex items-center justify-center text-brand-300 font-bold text-3xl flex-shrink-0">
          {user.name[0]}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-100">{form.fullName}</h3>
          <p className="text-sm text-gray-500">{form.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge-normal">Patient</span>
            <span className="badge-info">VIT Chennai</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-200 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['Full Name', 'fullName'],
            ['Email', 'email'],
            ['Age', 'age'],
            ['Blood Group', 'bloodGroup'],
            ['Height', 'height'],
            ['Weight', 'weight'],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="text-xs text-gray-500 block mb-1">{label}</label>
              {editing ? (
                <input
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-surface-700 border border-surface-400 focus:border-brand-700 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none transition-colors"
                />
              ) : (
                <p className="text-sm font-medium text-gray-200 py-2">{form[key]}</p>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <button
            onClick={() => setEditing(false)}
            className="btn-primary mt-4 flex items-center gap-2"
          >
            <Save size={14} /> Save Changes
          </button>
        )}
      </div>

      {/* Emergency contact */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-200 mb-4">Emergency Contact</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Phone Number</p>
            <p className="text-sm font-medium text-gray-200 mt-1">{form.emergencyContact}</p>
          </div>
          <span className="badge-normal">Active</span>
        </div>
      </div>

      {/* Device binding */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-200 mb-4">Linked Device</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-900/50 rounded-xl flex items-center justify-center text-brand-400 text-lg">📡</div>
          <div>
            <p className="text-sm font-semibold text-gray-200">VitalSync Wearable</p>
            <p className="text-xs text-gray-500 font-mono">ESP32-S3 · Connected</p>
          </div>
          <span className="badge-normal ml-auto">Active</span>
        </div>
      </div>
    </div>
  )
}
