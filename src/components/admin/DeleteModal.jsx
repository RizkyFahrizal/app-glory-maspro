import { createPortal } from 'react-dom'
import { AlertTriangle } from 'lucide-react'

export default function DeleteModal({ isOpen, itemName, onCancel, onConfirm }) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-[2rem] p-8 text-center border border-[rgba(244,211,94,0.08)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-400/10 text-red-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-[#F5F2EA]">Hapus Data?</h3>
        <p className="mt-2 text-sm text-soft">
          Apakah Anda yakin ingin menghapus <strong>{itemName}</strong> dari sistem? Tindakan ini tidak dapat dibatalkan.
        </p>
        
        <div className="mt-8 flex items-center justify-center gap-4">
          <button 
            onClick={onCancel}
            className="rounded-2xl px-6 py-3 text-sm font-medium text-soft transition hover:text-[#F5F2EA]"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="rounded-2xl bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
          >
            Ya, Hapus Data
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
