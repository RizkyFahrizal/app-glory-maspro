import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Building2, MapPin, Eye, ChevronDown, X, Map } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import RoleNotice from '../../components/admin/RoleNotice'
import api from '../../utils/api'



export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('Semua Lokasi')
  const [regionFilter, setRegionFilter] = useState('Semua Daerah')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false)

  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const isMarketing = userData.role?.toLowerCase() === 'marketing'

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await api.get('/projects')
      if (res.data && res.data.data) {
        setProjects(res.data.data)
      } else {
        setProjects(Array.isArray(res.data) ? res.data : [])
      }
    } catch (err) {
      console.error('Failed to fetch projects', err)
      alert('Gagal mengambil data proyek.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus proyek ini? Semua data terkait (termasuk produk) akan ikut terhapus atau kehilangan relasi.')) {
      try {
        await api.delete(`/projects/${id}`)
        fetchProjects() // Refresh data
      } catch (err) {
        console.error('Failed to delete project', err)
        alert('Gagal menghapus proyek.')
      }
    }
  }

  const filteredProjects = projects.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(search.toLowerCase()) || 
                          (p.location || '').toLowerCase().includes(search.toLowerCase())
    
    const matchesLocation = locationFilter === 'Semua Lokasi' || locationFilter === '' || p.location === locationFilter;
    const matchesRegion = regionFilter === 'Semua Daerah' || regionFilter === '' || p.region === regionFilter;
    
    return matchesSearch && matchesLocation && matchesRegion;
  })

  const uniqueLocations = ['Semua Lokasi', ...new Set(projects.map(p => p.location).filter(Boolean))]
  const availableRegions = locationFilter === 'Semua Lokasi' || locationFilter === ''
    ? projects.map(p => p.region).filter(Boolean)
    : projects.filter(p => p.location === locationFilter).map(p => p.region).filter(Boolean)
  const uniqueRegions = ['Semua Daerah', ...new Set(availableRegions)]

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Kelola Proyek</h1>
          <p className="mt-2 text-sm text-soft">
            Atur halaman utama (*landing page*), fasilitas, dan klaster untuk setiap proyek.
          </p>
        </div>
        {!isMarketing && (
          <Link
            to="/admin/projects/create"
            className="btn-gold inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold transition sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Tambah Proyek
          </Link>
        )}
      </div>

      {isMarketing && (
        <RoleNotice message="Role Marketing hanya dapat melihat data proyek. Tambah, ubah, dan hapus proyek hanya bisa dilakukan oleh Admin." />
      )}

      <div className={`rounded-3xl bg-white p-6 shadow-sm border border-[rgba(0,0,0,0.06)] ${isMarketing ? 'mt-8' : ''}`}>
        
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 border-b border-[rgba(0,0,0,0.06)] pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full flex-1 mr-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari proyek..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="input-minimal w-full rounded-2xl py-3 pl-12 pr-10 text-sm font-semibold bg-white border border-[rgba(0,0,0,0.1)] shadow-sm focus:border-[#D4AF37]"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch('')
                    setCurrentPage(1)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Location Filter */}
            <div className="relative w-full sm:w-[240px]">
              <button
                onClick={() => {
                  setIsLocationDropdownOpen(!isLocationDropdownOpen)
                  setIsRegionDropdownOpen(false)
                }}
                className="w-full flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white py-3 pl-4 pr-4 text-sm font-semibold text-[#1F2937] shadow-sm transition hover:border-[#D4AF37] focus:border-[#D4AF37]"
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
                      setRegionFilter('Semua Daerah')
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
                    {uniqueLocations.map((loc, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setLocationFilter(loc)
                          setRegionFilter('Semua Daerah')
                          setIsLocationDropdownOpen(false)
                          setCurrentPage(1)
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

            {/* Region Filter */}
            <div className="relative w-full sm:w-[240px]">
              <button
                onClick={() => {
                  setIsRegionDropdownOpen(!isRegionDropdownOpen)
                  setIsLocationDropdownOpen(false)
                }}
                className="w-full flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white py-3 pl-4 pr-4 text-sm font-semibold text-[#1F2937] shadow-sm transition hover:border-[#D4AF37] focus:border-[#D4AF37]"
              >
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-gray-400" />
                  <span>{regionFilter === '' ? 'Semua Daerah' : regionFilter}</span>
                </div>
                {regionFilter !== 'Semua Daerah' && regionFilter !== '' ? (
                  <X
                    className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors ml-auto mr-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setRegionFilter('Semua Daerah')
                      setCurrentPage(1)
                    }}
                  />
                ) : null}
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isRegionDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-50 mt-2 w-full rounded-xl bg-white py-2 shadow-xl border border-[rgba(0,0,0,0.05)] max-h-60 overflow-y-auto"
                  >
                    {uniqueRegions.map((region, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setRegionFilter(region)
                          setIsRegionDropdownOpen(false)
                          setCurrentPage(1)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${regionFilter === region
                          ? 'bg-[#D4AF37]/10 text-[#B8860B] font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        {region}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="text-sm font-medium text-[#B8860B] shrink-0">Total: {filteredProjects.length} Data</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#4B5563]">
            <thead className="bg-[#F9FAFB] text-xs uppercase text-soft">
              <tr>
                <th className="rounded-l-2xl px-4 py-4 font-semibold w-12 text-center">No</th>
                <th className="px-4 py-4 font-semibold min-w-[280px]">Nama Proyek</th>
                <th className="px-4 py-4 font-semibold min-w-[180px]">Lokasi</th>
                <th className="px-4 py-4 font-semibold min-w-[150px]">Media Promosi</th>
                <th className="rounded-r-2xl px-4 py-4 font-semibold text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-soft">
                    <div className="animate-pulse">Memuat data proyek...</div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-200" />
                    <p className="text-soft">Tidak ada proyek yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                currentProjects.map((project, index) => (
                  <tr key={project.id} className="border-b border-gray-50 transition hover:bg-[#F9FAFB]/50">
                    <td className="px-4 py-4 text-center font-medium text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={project.header_image ? (project.header_image.startsWith('http') ? project.header_image : `http://127.0.0.1:8000/storage/${project.header_image}`) : '/herobg.webp'}
                          alt={project.title}
                          className="h-16 w-24 rounded-xl object-cover border border-[rgba(0,0,0,0.1)] shadow-sm bg-gray-100"
                        />
                        <div className="font-semibold text-[#1F2937]">{project.title}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-soft font-medium">
                        <MapPin className="h-4 w-4 text-[#D4AF37]" /> 
                        {project.location ? `${project.location} - ${project.region || '-'}` : '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {project.drive_link ? (
                        <a href={project.drive_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs bg-blue-50 px-3 py-1.5 rounded-full inline-block">
                          Buka Drive
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Tidak ada link</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/projects/view/${project.id}`}
                          className="rounded-xl bg-blue-50 p-2 text-blue-400 transition hover:bg-blue-100 hover:text-blue-600"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {!isMarketing && (
                          <>
                            <Link
                              to={`/admin/projects/edit/${project.id}`}
                              className="rounded-xl bg-gray-50 p-2 text-soft transition hover:bg-gray-200 hover:text-[#1F2937]"
                              title="Edit Proyek"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="rounded-xl bg-red-50 p-2 text-red-400 transition hover:bg-red-100 hover:text-red-600"
                              title="Hapus Proyek"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredProjects.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-[rgba(0,0,0,0.06)] pt-6 text-sm text-soft">
            <div>
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredProjects.length)} dari {filteredProjects.length} data
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
    </div>
  )
}
