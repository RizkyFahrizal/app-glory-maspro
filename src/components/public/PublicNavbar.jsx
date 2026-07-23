import { Link } from 'react-router-dom'

export default function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(0,0,0,0.1)] bg-gradient-to-r from-[#ffe055] via-[#E8D080] to-[#ffe055] shadow-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A3000]/70">Property Collection</p>
          <h1 className="mt-1 text-xl font-bold tracking-[0.28em] text-[#2C1A00] md:text-2xl">
            GLORY MASPRO
          </h1>
        </div>

        <Link
          to="/admin/login"
          className="group relative flex items-center justify-center overflow-hidden rounded-full px-8 py-2.5 text-sm font-bold text-[#2C1A00] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:brightness-105 active:translate-y-0 active:shadow-md"
          style={{
            background: 'linear-gradient(rgb(217, 216, 214), rgb(255, 255, 255))',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 14px, rgba(255, 255, 255, 0.15) 0px 1px 1px inset, rgba(0, 0, 0, 0.5) 0px -1px 1px inset',
            border: '1px solid rgb(255, 255, 255)'
          }}
        >
          <span className="relative z-10 tracking-widest uppercase">Login</span>
          {/* Shiny sheen effect on hover */}
          <div className="absolute inset-0 w-[150%] bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-full" />
        </Link>
      </div>
    </nav>
  )
}