import { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Home, CheckCircle, Users } from 'lucide-react'

export default function DashboardAdmin() {
  const [products, setProducts] = useState([])
  const [marketingCount, setMarketingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const userName = userData.name || 'Admin'
  const userRole = userData.role === 'admin' ? 'Super Admin' : 'Admin Marketing'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || ''
        const [productsRes, accountsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/products'),
          axios.get('http://127.0.0.1:8000/api/accounts', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { success: false, data: [] } }))
        ])
        
        if (productsRes.data && productsRes.data.success) {
          setProducts(productsRes.data.data)
        }
        
        if (accountsRes.data && accountsRes.data.success) {
          const mkt = accountsRes.data.data.filter(u => u.role?.toLowerCase() === 'marketing')
          setMarketingCount(mkt.length)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalProducts = products.length
  const availableProducts = products.filter(p => p.status?.toLowerCase() === 'available')
  const totalAvailable = availableProducts.length
  
  const locationCount = {}
  products.forEach(p => {
    const loc = p.location || 'Lainnya'
    locationCount[loc] = (locationCount[loc] || 0) + 1
  })
  const locationColors = ['#D4AF37', '#2C3E50', '#8B6508', '#F39C12', '#7F8C8D', '#16A085', '#E67E22', '#9B59B6', '#34495E']
  const locationChartData = Object.entries(locationCount).map(([name, value], idx) => ({
    name, value, color: locationColors[idx % locationColors.length]
  }))

  const typeCount = {}
  products.forEach(p => {
    const t = p.property_type || 'Lainnya'
    typeCount[t] = (typeCount[t] || 0) + 1
  })
  const typeColors = ['#2980B9', '#8E44AD', '#16A085', '#E67E22', '#BDC3C7', '#C0392B', '#D35400', '#F1C40F']
  const typeChartData = Object.entries(typeCount).map(([name, value], idx) => ({
    name, value, color: typeColors[idx % typeColors.length]
  }))

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  if (loading) {
    return <div className="p-8 text-center text-soft">Memuat dashboard...</div>
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-soft">Statistik ringkas dari katalog properti Anda saat ini.</p>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl bg-white p-3 pr-4 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <img 
            src={userData.photo ? `http://127.0.0.1:8000/storage/${userData.photo}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=D4AF37&color=fff&bold=true`}
            alt={userName} 
            className="h-11 w-11 rounded-full border-2 border-[#D4AF37] object-cover" 
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-[#1F2937]">Hai, {userName}</p>
            <p className="text-xs text-[#B8860B] capitalize">{userRole}</p>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6 border border-[rgba(0,0,0,0.06)] bg-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B]">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-soft uppercase">Total Properti</p>
              <h3 className="mt-1 text-2xl font-bold text-[#1F2937]">{totalProducts} Unit</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-panel rounded-3xl p-6 border border-[rgba(0,0,0,0.06)] bg-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B]">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-soft uppercase">Properti Tersedia</p>
              <h3 className="mt-1 text-2xl font-bold text-[#1F2937]">{totalAvailable} Unit</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-panel rounded-3xl p-6 border border-[rgba(0,0,0,0.06)] bg-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B]">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-soft uppercase">Total Tim Marketing</p>
              <h3 className="mt-1 text-2xl font-bold text-[#1F2937]">{marketingCount} Orang</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-8 border border-[rgba(0,0,0,0.06)] bg-white flex flex-col">
          <h3 className="mb-6 text-lg font-semibold tracking-wide text-[#1F2937]">Distribusi Berdasarkan Lokasi</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={locationChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {locationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '12px', color: '#1F2937' }}
                  itemStyle={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ color: '#4B5563', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-[rgba(0,0,0,0.06)] bg-white flex flex-col">
          <h3 className="mb-6 text-lg font-semibold tracking-wide text-[#1F2937]">Distribusi Berdasarkan Tipe</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '12px', color: '#1F2937' }}
                  itemStyle={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ color: '#4B5563', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
