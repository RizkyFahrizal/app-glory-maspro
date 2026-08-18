import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Award, X } from 'lucide-react'
import DeleteModal from '../../components/admin/DeleteModal'
import SuccessModal from '../../components/admin/SuccessModal'
import AlertModal from '../../components/admin/AlertModal'
import api from '../../utils/api'


export default function AwardList() {
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [awardToDelete, setAwardToDelete] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' })

  const fetchAwards = async () => {
    try {
      setLoading(true)
      const res = await api.get('/achievements')
      if (res.data && res.data.data) {
        setAwards(res.data.data)
      } else {
        setAwards(Array.isArray(res.data) ? res.data : [])
      }
    } catch (err) {
      console.error('Failed to fetch achievements', err)
      alert('Gagal mengambil data penghargaan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAwards()
  }, [])

  const handleDeleteClick = (award) => {
    setAwardToDelete(award)
  }

  const confirmDelete = async () => {
    if (!awardToDelete) return

    try {
      await api.delete(`/achievements/${awardToDelete.id}`)
      fetchAwards()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2500)
    } catch (err) {
      console.error('Failed to delete achievement', err)
      setAlertInfo({ isOpen: true, title: 'Gagal', message: 'Terjadi kesalahan saat menghapus penghargaan.' })
    } finally {
      setAwardToDelete(null)
    }
  }

  const filteredAwards = awards.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredAwards.length / itemsPerPage)
  const currentAwards = filteredAwards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Kelola Penghargaan</h1>
          <p className="mt-2 text-sm text-soft">
            Atur daftar pencapaian dan sertifikasi yang akan tampil di Halaman Utama.
          </p>
        </div>
        <Link
          to="/admin/awards/create"
          className="btn-gold inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold transition sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Tambah Penghargaan
        </Link>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-[rgba(0,0,0,0.06)]">
        
        <div className="mb-6 flex flex-col gap-4 border-b border-[rgba(0,0,0,0.06)] pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 mr-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari penghargaan..."
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
          <div className="text-sm font-medium text-[#B8860B] shrink-0">Total: {filteredAwards.length} Data</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#4B5563]">
            <thead className="bg-[#F9FAFB] text-xs uppercase text-soft">
              <tr>
                <th className="rounded-l-2xl px-6 py-4 font-semibold w-24">Foto</th>
                <th className="px-6 py-4 font-semibold">Judul Penghargaan</th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">Deskripsi Singkat</th>
                <th className="rounded-r-2xl px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-soft">
                    <div className="animate-pulse">Memuat data...</div>
                  </td>
                </tr>
              ) : filteredAwards.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Award className="mx-auto mb-4 h-12 w-12 text-gray-200" />
                    <p className="text-soft">Tidak ada penghargaan yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                currentAwards.map((award) => (
                  <tr key={award.id} className="border-b border-gray-50 transition hover:bg-[#F9FAFB]/50">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-100">
                        <img 
                          src={award.image ? (award.image.startsWith('http') ? award.image : `https://api.glorymaspro.com/storage/${award.image}`) : 'https://via.placeholder.com/150'} 
                          alt={award.title} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#1F2937]">{award.title}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-soft line-clamp-1 max-w-sm">{award.description}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/awards/edit/${award.id}`}
                          className="rounded-xl bg-gray-50 p-2 text-soft transition hover:bg-gray-200 hover:text-[#1F2937]"
                          title="Edit Penghargaan"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(award)}
                          className="rounded-xl bg-red-50 p-2 text-red-400 transition hover:bg-red-100 hover:text-red-600"
                          title="Hapus Penghargaan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredAwards.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-[rgba(0,0,0,0.06)] pt-6 text-sm text-soft">
            <div>
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAwards.length)} dari {filteredAwards.length} data
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
        isOpen={!!awardToDelete}
        itemName={awardToDelete?.title}
        onCancel={() => setAwardToDelete(null)}
        onConfirm={confirmDelete}
      />

      <SuccessModal
        isOpen={showSuccess}
        title="Berhasil Dihapus"
        message="Data penghargaan telah dihapus."
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
