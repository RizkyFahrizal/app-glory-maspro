import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'

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
      const res = await axios.post('http://127.0.0.1:8000/api/login', {
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#e9d387] via-[#f9e7a9] to-[#e9d387] p-4 text-[#1F2937]">
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-[#4A3000] transition hover:text-[#2C1A00]">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="section-label">Admin Portal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-widest text-[#2C1A00]">GLORY MASPRO</h1>
          <p className="mt-3 text-sm text-soft">Silakan login untuk mengelola katalog properti Anda.</p>
        </div>

        <div className="card-minimal animate-fade-in rounded-[2rem] p-8">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
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
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Email Admin</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@glorymaspro.com" 
                className="input-minimal w-full rounded-2xl py-3 px-4"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Password</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="input-minimal w-full rounded-2xl py-3 pl-4 pr-12"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-soft">
                <input type="checkbox" className="rounded border-[rgba(245,242,234,0.08)] bg-[rgba(245,242,234,0.03)] accent-[#C9AA4A]" />
                Ingat Saya
              </label>
              <a href="#" className="text-[#4A3000] font-medium transition hover:text-[#2C1A00] hover:underline">Lupa Password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-gold mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold transition disabled:opacity-70"
            >
              <Lock className="h-4 w-4" /> {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-soft">
          &copy; 2026 Glory Maspro. Restricted Access.
        </p>
      </div>
    </div>
  )
}
