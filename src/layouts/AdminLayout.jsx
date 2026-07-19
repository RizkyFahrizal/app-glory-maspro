import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminTopbar from '../components/admin/AdminTopbar'
import AdminSidebar from '../components/admin/AdminSidebar'

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-[#101010]">
      <AdminTopbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      
      <AdminSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="mt-16 flex-1 w-full p-4 md:mt-0 md:ml-64 md:p-8 overflow-x-hidden">
        <div className="mx-auto w-full max-w-6xl animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
