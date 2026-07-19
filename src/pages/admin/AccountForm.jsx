import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, ImagePlus } from 'lucide-react'
import SuccessModal from '../../components/admin/SuccessModal'

export default function AccountForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    setShowSuccess(true)
  }

  const handleSuccessOk = () => {
    setShowSuccess(false)
    navigate('/admin/accounts')
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <div className="mb-8">
        <Link 
          to="/admin/accounts" 
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C9AA4A] transition hover:text-[#F5F2EA]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Kelola Akun
        </Link>
        <h1 className="text-2xl font-semibold text-[#F5F2EA]">
          {isEdit ? 'Edit Data Akun' : 'Tambah Akun Baru'}
        </h1>
        <p className="mt-2 text-sm text-soft">
          {isEdit ? 'Perbarui informasi profil staf di bawah ini.' : 'Lengkapi formulir di bawah ini untuk mendaftarkan staf baru ke dalam sistem.'}
        </p>
      </div>

      <form className="glass-panel rounded-3xl p-6 md:p-10 border border-[rgba(244,211,94,0.08)]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Kiri: Info Personal */}
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="Contoh: Viorenza..." 
                className="input-minimal w-full rounded-2xl py-3 px-4"
                defaultValue={isEdit ? 'Data Staf Dummy' : ''}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Role (Hak Akses)</label>
                <select className="input-minimal w-full rounded-2xl py-3 px-4 appearance-none cursor-pointer">
                  <option value="Marketing">Marketing</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Jabatan</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Sales Exec..." 
                  className="input-minimal w-full rounded-2xl py-3 px-4"
                  defaultValue={isEdit ? 'Admin Marketing' : ''}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Nomor Telepon (WhatsApp)</label>
              <input 
                type="text" 
                placeholder="Contoh: +62 812-3456-7890" 
                className="input-minimal w-full rounded-2xl py-3 px-4"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Alamat Email</label>
              <input 
                type="email" 
                placeholder="Contoh: email@glorymaspro.com" 
                className="input-minimal w-full rounded-2xl py-3 px-4"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Area Cakupan (Coverage)</label>
              <input 
                type="text" 
                placeholder="Contoh: Semua Wilayah, Jakarta Selatan..." 
                className="input-minimal w-full rounded-2xl py-3 px-4"
              />
            </div>
          </div>

          {/* Kanan: Foto Profil */}
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Foto Profil</label>
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(244,211,94,0.2)] bg-[#141414] py-16 transition hover:bg-[rgba(244,211,94,0.02)] cursor-pointer">
                <ImagePlus className="mb-3 h-10 w-10 text-[#C9AA4A]" />
                <p className="text-sm font-medium text-[#F5F2EA]">Klik untuk unggah foto profil</p>
                <p className="mt-1 text-xs text-soft">PNG, JPG up to 2MB. Rekomendasi rasio 1:1 (Kotak).</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4 border-t border-[rgba(244,211,94,0.06)] pt-6">
          <Link 
            to="/admin/accounts"
            className="rounded-2xl px-6 py-3 text-sm font-medium text-soft transition hover:text-[#F5F2EA]"
          >
            Batal
          </Link>
          <button 
            type="button"
            onClick={handleSave}
            className="btn-gold flex items-center gap-2 rounded-2xl px-8 py-3 text-sm font-semibold transition"
          >
            <Save className="h-4 w-4" /> Simpan Akun
          </button>
        </div>
      </form>

      <SuccessModal 
        isOpen={showSuccess}
        title="Berhasil Disimpan"
        message="Data akun telah berhasil disimpan ke sistem."
        onOk={handleSuccessOk}
      />
    </div>
  )
}
