import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import AdminTopbar from '../components/admin/AdminTopbar'
import AdminSidebar from '../components/admin/AdminSidebar'

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    const verifyToken = async () => {
      try {
        await axios.get('https://api.glorymaspro.biz.id/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsChecking(false)
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/admin/login')
        } else {
          console.error("Token verification error:", error)
          setIsChecking(false) // Lanjut saja jika error server (misal 500 SQLite lock)
        }
      }
    }

    verifyToken()
  }, [navigate])

  if (isChecking) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7]">Loading...</div>
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#e9d387] via-[#f9e7a9] to-[#e9d387] text-[#1F2937]">
      {/* Decorative background layer matching public side */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {/* White and soft gold gradient blobs for depth */}
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)' }} />
        <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(253,245,211,0.6) 0%, rgba(253,245,211,0) 70%)' }} />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)' }} />
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#B8860B" />
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
        <div
          key={location.pathname}
          className="mx-auto w-full max-w-6xl animate-fade-in"
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}
