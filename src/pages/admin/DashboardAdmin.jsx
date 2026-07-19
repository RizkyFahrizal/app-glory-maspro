import { dummyProducts } from '../../data/dummyProducts'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Home, CheckCircle, Tag } from 'lucide-react'

export default function DashboardAdmin() {
  const totalProducts = dummyProducts.length
  const availableProducts = dummyProducts.filter(p => p.status === 'Available')
  const soldProducts = dummyProducts.filter(p => p.status === 'Sold')
  
  const totalAvailable = availableProducts.length
  const totalSold = soldProducts.length
  
  const totalValue = availableProducts.reduce((sum, p) => sum + p.price, 0)
  
  const chartData = [
    { name: 'Tersedia', value: totalAvailable, color: '#C9AA4A' },
    { name: 'Terjual/Tersewa', value: totalSold, color: '#8A8A8A' }
  ]

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#F5F2EA]">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-soft">Statistik ringkas dari katalog properti Anda saat ini.</p>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl bg-[rgba(244,211,94,0.03)] p-3 pr-4 border border-[rgba(244,211,94,0.08)]">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
            alt="Viorenza" 
            className="h-11 w-11 rounded-full border-2 border-[#C9AA4A] object-cover" 
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-[#F5F2EA]">Hai, Viorenza</p>
            <p className="text-xs text-[#C9AA4A]">Admin Marketing</p>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6 border border-[rgba(244,211,94,0.08)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(244,211,94,0.08)] text-[#C9AA4A]">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-soft uppercase">Total Properti</p>
              <h3 className="mt-1 text-2xl font-bold text-[#F5F2EA]">{totalProducts} Unit</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-panel rounded-3xl p-6 border border-[rgba(244,211,94,0.08)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(244,211,94,0.08)] text-[#C9AA4A]">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-soft uppercase">Properti Terjual</p>
              <h3 className="mt-1 text-2xl font-bold text-[#F5F2EA]">{totalSold} Unit</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-panel rounded-3xl p-6 border border-[rgba(244,211,94,0.08)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(244,211,94,0.08)] text-[#C9AA4A]">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-soft uppercase">Total Nilai (Tersedia)</p>
              <h3 className="mt-1 text-xl font-bold text-[#F5F2EA]">{formatRupiah(totalValue)}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="mt-8 glass-panel rounded-3xl p-8 border border-[rgba(244,211,94,0.08)]">
        <h3 className="mb-6 text-lg font-semibold tracking-wide text-[#F5F2EA]">Grafik Ketersediaan Properti</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#101010', borderColor: 'rgba(244,211,94,0.12)', borderRadius: '12px', color: '#F5F2EA' }}
                itemStyle={{ color: '#F5F2EA', fontSize: '14px', fontWeight: '500' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ color: '#a0a0a0', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
