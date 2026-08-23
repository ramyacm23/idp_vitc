import { useState } from 'react'
import { AlertTriangle, X, Phone } from 'lucide-react'

export default function SosButton() {
  const [modal, setModal] = useState(false)
  const [activated, setActivated] = useState(false)

  function handleConfirm() {
    setActivated(true)
    setTimeout(() => { setActivated(false); setModal(false) }, 3000)
  }

  return (
    <>
      <button
        onClick={() => setModal(true)}
        className="flex items-center gap-2 bg-red-900/40 hover:bg-red-800/60 border border-red-700/50 text-red-300 hover:text-red-200 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group"
      >
        <AlertTriangle size={16} className="group-hover:animate-pulse" />
        Emergency SOS
      </button>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-700 border border-red-700/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            {activated ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Phone size={28} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">SOS Activated</h3>
                <p className="text-gray-400 text-sm">Simulated — no real alert sent.</p>
                <p className="text-xs text-gray-500 mt-2">(UI prototype only)</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-900/60 rounded-xl flex items-center justify-center">
                      <AlertTriangle size={20} className="text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">Emergency SOS</h3>
                      <p className="text-gray-400 text-xs">UI prototype — no real action</p>
                    </div>
                  </div>
                  <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-300">
                    <X size={18} />
                  </button>
                </div>

                <p className="text-gray-300 text-sm mb-5">
                  Are you sure you want to activate SOS? This will alert your emergency contact.
                </p>

                <div className="flex gap-3">
                  <button onClick={() => setModal(false)} className="flex-1 btn-ghost border border-surface-400 rounded-lg py-2">
                    Cancel
                  </button>
                  <button onClick={handleConfirm} className="flex-1 bg-red-700 hover:bg-red-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                    Activate SOS
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
