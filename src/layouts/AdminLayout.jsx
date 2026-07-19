import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, PackageSearch, Users, LogOut, Menu, X } from 'lucide-react'

export default function AdminLayout() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="flex min-h-screen w-full bg-[#101010]">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-[rgba(244,211,94,0.12)] bg-[#0A0A0A]/90 px-4 backdrop-blur-md md:hidden">
        <h2 className="text-lg font-semibold tracking-widest text-[#F5F2EA]">GLORY MASPRO</h2>
        <button onClick={toggleMenu} className="p-2 text-[#C9AA4A] transition hover:text-[#F5F2EA]">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-[rgba(244,211,94,0.12)] bg-[#0A0A0A] p-6 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#C9AA4A] uppercase">Admin Portal</p>
            <h2 className="mt-1 text-xl font-semibold tracking-widest text-[#F5F2EA]">GLORY MASPRO</h2>
          </div>
          <button onClick={closeMenu} className="p-1 text-soft md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link 
            to="/admin/dashboard" 
            onClick={closeMenu}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              location.pathname === '/admin/dashboard' 
                ? 'bg-[rgba(245,242,234,0.08)] text-[#F4D35E]' 
                : 'text-soft hover:bg-[rgba(245,242,234,0.03)] hover:text-[#F5F2EA]'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          
          <Link 
            to="/admin/products" 
            onClick={closeMenu}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              location.pathname.includes('/admin/products') 
                ? 'bg-[rgba(245,242,234,0.08)] text-[#F4D35E]' 
                : 'text-soft hover:bg-[rgba(245,242,234,0.03)] hover:text-[#F5F2EA]'
            }`}
          >
            <PackageSearch className="h-5 w-5" /> Kelola Katalog
          </Link>

          <Link 
            to="/admin/accounts" 
            onClick={closeMenu}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              location.pathname.includes('/admin/accounts') 
                ? 'bg-[rgba(245,242,234,0.08)] text-[#F4D35E]' 
                : 'text-soft hover:bg-[rgba(245,242,234,0.03)] hover:text-[#F5F2EA]'
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

      {/* Main Content Area */}
      <main className="mt-16 flex-1 w-full p-4 md:mt-0 md:ml-64 md:p-8 overflow-x-hidden">
        <div className="mx-auto w-full max-w-6xl animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
