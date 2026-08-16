import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../../utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already logged in, redirect them to dashboard
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/admin/dashboard')
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/login', {
        email,
        password
      })

      if (res.data && res.data.data && res.data.data.token) {
        localStorage.setItem('token', res.data.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.data.user))

        setSuccess('Login berhasil! Mengarahkan ke dashboard...')
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1500)
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Terjadi kesalahan. Pastikan email dan password benar.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Image/Brand */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#101010] p-12 lg:flex">
        <div className="absolute inset-0">
          <img src="/herobg.webp" alt="Background" className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-[#D4AF37] transition font-medium">
            <ArrowLeft className="h-5 w-5" /> Kembali ke Beranda
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Kelola Properti Anda<br />dengan <span className="text-[#D4AF37]">Lebih Mudah</span>
          </h2>
          <p className="text-gray-300 max-w-md leading-relaxed">
            Satu tempat, banyak pilihan. Akses dashboard Anda sekarang untuk mengelola katalog perumahan Glory Maspro.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center relative px-6 sm:px-12 lg:w-1/2 lg:px-20 xl:px-32 bg-[#FCFAF5]">
        <div className="absolute left-6 top-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#D4AF37] transition">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <p className="text-sm font-bold tracking-[0.2em] text-[#B8860B] uppercase mb-3">Portal Admin</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-3">Selamat Datang,<br />Sobat Glory! 👋</h1>
            <p className="text-gray-500">Silakan login menggunakan email admin untuk melanjutkan.</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-black/[0.03] border border-[rgba(0,0,0,0.04)] animate-fade-in">
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⚠️</span> {error}
              </div>
            )}
            {success && (
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-100">
                <CheckCircle className="h-5 w-5" />
                {success}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Email Admin</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="glorymaspro@gmail.com"
                  className="input-minimal w-full rounded-2xl py-3.5 px-4 bg-gray-50 focus:bg-white border-gray-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-minimal w-full rounded-2xl py-3.5 pl-4 pr-12 bg-gray-50 focus:bg-white border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <Lock className="h-4 w-4" /> {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-xs font-medium text-gray-400">
            &copy; 2026 Glory Maspro. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </div>
  )
}
