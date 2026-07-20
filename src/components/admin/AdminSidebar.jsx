import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, PackageSearch, Users, LogOut, X } from 'lucide-react'

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-[rgba(212,175,55,0.2)] bg-[#FCFAF5]/80 p-6 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#B8860B] uppercase">Admin Portal</p>
            <h2 className="mt-1 text-xl font-semibold tracking-widest text-[#1F2937]">GLORY MASPRO</h2>
          </div>
          <button onClick={onClose} className="p-1 text-soft md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link 
            to="/admin/dashboard" 
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              location.pathname === '/admin/dashboard' 
                ? 'bg-[#D4AF37] text-white shadow-sm' 
                : 'text-soft hover:bg-[rgba(0,0,0,0.03)] hover:text-[#1F2937]'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          
          <Link 
            to="/admin/products" 
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              location.pathname.includes('/admin/products') 
                ? 'bg-[#D4AF37] text-white shadow-sm' 
                : 'text-soft hover:bg-[rgba(0,0,0,0.03)] hover:text-[#1F2937]'
            }`}
          >
            <PackageSearch className="h-5 w-5" /> Kelola Katalog
          </Link>

          <Link 
            to="/admin/accounts" 
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              location.pathname.includes('/admin/accounts') 
                ? 'bg-[#D4AF37] text-white shadow-sm' 
                : 'text-soft hover:bg-[rgba(0,0,0,0.03)] hover:text-[#1F2937]'
            }`}
          >
            <Users className="h-5 w-5" /> Kelola Akun
          </Link>
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <Link 
            to="/admin" 
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-400/10 hover:text-red-300"
          >
            <LogOut className="h-5 w-5" /> Logout
          </Link>
        </div>
      </aside>
    </>
  )
}
