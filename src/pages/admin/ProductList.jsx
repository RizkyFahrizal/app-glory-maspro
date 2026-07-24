import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, X, Eye } from 'lucide-react'
import axios from 'axios'
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
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' })

  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const isMarketing = userData.role?.toLowerCase() === 'marketing'
  const location = useLocation()
  const wasRedirected = location.state?.restricted

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://127.0.0.1:8000/api/products')
      if (res.data && res.data.success) {
        setProducts(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

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
      const token = localStorage.getItem('token') || ''
      const res = await axios.delete(`http://127.0.0.1:8000/api/products/${productToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data && res.data.success) {
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

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.listing_id.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama properti atau ID..."
              className="input-minimal w-full rounded-2xl py-3 pl-12 pr-10 text-sm bg-white border border-[rgba(0,0,0,0.1)] shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="text-sm font-medium text-[#B8860B]">Total: {filteredProducts.length} Data</div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-soft">Memuat data...</div>
          ) : (
            <table className="w-full text-left text-sm text-[#1F2937]">
              <thead className="bg-[#F3F4F6] text-xs uppercase tracking-wider text-soft">
                <tr>
                  <th className="px-6 py-4 font-semibold">Properti</th>
                  <th className="px-6 py-4 font-semibold">Harga & Tipe</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-[#F9FAFB]">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        {(() => {
                          if (!product.images || product.images.length === 0) return (
                            <div className="h-20 w-32 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                          )
                          const coverImg = [...product.images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || (a.image_path.match(/\.(mp4|webm)$/) ? 1 : -1))[0]
                          if (coverImg.image_path.match(/\.(mp4|webm)$/)) {
                            return (
                              <video
                                src={coverImg.image_path}
                                className="h-20 w-32 rounded-xl object-cover border border-[rgba(0,0,0,0.1)] shadow-sm"
                                muted loop playsInline autoPlay
                              />
                            )
                          }
                          return (
                            <img
                              src={coverImg.image_path}
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

        {/* Pagination Dummy */}
        <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] bg-[#F9FAFB] px-6 py-4 text-sm text-soft">
          <div>Menampilkan hasil pencarian</div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-[rgba(0,0,0,0.1)] px-3 py-1 transition hover:bg-white hover:text-[#1F2937]" disabled>Prev</button>
            <button className="rounded-lg bg-[#D4AF37]/10 px-3 py-1 text-[#B8860B]">1</button>
            <button className="rounded-lg border border-[rgba(0,0,0,0.1)] px-3 py-1 transition hover:bg-white hover:text-[#1F2937]" disabled>Next</button>
          </div>
        </div>
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
