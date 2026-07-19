import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { dummyProducts } from '../../data/dummyProducts'

export default function ProductList() {
  const [productToDelete, setProductToDelete] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  const handleDeleteClick = (title) => {
    setProductToDelete(title)
  }

  const confirmDelete = () => {
    setProductToDelete(null)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2500)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#F5F2EA]">Kelola Katalog</h1>
          <p className="mt-2 text-sm text-soft">Manajemen data properti eksklusif perusahaan.</p>
        </div>
        
        <Link 
          to="/admin/products/create" 
          className="btn-gold flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition"
        >
          <Plus className="h-5 w-5" /> Tambah Properti Baru
        </Link>
      </div>

      <div className="mt-8 glass-panel animate-fade-in overflow-hidden rounded-3xl border border-[rgba(244,211,94,0.08)]">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-4 border-b border-[rgba(244,211,94,0.08)] bg-[#141414] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />
            <input 
              type="text" 
              placeholder="Cari nama properti atau ID..." 
              className="input-minimal w-full rounded-2xl py-2 pl-11 pr-4 text-sm"
            />
          </div>
          <div className="text-sm font-medium text-[#C9AA4A]">Total: {dummyProducts.length} Data</div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#F5F2EA]">
            <thead className="bg-[#0A0A0A] text-xs uppercase tracking-wider text-soft">
              <tr>
                <th className="px-6 py-4 font-semibold">Properti</th>
                <th className="px-6 py-4 font-semibold">Tipe & Status</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(244,211,94,0.05)]">
              {dummyProducts.map((product) => (
                <tr key={product.id} className="transition hover:bg-[rgba(244,211,94,0.02)]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={product.images[0].image_path} 
                        alt={product.title} 
                        className="h-12 w-16 rounded-lg object-cover border border-[rgba(244,211,94,0.1)]"
                      />
                      <div>
                        <p className="font-semibold">{product.title}</p>
                        <p className="mt-1 text-xs text-soft">{product.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{product.property_type}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      product.status === 'Available' 
                        ? 'bg-[#C9AA4A]/10 text-[#C9AA4A]' 
                        : 'bg-[#8A8A8A]/10 text-[#8A8A8A]'
                    }`}>
                      {product.status === 'Available' ? product.listing_type : 'Terjual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#E7D48A]">
                    {formatRupiah(product.price)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="rounded-xl bg-[#202020] p-2 text-soft transition hover:bg-[rgba(244,211,94,0.1)] hover:text-[#C9AA4A]"
                        title="Edit Data"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(product.title)}
                        className="rounded-xl bg-[#202020] p-2 text-soft transition hover:bg-red-400/10 hover:text-red-400"
                        title="Hapus Data"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-[2rem] p-8 text-center border border-[rgba(244,211,94,0.08)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-400/10 text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#F5F2EA]">Hapus Properti?</h3>
            <p className="text-sm text-soft">
              Apakah Anda yakin ingin menghapus <span className="font-semibold text-[#F5F2EA]">{productToDelete}</span> dari katalog? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <button 
                onClick={() => setProductToDelete(null)}
                className="rounded-2xl px-6 py-3 text-sm font-medium text-soft transition hover:bg-[rgba(244,211,94,0.05)] hover:text-[#F5F2EA]"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="rounded-2xl bg-red-500/20 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/30"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Success Notification Modal */}
      {showSuccess && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center border border-[rgba(244,211,94,0.08)]">
            <CheckCircle2 className="mb-4 h-12 w-12 text-[#C9AA4A]" />
            <h3 className="text-lg font-semibold text-[#F5F2EA]">Berhasil Dihapus</h3>
            <p className="mt-2 text-sm text-soft">Data properti telah dihapus dari katalog.</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
