import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import logoHero from '../../assets/public/logo-glory-maspro.webp'
import ProductCard from '../../components/public/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products')
        if (response.data && response.data.success) {
          setProducts(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(products.length / itemsPerPage)

  return (
    <>
      {/* Hero Section */}
      <div className="relative mb-6 overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.3)]"
        style={{
          background: 'rgba(252, 250, 245, 0.7)',
          boxShadow: '0 0 0 1px rgba(212,175,55,0.1), 0 8px 40px rgba(184,134,11,0.1), inset 0 1px 0 rgba(212,175,55,0.2)'
        }}
      >
        {/* Gold glow corners */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#D4AF37]/8 blur-3xl" />

        <div className="relative flex items-stretch min-h-[280px] md:min-h-[320px]">
          {/* LEFT: Text content — flush left, padded */}
          <div className="flex flex-1 flex-col justify-center px-7 py-8 md:px-10 md:py-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
              Katalog Properti Premium
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.15] text-[#1F2937] md:text-5xl lg:text-6xl">
              Satu <span className="text-[#B8860B]">Tempat</span> <br />
              Banyak <span className="text-[#B8860B]">Pilihan</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-soft">
              Tentukan pilihan property mu yang tepat hanya di Glory Maspro. Kami menyediakan kurasi terbaik untuk gaya hidup Anda.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#D4AF37]/40 px-4 py-1.5 text-xs font-semibold text-[#B8860B]">Rumah KPR</span>
              <span className="rounded-full border border-[#D4AF37]/40 px-4 py-1.5 text-xs font-semibold text-[#B8860B]">Murah</span>
              <span className="rounded-full border border-[#D4AF37]/40 px-4 py-1.5 text-xs font-semibold text-[#B8860B]">Nyaman</span>
            </div>
          </div>

          {/* RIGHT: Logo fills the right column, no extra wrapper box */}
          <div className="hidden md:flex w-[40%] items-center justify-center relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-l from-[#D4AF37]/5 to-transparent" />
            <div className="absolute inset-0 -m-4 rounded-full bg-[#D4AF37]/8 blur-3xl" />
            <img
              src={logoHero}
              alt="Hero Properti"
              className="relative h-full w-full max-h-[320px] object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105 p-6"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel mb-9 flex flex-col rounded-[1.75rem] p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B8860B]" />
            <input
              type="text"
              placeholder="Cari lokasi atau nama perumahan..."
              className="input-minimal w-full rounded-2xl py-3 pl-12 pr-4 transition shadow-sm"
            />
          </div>
          <button className="btn-gold rounded-2xl px-8 py-3 transition">
            Cari
          </button>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition ${isFilterOpen ? 'bg-[#D4AF37] text-white shadow-md' : 'btn-ghost'}`}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </button>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${isFilterOpen ? 'mt-6 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
            }`}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 gap-6 border-t border-[rgba(0,0,0,0.06)] pt-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Tipe Properti</label>
                <select className="input-minimal w-full rounded-xl py-2.5 px-3">
                  <option value="">Semua Tipe</option>
                  <option value="Rumah">Rumah</option>
                  <option value="Apartemen">Apartemen</option>
                  <option value="Ruko">Ruko</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Tidur</label>
                <select className="input-minimal w-full rounded-xl py-2.5 px-3">
                  <option value="">Semua</option>
                  <option value="1">1+ Kamar</option>
                  <option value="2">2+ Kamar</option>
                  <option value="3">3+ Kamar</option>
                  <option value="4">4+ Kamar</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Mandi</label>
                <select className="input-minimal w-full rounded-xl py-2.5 px-3">
                  <option value="">Semua</option>
                  <option value="1">1+ Kamar</option>
                  <option value="2">2+ Kamar</option>
                  <option value="3">3+ Kamar</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Range Harga</label>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Min" className="input-minimal w-full rounded-xl py-2.5 px-3" />
                  <span className="text-soft">-</span>
                  <input type="text" placeholder="Max" className="input-minimal w-full rounded-xl py-2.5 px-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mb-8 flex items-end justify-between p-5 md:p-6">
        <div>
          <p className="section-label">Katalog</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#F5F2EA] md:text-3xl">
            Katalog Properti Terbaru
          </h2>
        </div>
      </div> */}

      {loading ? (
        <div className="mt-20 mb-40 text-center text-lg font-medium text-[#B8860B]">
          Sedang memuat data properti eksklusif...
        </div>
      ) : (
        <>
          <div key={currentPage} className="animate-fade-in grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((product) => (
              // Panggil komponen ProductCard dan lemparkan data product-nya via props
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 mb-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${currentPage === 1 ? 'cursor-not-allowed border border-[rgba(0,0,0,0.06)] bg-[#F9FAFB] text-[rgba(0,0,0,0.3)]' : 'btn-gold'}`}
              >
                <ArrowLeft className="h-4 w-4" /> Prev
              </button>

              <span className="rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2 text-sm font-semibold text-[#1F2937] shadow-sm">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${currentPage === totalPages ? 'cursor-not-allowed border border-[rgba(0,0,0,0.06)] bg-[#F9FAFB] text-[rgba(0,0,0,0.3)]' : 'btn-gold'}`}
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}