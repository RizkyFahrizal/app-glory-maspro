import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, LogIn } from 'lucide-react'
import logoImg from '../../assets/public/logo-glory-maspro.webp'

export default function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-[rgba(0,0,0,0.1)] bg-gradient-to-r from-[#ffe055] via-[#E8D080] to-[#ffe055] shadow-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 md:gap-4">
            <img 
              src={logoImg} 
              alt="Logo Glory Maspro" 
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover shadow-sm border border-white/40" 
            />
            <div>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A3000]/70">Property Collection</p>
              <h1 className="mt-0.5 md:mt-1 text-lg font-bold tracking-[0.28em] text-[#2C1A00] md:text-2xl">
                GLORY MASPRO
              </h1>
            </div>
          </div>

          {/* Desktop Login Button */}
          <Link
            to="/admin/login"
            className="group relative hidden md:flex items-center justify-center overflow-hidden rounded-full px-8 py-2.5 text-sm font-bold text-[#2C1A00] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:brightness-105 active:translate-y-0 active:shadow-md"
            style={{
              background: 'linear-gradient(rgb(217, 216, 214), rgb(255, 255, 255))',
              boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 14px, rgba(255, 255, 255, 0.15) 0px 1px 1px inset, rgba(0, 0, 0, 0.5) 0px -1px 1px inset',
              border: '1px solid rgb(255, 255, 255)'
            }}
          >
            <span className="relative z-10 tracking-widest uppercase">Login Admin</span>
            <div className="absolute inset-0 w-[150%] bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-full" />
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-[#2C1A00] transition hover:text-[#B8860B] md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-[100dvh] w-64 flex-col transform border-l border-white/40 bg-white/60 p-6 backdrop-blur-xl shadow-lg shadow-[#b8860b]/5 transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-bold tracking-widest text-[#B8860B] uppercase">Menu Utama</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1 text-soft transition hover:text-[#2C1A00]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            to="/admin/login"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#B8860B] shadow-sm ring-1 ring-black/5 transition hover:bg-white/80"
          >
            <LogIn className="h-5 w-5" />
            Login Admin
          </Link>
        </div>
      </div>
    </>
  )
}