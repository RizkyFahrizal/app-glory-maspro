import { Link } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#101010] p-4">
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-[#E7D48A] transition hover:text-[#F5F2EA]">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="section-label">Admin Portal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-widest text-[#F4D35E]">GLORY MASPRO</h1>
          <p className="mt-3 text-sm text-soft">Silakan login untuk mengelola katalog properti Anda.</p>
        </div>

        <div className="glass-panel animate-fade-in rounded-[2rem] p-8">
          <form className="flex flex-col gap-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Email Admin</label>
              <input 
                type="email" 
                placeholder="admin@glorymaspro.com" 
                className="input-minimal w-full rounded-2xl py-3 px-4"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-minimal w-full rounded-2xl py-3 px-4"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-soft">
                <input type="checkbox" className="rounded border-[rgba(245,242,234,0.08)] bg-[rgba(245,242,234,0.03)] accent-[#C9AA4A]" />
                Ingat Saya
              </label>
              <a href="#" className="text-[#E7D48A] transition hover:text-[#F5F2EA] hover:underline">Lupa Password?</a>
            </div>

            <Link to="/admin/dashboard" className="btn-gold mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold transition">
              <Lock className="h-4 w-4" /> Masuk ke Dashboard
            </Link>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-soft">
          &copy; 2026 Glory Maspro. Restricted Access.
        </p>
      </div>
    </div>
  )
}
