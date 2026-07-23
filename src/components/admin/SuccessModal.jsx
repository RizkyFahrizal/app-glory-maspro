import { createPortal } from 'react-dom'
import { CheckCircle2 } from 'lucide-react'

export default function SuccessModal({ isOpen, title, message, onOk }) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center border border-[rgba(0,0,0,0.06)] bg-white">
        <CheckCircle2 className="mb-4 h-12 w-12 text-[#D4AF37]" />
        <h3 className="text-xl font-semibold text-[#1F2937]">{title}</h3>
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
