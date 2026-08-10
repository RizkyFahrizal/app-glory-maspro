import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PackageSearch, Users, LogOut, X, Globe, AlertTriangle, Building2, Trophy } from 'lucide-react'
import { createPortal } from 'react-dom'
import axios from 'axios'

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const userName = userData.name || 'Admin'

  useEffect(() => {
    if (isOpen || showLogoutModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, showLogoutModal])

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/')
    }
  }

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
      <aside className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-64 flex-col transform border-r border-white/40 bg-white/60 p-6 backdrop-blur-xl shadow-lg shadow-[#b8860b]/5 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 shrink-0 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#B8860B] uppercase">Admin Portal</p>
            <h2 className="mt-1 text-xl font-semibold tracking-widest text-[#2C1A00]">GLORY MASPRO</h2>
          </div>
          <button onClick={onClose} className="p-1 text-soft md:hidden hover:text-[#2C1A00]">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto flex flex-col gap-2 relative z-10 pb-4">
          <Link
            to="/admin/dashboard"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${location.pathname === '/admin/dashboard'
              ? 'bg-white text-[#B8860B] shadow-sm ring-1 ring-black/5'
              : 'text-[#6b7280] hover:bg-white/40 hover:text-[#2C1A00]'
              }`}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>

          <Link
            to="/admin/projects"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${location.pathname.includes('/admin/projects')
              ? 'bg-white text-[#B8860B] shadow-sm ring-1 ring-black/5'
              : 'text-[#6b7280] hover:bg-white/40 hover:text-[#2C1A00]'
              }`}
          >
            <Building2 className="h-5 w-5" /> Kelola Proyek
          </Link>

          <Link
            to="/admin/products"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${location.pathname.includes('/admin/products')
              ? 'bg-white text-[#B8860B] shadow-sm ring-1 ring-black/5'
              : 'text-[#6b7280] hover:bg-white/40 hover:text-[#2C1A00]'
              }`}
          >
            <PackageSearch className="h-5 w-5" /> Kelola Properti
          </Link>

          {userData.role !== 'marketing' && (
            <Link
              to="/admin/awards"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${location.pathname.includes('/admin/awards')
                ? 'bg-white text-[#B8860B] shadow-sm ring-1 ring-black/5'
                : 'text-[#6b7280] hover:bg-white/40 hover:text-[#2C1A00]'
                }`}
            >
              <Trophy className="h-5 w-5" /> Kelola Penghargaan
            </Link>
          )}

          {userData.role !== 'marketing' ? (
            <Link
              to="/admin/accounts"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${location.pathname.includes('/admin/accounts') && !location.pathname.includes('/edit/')
                ? 'bg-white text-[#B8860B] shadow-sm ring-1 ring-black/5'
                : 'text-[#6b7280] hover:bg-white/40 hover:text-[#2C1A00]'
                }`}
            >
              <Users className="h-5 w-5" /> Kelola Akun
            </Link>
          ) : (
            <Link
              to={`/admin/accounts/edit/${userData.id || 1}`}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${location.pathname.includes('/admin/accounts/edit/')
                ? 'bg-white text-[#B8860B] shadow-sm ring-1 ring-black/5'
                : 'text-[#6b7280] hover:bg-white/40 hover:text-[#2C1A00]'
                }`}
            >
              <Users className="h-5 w-5" /> Profil Saya
            </Link>
          )}
        </nav>

        <div className="mt-auto shrink-0 pt-4 border-t border-[rgba(0,0,0,0.06)]">
          <Link
            to="/"
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#B8860B] transition hover:bg-[#D4AF37]/10"
          >
            <Globe className="h-5 w-5" /> Kembali ke Website
          </Link>
          <button
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-400/10 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
          <p className="mt-4 text-center text-[10px] text-soft opacity-70">
            Jangan lupa logout jika sudah tidak<br />menggunakan portal admin.
          </p>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-[2rem] p-8 text-center border border-[rgba(0,0,0,0.06)] bg-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
              <LogOut className="h-8 w-8 ml-1" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937]">Konfirmasi Logout</h3>
            <p className="mt-2 text-sm text-soft">
              Apakah <strong>{userName}</strong> yakin ingin keluar dari portal admin? Anda harus login kembali untuk masuk.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-2xl px-6 py-3 text-sm font-medium text-soft transition hover:text-[#1F2937]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="rounded-2xl bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
