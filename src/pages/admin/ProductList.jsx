import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { dummyProducts } from '../../data/dummyProducts'
import DeleteModal from '../../components/admin/DeleteModal'
import SuccessModal from '../../components/admin/SuccessModal'

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
                <th className="px-6 py-4 font-semibold">Harga & Tipe</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(244,211,94,0.05)]">
              {dummyProducts.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-[rgba(245,242,234,0.02)]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={product.images[0].image_path} 
                        alt={product.title} 
                        className="h-12 w-16 rounded-lg object-cover border border-[rgba(244,211,94,0.1)]"
                      />
                      <div>
                        <div className="font-semibold">{product.title}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-soft">
                          <span className="font-mono text-[#C9AA4A]">{product.listing_id}</span>
                          <span>•</span>
                          <span>{product.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#C9AA4A]">{formatRupiah(product.price)}</div>
                    <div className="mt-1 text-xs text-soft">{product.property_type} - {product.listing_type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      product.status === 'Available' 
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {product.status === 'Available' ? 'Tersedia' : 'Terjual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="rounded-xl p-2 text-soft transition hover:bg-[#101010] hover:text-[#C9AA4A]"
                        title="Edit Data"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(product.title)}
                        className="rounded-xl p-2 text-soft transition hover:bg-[#101010] hover:text-red-400"
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
        
        {/* Pagination Dummy */}
        <div className="flex items-center justify-between border-t border-[rgba(244,211,94,0.08)] bg-[#0A0A0A] px-6 py-4 text-sm text-soft">
          <div>Menampilkan 1 hingga {dummyProducts.length} dari {dummyProducts.length} hasil</div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-[rgba(244,211,94,0.1)] px-3 py-1 transition hover:bg-[#101010] hover:text-[#F5F2EA]" disabled>Prev</button>
            <button className="rounded-lg bg-[#C9AA4A]/10 px-3 py-1 text-[#C9AA4A]">1</button>
            <button className="rounded-lg border border-[rgba(244,211,94,0.1)] px-3 py-1 transition hover:bg-[#101010] hover:text-[#F5F2EA]" disabled>Next</button>
          </div>
        </div>
      </div>

      <DeleteModal 
        isOpen={!!productToDelete}
        itemName={productToDelete}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />

      <SuccessModal 
        isOpen={showSuccess}
        title="Berhasil Dihapus"
        message="Data properti telah dihapus dari katalog."
      />
    </div>
  )
}
