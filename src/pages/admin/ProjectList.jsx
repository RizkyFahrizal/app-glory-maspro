import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Building2, MapPin, Eye } from 'lucide-react'
import RoleNotice from '../../components/admin/RoleNotice'

// Dummy Data
const dummyProjects = [
  {
    id: 1,
    name: 'PT Lentera / Samesta Mahata Serpong',
    location: 'BSD Serpong, Tangerang',
    driveLink: 'https://drive.google.com/drive/folders/dummy1',
    clustersCount: 2,
    promosCount: 2
  },
  {
    id: 2,
    name: 'PT Kahuripan',
    location: 'Surabaya Barat, Jawa Timur',
    driveLink: 'https://drive.google.com/drive/folders/dummy2',
    clustersCount: 0,
    promosCount: 0
  }
]

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const isMarketing = userData.role?.toLowerCase() === 'marketing'

  useEffect(() => {
    // Simulasi fetch
    setTimeout(() => {
      setProjects(dummyProjects)
      setLoading(false)
    }, 500)
  }, [])

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  )

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
        
        {/* Search */}
        <div className="mb-6 flex items-center gap-4 border-b border-[rgba(0,0,0,0.06)] pb-6">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-soft" />
            <input
              type="text"
              placeholder="Cari proyek..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-minimal w-full rounded-2xl py-3 pl-12 pr-4 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#4B5563]">
            <thead className="bg-[#F9FAFB] text-xs uppercase text-soft">
              <tr>
                <th className="rounded-l-2xl px-6 py-4 font-semibold">Nama Proyek</th>
                <th className="px-6 py-4 font-semibold">Lokasi</th>
                <th className="px-6 py-4 font-semibold">Media Promosi</th>
                <th className="px-6 py-4 font-semibold text-center">Klaster / Promo</th>
                <th className="rounded-r-2xl px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-soft">
                    <div className="animate-pulse">Memuat data proyek...</div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-200" />
                    <p className="text-soft">Tidak ada proyek yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-50 transition hover:bg-[#F9FAFB]/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#1F2937]">{project.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-soft">
                        <MapPin className="h-4 w-4" /> {project.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a href={project.driveLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs bg-blue-50 px-3 py-1.5 rounded-full inline-block">
                        Buka Drive
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium mr-2">
                        {project.clustersCount} Klaster
                      </span>
                      <span className="bg-[#D4AF37]/10 text-[#B8860B] px-2 py-1 rounded-lg text-xs font-medium">
                        {project.promosCount} Promo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
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

      </div>
    </div>
  )
}
