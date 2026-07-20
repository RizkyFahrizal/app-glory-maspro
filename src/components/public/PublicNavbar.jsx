import { Link } from 'react-router-dom'

export default function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(0,0,0,0.1)] bg-gradient-to-r from-[#D4AF37] to-[#C9A227] shadow-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A3000]/70">Property Collection</p>
          <h1 className="mt-1 text-xl font-bold tracking-[0.28em] text-[#2C1A00] md:text-2xl">
            GLORY MASPRO
          </h1>
        </div>

        <Link
          to="/admin"
          className="group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-bold text-[#96700A] transition-all duration-300 border border-[#96700A]"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F2EA 100%)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
          }}
        >
          <span className="relative z-10">Login</span>
          <div className="absolute inset-0 bg-[#96700A]/0 transition-all duration-300 group-hover:bg-[#96700A]/10 rounded-full" />
        </Link>
      </div>
    </nav>
  )
}