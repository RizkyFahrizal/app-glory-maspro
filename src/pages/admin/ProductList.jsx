import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Search, X, Eye, MapPin, Building2, ChevronDown } from 'lucide-react'
import api from '../../utils/api'
import DeleteModal from '../../components/admin/DeleteModal'
import SuccessModal from '../../components/admin/SuccessModal'
import AlertModal from '../../components/admin/AlertModal'
import RoleNotice from '../../components/admin/RoleNotice'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('Semua Lokasi')
  const [currentPage, setCurrentPage] = useState(1)

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false)

  const [projects, setProjects] = useState([])
  const itemsPerPage = 10
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' })

  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const isMarketing = userData.role?.toLowerCase() === 'marketing'
  const location = useLocation()
  const wasRedirected = location.state?.restricted

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products')
      if (res.data && res.data.data) {
        setProducts(res.data.data)
      } else {
        setProducts(Array.isArray(res.data) ? res.data : [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      if (res.data && res.data.data) {
        setProjects(res.data.data)
      } else {
        setProjects(Array.isArray(res.data) ? res.data : [])
      }
    } catch (err) {
      console.error('Failed to fetch projects for filter:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchProjects()
  }, [])


  const formatShortPrice = (price) => {
    if (!price) return 'Rp 0'
    if (price >= 1000000000) {
      return `Rp ${(price / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`
    } else if (price >= 1000000) {
      return `Rp ${(price / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`
    }
    return `Rp ${price.toLocaleString('id-ID')}`
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      const res = await api.delete(`/products/${productToDelete.id}`)
      if (res.data) {
        setProducts(products.filter(p => p.id !== productToDelete.id))
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2500)
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      setAlertInfo({ isOpen: true, title: 'Gagal Menghapus', message: error.response?.data?.message || 'Gagal menghapus properti. Coba lagi.' })
    } finally {
      setProductToDelete(null)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.listing_id.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesLocation = true
    if (locationFilter !== '' && locationFilter !== 'Semua Lokasi') {
      const parentProject = projects.find(proj => String(proj.id) === String(p.project_id))
      matchesLocation = parentProject ? parentProject.location === locationFilter : false
    }

    let matchesProject = true
    if (projectFilter !== '' && projectFilter !== 'Semua Proyek') {
      matchesProject = String(p.project_id) === String(projectFilter)
    }

    return matchesSearch && matchesLocation && matchesProject
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Kelola Katalog</h1>
          <p className="mt-2 text-sm text-soft">Manajemen data properti KPR.</p>
        </div>

        {!isMarketing && (
          <Link
            to="/admin/products/create"
            className="btn-gold flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition"
          >
            <Plus className="h-5 w-5" /> Tambah Properti Baru
          </Link>
        )}
      </div>

      {(isMarketing || wasRedirected) && (
        <RoleNotice message="Role Marketing hanya dapat melihat data properti. Tambah, ubah, dan hapus properti hanya bisa dilakukan oleh Admin." />
      )}

      <div className="mt-8 glass-panel overflow-hidden rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-4 border-b border-[rgba(0,0,0,0.06)] bg-[#F9FAFB] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full flex-1 mr-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Cari nama properti atau ID..."
                className="input-minimal w-full rounded-2xl py-3 pl-12 pr-10 text-sm bg-white border border-[rgba(0,0,0,0.1)] shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setCurrentPage(1)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Location Filter */}
              <div className="relative w-full sm:w-[240px]">
                <button
                  onClick={() => {
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                    setIsProjectDropdownOpen(false)
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white py-3.5 pl-4 pr-4 text-sm font-semibold text-[#1F2937] shadow-sm transition hover:border-[#D4AF37] focus:border-[#D4AF37]"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{locationFilter === '' ? 'Semua Lokasi' : locationFilter}</span>
                  </div>
                  {locationFilter !== 'Semua Lokasi' && locationFilter !== '' ? (
                    <X
                      className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors ml-auto mr-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLocationFilter('Semua Lokasi')
                        setProjectFilter('Semua Proyek')
                        setCurrentPage(1)
                      }}
                    />
                  ) : null}
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLocationDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 mt-2 w-full rounded-xl bg-white py-2 shadow-xl border border-[rgba(0,0,0,0.05)] max-h-60 overflow-y-auto"
                    >
                      {['Semua Lokasi', ...new Set(projects.map(p => p.location).filter(Boolean))].map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setLocationFilter(loc)
                            setProjectFilter('Semua Proyek')
                            setCurrentPage(1)
                            setIsLocationDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${locationFilter === loc
                            ? 'bg-[#D4AF37]/10 text-[#B8860B] font-bold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Project Filter */}
              <div className="relative w-full sm:w-[280px]">
                <button
                  onClick={() => {
                    setIsProjectDropdownOpen(!isProjectDropdownOpen)
                    setIsLocationDropdownOpen(false)
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white py-3.5 pl-4 pr-4 text-sm font-semibold text-[#1F2937] shadow-sm transition hover:border-[#D4AF37] focus:border-[#D4AF37]"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">
                      {projectFilter === 'Semua Proyek' || projectFilter === '' ? 'Semua Proyek' :
                       projects.find(p => String(p.id) === String(projectFilter))?.title || 'Semua Proyek'}
                    </span>
                  </div>
                  {projectFilter !== 'Semua Proyek' && projectFilter !== '' ? (
                    <X
                      className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2 mr-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setProjectFilter('Semua Proyek')
                        setCurrentPage(1)
                      }}
                    />
                  ) : null}
                  <ChevronDown className={`h-4 w-4 text-gray-500 shrink-0 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProjectDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 mt-2 w-full rounded-xl bg-white py-2 shadow-xl border border-[rgba(0,0,0,0.05)] max-h-60 overflow-y-auto"
                    >
                      <button
                        onClick={() => {
                          setProjectFilter('Semua Proyek')
                          setCurrentPage(1)
                          setIsProjectDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${projectFilter === 'Semua Proyek' || projectFilter === ''
                          ? 'bg-[#D4AF37]/10 text-[#B8860B] font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        Semua Proyek
                      </button>
                      {projects
                        .filter(p => locationFilter === 'Semua Lokasi' || locationFilter === '' || p.location === locationFilter)
                        .map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setProjectFilter(p.id)
                              setCurrentPage(1)
                              setIsProjectDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${String(projectFilter) === String(p.id)
                              ? 'bg-[#D4AF37]/10 text-[#B8860B] font-bold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                          >
                            {p.title}
                          </button>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="text-sm font-medium text-[#B8860B]">Total: {filteredProducts.length} Data</div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-soft">Memuat data...</div>
          ) : (
            <table className="w-full text-left text-sm text-[#1F2937]">
              <thead className="bg-[#F3F4F6] text-xs uppercase tracking-wider text-soft whitespace-nowrap">
                <tr>
                  <th className="px-6 py-4 font-semibold w-16 text-center">No</th>
                  <th className="px-6 py-4 font-semibold min-w-[320px]">Properti</th>
                  <th className="px-6 py-4 font-semibold min-w-[180px]">Harga & Tipe</th>
                  <th className="px-6 py-4 font-semibold min-w-[120px]">Status</th>
                  <th className="px-6 py-4 text-right font-semibold min-w-[120px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
                {currentProducts.map((product, index) => (
                  <tr key={product.id} className="transition-colors hover:bg-[#F9FAFB]">
                    <td className="px-6 py-6 text-center font-medium text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        {(() => {
                          if (!product.images || product.images.length === 0) return (
                            <div className="h-20 w-32 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                          )
                          const coverImg = [...product.images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || (a.image_path.match(/\.(mp4|webm)$/) ? 1 : -1))[0]
                          const imgUrl = coverImg.image_path.startsWith('http') ? coverImg.image_path : `https://api.glorymaspro.com/storage/${coverImg.image_path}`
                          if (imgUrl.match(/\.(mp4|webm)$/)) {
                            return (
                              <video
                                src={imgUrl}
                                className="h-20 w-32 rounded-xl object-cover border border-[rgba(0,0,0,0.1)] shadow-sm"
                                muted loop playsInline autoPlay
                              />
                            )
                          }
                          return (
                            <img
                              src={imgUrl}
                              alt={product.title}
                              className="h-20 w-32 rounded-xl object-cover border border-[rgba(0,0,0,0.1)] shadow-sm bg-gray-100"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/128x80?text=No+Image";
                              }}
                            />
                          )
                        })()}
                        <div>
                          <div className="text-base font-semibold text-[#1F2937]">{product.title}</div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-soft">
                            <span className="font-mono text-[#D4AF37]">{product.listing_id}</span>
                            <span>•</span>
                            <span>{product.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-medium text-[#B8860B]">
                        {product.price_start === product.price_end
                          ? formatShortPrice(product.price_start)
                          : `${formatShortPrice(product.price_start)} - ${formatShortPrice(product.price_end)}`}
                      </div>
                      <div className="mt-1 text-xs text-soft">{product.property_type} - {product.certificate}</div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${product.status?.toLowerCase() === 'available'
                        ? 'bg-[#E5F5E5] text-[#2E7D32]'
                        : 'bg-red-100 text-red-600'
                        }`}>
                        {product.status?.toLowerCase() === 'available' ? 'Tersedia' : 'Terjual'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/view/${product.id}`}
                          className="rounded-xl p-2 text-soft transition hover:bg-white hover:text-[#4F46E5] hover:shadow-sm"
                          title="Lihat Properti"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {!isMarketing && (
                          <>
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="rounded-xl p-2 text-soft transition hover:bg-white hover:text-[#D4AF37] hover:shadow-sm"
                              title="Edit Properti"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => setProductToDelete(product)}
                              className="rounded-xl p-2 text-soft transition hover:bg-white hover:text-red-500 hover:shadow-sm"
                              title="Hapus Properti"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-soft">
                      Tidak ada data properti ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[rgba(0,0,0,0.06)] bg-[#F9FAFB] px-6 py-4 text-sm text-soft">
            <div>
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} data
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-[rgba(0,0,0,0.1)] px-3 py-1 transition hover:bg-white hover:text-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-3 py-1 transition ${currentPage === page
                      ? 'bg-[#D4AF37]/10 text-[#B8860B] font-medium'
                      : 'border border-[rgba(0,0,0,0.1)] hover:bg-white hover:text-[#1F2937]'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-[rgba(0,0,0,0.1)] px-3 py-1 transition hover:bg-white hover:text-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={!!productToDelete}
        itemName={productToDelete?.title}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />

      <SuccessModal
        isOpen={showSuccess}
        title="Berhasil Dihapus"
        message="Data properti telah dihapus dari katalog."
      />

      <AlertModal
        isOpen={alertInfo.isOpen}
        title={alertInfo.title}
        message={alertInfo.message}
        onOk={() => setAlertInfo({ ...alertInfo, isOpen: false })}
      />
    </div>
  )
}
