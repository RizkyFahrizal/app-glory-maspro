import { createPortal } from 'react-dom'
import { AlertCircle } from 'lucide-react'

export default function AlertModal({ isOpen, title, message, onOk }) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center border border-[rgba(0,0,0,0.06)] bg-white shadow-xl shadow-red-900/5">
        <AlertCircle className="mb-4 h-12 w-12 text-[#E74C3C]" />
        <h3 className="text-xl font-semibold text-[#1F2937]">{title}</h3>
        <p className="mt-2 text-sm text-soft">{message}</p>
        {onOk && (
          <button 
            type="button"
            onClick={onOk}
            className="mt-6 w-full rounded-2xl py-3 text-sm font-semibold transition bg-[#E74C3C] text-white hover:bg-[#C0392B] focus:outline-none focus:ring-4 focus:ring-red-100"
          >
            Mengerti
          </button>
        )}
      </div>
    </div>,
    document.body
  )
}
