import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminTopbar from '../components/admin/AdminTopbar'
import AdminSidebar from '../components/admin/AdminSidebar'

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-transparent text-[#1F2937]">
      {/* Decorative background layer matching public side */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-[#F5D87A]/30 blur-[100px]" />
        <div className="absolute top-1/3 -right-20 h-[350px] w-[350px] rounded-full bg-[#C9A84C]/20 blur-[80px]" />
        <div className="absolute bottom-0 -left-20 h-[300px] w-[400px] rounded-full bg-[#D4AF37]/15 blur-[80px]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#7A5C00" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <AdminTopbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      
      <AdminSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="relative mt-16 flex-1 w-full p-4 md:mt-0 md:ml-64 md:p-8 overflow-x-hidden" style={{ zIndex: 1 }}>
        <div className="mx-auto w-full max-w-6xl animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
