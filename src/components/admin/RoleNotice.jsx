import { ShieldOff } from 'lucide-react'

/**
 * Banner notifikasi yang muncul di bawah judul halaman
 * ketika pengguna dengan role marketing mencoba mengakses
 * halaman yang dibatasi.
 */
export default function RoleNotice({ message }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#E74C3C]/20 bg-red-50 px-5 py-4 shadow-sm animate-fade-in">
      <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-[#E74C3C]" />
      <div>
        <p className="text-sm font-semibold text-[#C0392B]">Akses Dibatasi</p>
        <p className="mt-0.5 text-xs text-red-600/80">{message}</p>
      </div>
    </div>
  )
}
