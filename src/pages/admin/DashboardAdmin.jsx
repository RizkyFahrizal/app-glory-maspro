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
    { name: 'Tersedia', value: totalAvailable, color: '#D4AF37' },
    { name: 'Terjual/Tersewa', value: totalSold, color: '#9CA3AF' }
  ]

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
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
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
            alt="Viorenza" 
            className="h-11 w-11 rounded-full border-2 border-[#D4AF37] object-cover" 
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-[#1F2937]">Hai, Viorenza</p>
            <p className="text-xs text-[#B8860B]">Admin Marketing</p>
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
              <p className="text-xs font-semibold tracking-wider text-soft uppercase">Properti Terjual</p>
              <h3 className="mt-1 text-2xl font-bold text-[#1F2937]">{totalSold} Unit</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-panel rounded-3xl p-6 border border-[rgba(0,0,0,0.06)] bg-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B]">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-soft uppercase">Total Nilai (Tersedia)</p>
              <h3 className="mt-1 text-xl font-bold text-[#1F2937]">{formatRupiah(totalValue)}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="mt-8 glass-panel rounded-3xl p-8 border border-[rgba(0,0,0,0.06)] bg-white">
        <h3 className="mb-6 text-lg font-semibold tracking-wide text-[#1F2937]">Grafik Ketersediaan Properti</h3>
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
  )
}
