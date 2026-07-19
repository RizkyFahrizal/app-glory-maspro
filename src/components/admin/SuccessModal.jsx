import { createPortal } from 'react-dom'
import { CheckCircle2 } from 'lucide-react'

export default function SuccessModal({ isOpen, title, message, onOk }) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center border border-[rgba(244,211,94,0.08)]">
        <CheckCircle2 className="mb-4 h-12 w-12 text-[#C9AA4A]" />
        <h3 className="text-xl font-semibold text-[#F5F2EA]">{title}</h3>
        <p className="mt-2 text-sm text-soft">{message}</p>
        {onOk && (
          <button 
            onClick={onOk}
            className="btn-gold mt-6 w-full rounded-2xl py-3 text-sm font-semibold transition"
          >
            OK, Lanjut
          </button>
        )}
      </div>
    </div>,
    document.body
  )
}
