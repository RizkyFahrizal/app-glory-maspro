import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFBF7] px-4 text-center">
      <div className="glass-panel max-w-md rounded-[2rem] p-8 md:p-12 border border-[rgba(0,0,0,0.06)] shadow-xl">
        <h1 className="text-8xl font-black text-[#D4AF37]">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-[#1F2937]">Halaman Tidak Ditemukan</h2>
        <p className="mt-4 text-sm leading-relaxed text-soft">
          Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="btn-gold inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold transition"
          >
            <Home className="h-5 w-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
