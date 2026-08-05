import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Award } from 'lucide-react'

// Dummy Data
const dummyAwards = [
  {
    id: 1,
    title: 'Top Agent 2025',
    description: 'Penghargaan agen penjualan dengan volume transaksi tertinggi di wilayah Jawa Timur.',
    image: 'https://images.unsplash.com/photo-1574607383471-5c744155b9e5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Sold Out Tercepat',
    description: 'Berhasil menjual habis 3 klaster perumahan hanya dalam waktu 6 bulan.',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'Pelayanan Terbaik',
    description: 'Tingkat kepuasan klien 99% dari tahap konsultasi hingga proses akad kredit KPR.',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800'
  }
]

export default function AwardList() {
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setAwards(dummyAwards)
      setLoading(false)
    }, 500)
  }, [])

  const filteredAwards = awards.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  )

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
        
        <div className="mb-6 flex items-center gap-4 border-b border-[rgba(0,0,0,0.06)] pb-6">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-soft" />
            <input
              type="text"
              placeholder="Cari penghargaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-minimal w-full rounded-2xl py-3 pl-12 pr-4 text-sm"
            />
          </div>
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
                filteredAwards.map((award) => (
                  <tr key={award.id} className="border-b border-gray-50 transition hover:bg-[#F9FAFB]/50">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-100">
                        <img src={award.image} alt={award.title} className="h-full w-full object-cover" />
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

      </div>
    </div>
  )
}
