import { useState, useRef, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import SuccessModal from '../../components/admin/SuccessModal'

export default function AwardForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imagePreview: null
  })

  useEffect(() => {
    if (isEdit) {
      setFormData({
        title: 'Top Agent 2025',
        description: 'Penghargaan agen penjualan dengan volume transaksi tertinggi di wilayah Jawa Timur.',
        imagePreview: 'https://images.unsplash.com/photo-1574607383471-5c744155b9e5?auto=format&fit=crop&q=80&w=800'
      })
    }
  }, [isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, imagePreview: URL.createObjectURL(file) }))
    }
  }

  const handleRemovePhoto = (e) => {
    e.stopPropagation()
    setFormData(prev => ({ ...prev, imagePreview: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowSuccess(true)
    }, 1000)
  }

  return (
    <div className="mx-auto max-w-3xl pb-20">
      <div className="mb-8">
        <Link
          to="/admin/awards"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#B8860B] transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Penghargaan
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2937]">
          {isEdit ? 'Edit Penghargaan' : 'Tambah Penghargaan Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-3xl bg-white p-8 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <div className="space-y-6">
            
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Foto Sertifikat / Penghargaan</label>
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
              <div onClick={() => fileInputRef.current?.click()} className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[rgba(0,0,0,0.1)] bg-[#F9FAFB] h-[200px] max-w-[200px] transition hover:bg-[#F3F4F6] cursor-pointer">
                {formData.imagePreview ? (
                  <>
                    <img src={formData.imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={handleRemovePhoto} className="absolute right-3 top-3 rounded-full bg-red-500 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <ImagePlus className="mb-3 h-8 w-8 text-[#D4AF37]" />
                    <p className="text-xs font-medium text-[#1F2937]">Unggah Foto</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Judul Penghargaan</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Contoh: Top Agent 2025" className="input-minimal w-full rounded-2xl py-3 px-4" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Deskripsi Singkat</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Tuliskan keterangan singkat tentang pencapaian ini..." className="input-minimal w-full rounded-2xl py-3 px-4 resize-none"></textarea>
            </div>
            
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-gold flex-1 rounded-2xl py-4 font-bold text-sm transition disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Data'}
          </button>
          <button type="button" onClick={() => navigate('/admin/awards')} className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-sm text-[#1F2937] transition hover:bg-gray-200">
            Batal
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={showSuccess}
        title="Berhasil Disimpan"
        message="Data penghargaan telah berhasil disimpan ke sistem."
        onOk={() => { setShowSuccess(false); navigate('/admin/awards'); }}
      />
    </div>
  )
}
