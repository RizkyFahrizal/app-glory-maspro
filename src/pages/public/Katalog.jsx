import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ProductCard from '../../components/public/ProductCard'
import HeroSection from '../../components/public/HeroSection'
import FilterBar from '../../components/public/FilterBar'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchX } from 'lucide-react'

export default function Katalog() {
  const [products, setProducts] = useState([])
  const [locations, setLocations] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [propertyTypes, setPropertyTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    project_id: '',
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
    fetchProjects()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [filters.search, filters.project_id, filters.location])


  const fetchLocations = async () => {
    try {
      const res = await api.get('/products/locations')
      if (res.data && res.data.success) {
        setLocations(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      if (res.data && res.data.data) {
        setAllProjects(res.data.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchPropertyTypes = async () => {
    try {
      const res = await api.get('/products/types')
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

      const response = await api.get('/products', {
        params: {
          search: filters.search || undefined,
          project_id: filters.project_id || undefined,
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

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      start = 1;
      end = 5;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - 4;
      end = totalPages;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-7xl px-6 pt-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <FilterBar
        filters={filters}
        locations={locations}
        propertyTypes={propertyTypes}
        allProjects={allProjects}
        isFilterOpen={isFilterOpen}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        onClearFilter={() => setFilters({
          search: '', project_id: '', location: '', property_type: '', bedrooms: '', bathrooms: '',
          min_price: '', max_price: '', min_price_unit: 'JT', max_price_unit: 'JT'
        })}
        setFilters={setFilters}
      />

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
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1.5">
                {getPageNumbers().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-medium transition ${
                      currentPage === page
                        ? 'text-[#D4AF37] font-bold'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}