import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, MapPin, X } from 'lucide-react'
import logoHero from '../../assets/public/logo-glory-maspro.webp'
import ProductCard from '../../components/public/ProductCard'
import CustomSelect from '../../components/public/CustomSelect'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchX } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState([])
  const [locations, setLocations] = useState([])
  const [propertyTypes, setPropertyTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    min_price: '',
    max_price: '',
    min_price_unit: 'JT',
    max_price_unit: 'JT'
  })

  useEffect(() => {
    fetchLocations()
    fetchPropertyTypes()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [filters.search])


  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/products/locations')
      if (res.data && res.data.success) {
        setLocations(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error)
    }
  }

  const fetchPropertyTypes = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/products/types')
      if (res.data && res.data.success) {
        setPropertyTypes(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch property types:', error)
    }
  }

  const getMultiplier = (unit) => unit === 'M' ? 1000000000 : 1000000;

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const minP = filters.min_price ? Number(filters.min_price) * getMultiplier(filters.min_price_unit) : undefined;
      const maxP = filters.max_price ? Number(filters.max_price) * getMultiplier(filters.max_price_unit) : undefined;

      const response = await axios.get('http://127.0.0.1:8000/api/products', {
        params: {
          search: filters.search || undefined,
          location: filters.location || undefined,
          property_type: filters.property_type || undefined,
          bedrooms: filters.bedrooms || undefined,
          bathrooms: filters.bathrooms || undefined,
          min_price: minP,
          max_price: maxP
        }
      })
      if (response.data && response.data.success) {
        setProducts(response.data.data)
        setCurrentPage(1) // Reset to first page on search
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchProducts()
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(products.length / itemsPerPage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
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
              Katalog Properti KPR
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
            <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#8B6508]" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Cari nama perumahan atau kata kunci..."
              className="input-minimal w-full rounded-2xl py-3 pl-12 pr-12 transition shadow-sm"
            />
            {filters.search && (
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, search: '' }));
                  // Optional: if you want to trigger search immediately when cleared, 
                  // but we'll wait for user to click Cari or just clear it.
                }}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-soft hover:text-[#8B6508]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <CustomSelect
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Semua Lokasi"
            icon={MapPin}
            options={[
              { label: "Semua Lokasi", value: "" },
              ...locations.map(loc => ({ label: loc, value: loc }))
            ]}
            className="md:w-64"
          />

          <button onClick={handleSearch} className="btn-gold rounded-2xl px-8 py-3 transition">
            Cari
          </button>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold transition ${isFilterOpen ? 'bg-[#D4AF37] text-white shadow-md' : 'btn-ghost'}`}
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
                <CustomSelect
                  name="property_type"
                  value={filters.property_type}
                  onChange={handleFilterChange}
                  placeholder="Semua Tipe"
                  options={[
                    { label: "Semua Tipe", value: "" },
                    ...propertyTypes.map(type => ({ label: type, value: type }))
                  ]}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Tidur</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    placeholder="Jumlah kamar..."
                    className="input-minimal w-full rounded-xl py-2.5 px-3 pr-8"
                  />
                  {filters.bedrooms && (
                    <button type="button" onClick={() => setFilters(prev => ({ ...prev, bedrooms: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8860B]">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Mandi</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    name="bathrooms"
                    value={filters.bathrooms}
                    onChange={handleFilterChange}
                    placeholder="Jumlah kamar..."
                    className="input-minimal w-full rounded-xl py-2.5 px-3 pr-8"
                  />
                  {filters.bathrooms && (
                    <button type="button" onClick={() => setFilters(prev => ({ ...prev, bathrooms: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8860B]">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Range Harga</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex flex-1">
                    <input type="number" min="0" name="min_price" value={filters.min_price} onChange={handleFilterChange} placeholder="Min" className="input-minimal w-full rounded-xl py-2.5 pl-3 pr-16" />
                    {filters.min_price && (
                      <button type="button" onClick={() => setFilters(prev => ({ ...prev, min_price: '' }))} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8860B] z-10">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <select name="min_price_unit" value={filters.min_price_unit} onChange={handleFilterChange} className="absolute right-0 top-0 bottom-0 rounded-r-xl bg-transparent px-2 text-xs font-semibold text-[#8B6508] appearance-none focus:outline-none cursor-pointer border-l border-[rgba(212,175,55,0.2)]">
                      <option value="JT">JT</option>
                      <option value="M">M</option>
                    </select>
                  </div>
                  <span className="text-soft">-</span>
                  <div className="relative flex flex-1">
                    <input type="number" min="0" name="max_price" value={filters.max_price} onChange={handleFilterChange} placeholder="Max" className="input-minimal w-full rounded-xl py-2.5 pl-3 pr-16" />
                    {filters.max_price && (
                      <button type="button" onClick={() => setFilters(prev => ({ ...prev, max_price: '' }))} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8860B] z-10">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <select name="max_price_unit" value={filters.max_price_unit} onChange={handleFilterChange} className="absolute right-0 top-0 bottom-0 rounded-r-xl bg-transparent px-2 text-xs font-semibold text-[#8B6508] appearance-none focus:outline-none cursor-pointer border-l border-[rgba(212,175,55,0.2)]">
                      <option value="JT">JT</option>
                      <option value="M">M</option>
                    </select>
                  </div>
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
        <div className="mt-20 mb-40 flex flex-col items-center justify-center text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent mb-4"></div>
          <p className="text-lg font-medium text-[#B8860B]">Sedang memuat data properti eksklusif...</p>
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 flex flex-col items-center justify-center text-center p-8 glass-panel rounded-[2rem] border border-[rgba(0,0,0,0.06)]"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#B8860B] mb-5">
            <SearchX className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-[#1F2937]">Properti Tidak Ditemukan</h3>
          <p className="mt-2 max-w-md text-sm text-soft leading-relaxed">
            Maaf, kami tidak dapat menemukan properti yang cocok dengan kriteria pencarian atau filter Anda. Silakan coba sesuaikan kata kunci atau bersihkan beberapa filter.
          </p>
          <button
            onClick={() => {
              setFilters({
                search: '', location: '', property_type: '', bedrooms: '', bathrooms: '',
                min_price: '', max_price: '', min_price_unit: 'JT', max_price_unit: 'JT'
              });
              handleSearch();
            }}
            className="mt-6 btn-gold rounded-full px-6 py-2.5 text-sm font-semibold transition"
          >
            Reset Semua Filter
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {currentItems.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

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
    </motion.div>
  )
}