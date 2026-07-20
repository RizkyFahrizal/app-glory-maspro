import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, ImagePlus } from 'lucide-react'
import SuccessModal from '../../components/admin/SuccessModal'

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    setShowSuccess(true)
  }

  const handleSuccessOk = () => {
    setShowSuccess(false)
    navigate('/admin/products')
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <div className="mb-8">
        <Link 
          to="/admin/products" 
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#B8860B] transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2937]">
          {isEdit ? 'Edit Data Properti' : 'Tambah Properti Baru'}
        </h1>
        <p className="mt-2 text-sm text-soft">
          {isEdit ? 'Perbarui informasi properti secara detail di bawah ini.' : 'Lengkapi formulir di bawah ini untuk mendaftarkan properti baru ke dalam katalog.'}
        </p>
      </div>

      <form className="glass-panel rounded-3xl p-6 md:p-10 border border-[rgba(0,0,0,0.06)] bg-white">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Kiri: Info Utama */}
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Nama Properti</label>
              <input 
                type="text" 
                placeholder="Contoh: Villa Mewah Bali..." 
                className="input-minimal w-full rounded-2xl py-3 px-4"
                defaultValue={isEdit ? 'Data Properti Dummy (Contoh)' : ''}
              />
            </div>
            
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Harga (IDR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-soft">Rp</span>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="input-minimal w-full rounded-2xl py-3 pl-12 pr-4"
                  defaultValue={isEdit ? 5000000000 : undefined}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Lokasi Singkat</label>
              <input 
                type="text" 
                placeholder="Contoh: Jakarta Selatan" 
                className="input-minimal w-full rounded-2xl py-3 px-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Tidur</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="input-minimal w-full rounded-2xl py-3 px-4"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Mandi</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="input-minimal w-full rounded-2xl py-3 px-4"
                />
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Tipe Properti</label>
              <select className="input-minimal w-full rounded-2xl py-3 px-4 appearance-none cursor-pointer">
                <option value="Rumah">Rumah</option>
                <option value="Apartemen">Apartemen</option>
                <option value="Villa">Villa</option>
                <option value="Ruko">Ruko</option>
              </select>
            </div>
          </div>

          {/* Kanan: Deskripsi & Foto */}
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Deskripsi Lengkap</label>
              <textarea 
                rows="6"
                placeholder="Tuliskan spesifikasi, keunggulan, dan deskripsi detail properti..." 
                className="input-minimal w-full rounded-2xl py-3 px-4 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Foto Properti</label>
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(0,0,0,0.1)] bg-[#F9FAFB] py-12 transition hover:bg-[#F3F4F6] cursor-pointer">
                <ImagePlus className="mb-3 h-8 w-8 text-[#D4AF37]" />
                <p className="text-sm font-medium text-[#1F2937]">Klik untuk unggah foto</p>
                <p className="mt-1 text-xs text-soft">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4 border-t border-[rgba(0,0,0,0.06)] pt-6">
          <Link 
            to="/admin/products"
            className="rounded-2xl px-6 py-3 text-sm font-medium text-soft transition hover:text-[#1F2937]"
          >
            Batal
          </Link>
          <button 
            type="button"
            onClick={handleSave}
            className="btn-gold flex items-center gap-2 rounded-2xl px-8 py-3 text-sm font-semibold transition"
          >
            <Save className="h-4 w-4" /> Simpan Properti
          </button>
        </div>
      </form>

      <SuccessModal 
        isOpen={showSuccess}
        title="Berhasil Disimpan"
        message="Data properti Anda telah berhasil disimpan ke katalog."
        onOk={handleSuccessOk}
      />
    </div>
  )
}
