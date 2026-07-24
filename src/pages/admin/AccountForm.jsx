import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, ChevronDown, X } from 'lucide-react'
import axios from 'axios'
import SuccessModal from '../../components/admin/SuccessModal'
import AlertModal from '../../components/admin/AlertModal'
import CustomSelect from '../../components/public/CustomSelect'

export default function AccountForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' })

  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const isMarketing = userData.role?.toLowerCase() === 'marketing'

  useEffect(() => {
    if (isMarketing) {
      // marketing can ONLY access edit page for their own account
      const canAccess = isEdit && String(userData.id) === String(id)
      if (!canAccess) {
        navigate('/admin/accounts', { state: { restricted: true } })
      }
    }
  }, [isMarketing, isEdit, id, navigate, userData.id])

  const [isFetching, setIsFetching] = useState(isEdit)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoBase64, setPhotoBase64] = useState(null)
  const [removePhoto, setRemovePhoto] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    role: 'Marketing',
    email: '',
    password: '',
    phone: '',
    position: '',
    coverage_area: ''
  })

  useEffect(() => {
    if (isEdit) {
      const fetchAccount = async () => {
        try {
          const token = localStorage.getItem('token') || ''
          const res = await axios.get(`https://api.glorymaspro.biz.id/api/accounts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.data && res.data.success) {
            const data = res.data.data
            setFormData({
              name: data.name || '',
              role: data.role ? (data.role.charAt(0).toUpperCase() + data.role.slice(1)) : 'Marketing',
              email: data.email || '',
              password: '',
              phone: data.wa_marketing?.phone_number || '',
              position: data.wa_marketing?.position || '',
              coverage_area: data.wa_marketing?.coverage_area || ''
            })
            if (data.name === 'Super Admin') {
              setIsSuperAdmin(true)
            }
            if (data.photo) {
              setPhotoPreview(`https://api.glorymaspro.biz.id/storage/${data.photo}`)
            }
          }
        } catch (error) {
          console.error("Error fetching account:", error)
          setAlertInfo({ isOpen: true, title: 'Gagal Memuat', message: 'Gagal memuat data akun' })
        } finally {
          setIsFetching(false)
        }
      }
      fetchAccount()
    }
  }, [id, isEdit])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemovePhoto = (e) => {
    e.stopPropagation()
    setPhotoPreview(null)
    setPhotoBase64(null)
    setRemovePhoto(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPhotoBase64(reader.result)
      }
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token') || ''
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role.toLowerCase(),
        phone_number: formData.phone,
        position: formData.position
      }

      if (photoBase64) {
        payload.photo_base64 = photoBase64;
      } else if (removePhoto) {
        payload.remove_photo = true;
      }

      if (formData.role === 'Marketing') {
        payload.coverage_area = formData.coverage_area;
      }

      if (formData.password) {
        payload.password = formData.password
      }

      if (isEdit) {
        const response = await axios.put(`https://api.glorymaspro.biz.id/api/accounts/${id}`, payload, config)

        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (currentUser.id === parseInt(id) && response.data?.data) {
          localStorage.setItem('user', JSON.stringify(response.data.data))
        }
      } else {
        await axios.post('https://api.glorymaspro.biz.id/api/accounts', payload, config)
      }

      setShowSuccess(true)
    } catch (error) {
      console.error('Failed to save account:', error)
      alert(error.response?.data?.message || 'Gagal menyimpan data akun.')
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessOk = () => {
    setShowSuccess(false)
    navigate('/admin/accounts')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <Link
          to="/admin/accounts"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#B8860B] transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Kelola Akun
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2937]">
          {isEdit ? 'Edit Data Akun' : 'Tambah Akun Baru'}
        </h1>
        <p className="mt-2 text-sm text-soft">
          {isEdit ? 'Perbarui informasi profil staf di bawah ini.' : 'Lengkapi formulir di bawah ini untuk mendaftarkan staf baru ke dalam sistem.'}
        </p>
      </div>

      <div className="mt-8 rounded-3xl bg-white p-8 border border-[rgba(0,0,0,0.06)] shadow-sm">
        {isFetching ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-soft font-medium animate-pulse">Memuat data profil...</div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* === KOLOM KIRI === */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Viorenza..."
                  disabled={isSuperAdmin}
                  className={`input-minimal w-full rounded-2xl py-3 px-4 ${isSuperAdmin ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Role (Hak Akses)</label>
                  {isMarketing ? (
                    /* Marketing: role is view-only */
                    <div className="input-minimal w-full rounded-2xl py-3 px-4 bg-gray-100 text-gray-500 cursor-not-allowed select-none">
                      {formData.role}
                    </div>
                  ) : isSuperAdmin ? (
                    <div className="input-minimal w-full rounded-2xl py-3 px-4 bg-gray-100 text-gray-500 cursor-not-allowed select-none">
                      {formData.role}
                    </div>
                  ) : (
                    <CustomSelect
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      options={[
                        { label: "Admin", value: "Admin" },
                        { label: "Marketing", value: "Marketing" }
                      ]}
                    />
                  )}
                </div>

                {formData.role === 'Marketing' && (
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Jabatan</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="Contoh: Sales Executive..."
                      className="input-minimal w-full rounded-2xl py-3 px-4"
                    />
                  </div>
                )}
              </div>

              {formData.role === 'Marketing' && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Area Cakupan</label>
                  <input
                    type="text"
                    name="coverage_area"
                    value={formData.coverage_area}
                    onChange={handleInputChange}
                    placeholder="Contoh: Semua Wilayah, Sidoarjo - Surabaya"
                    className="input-minimal w-full rounded-2xl py-3 px-4"
                  />
                </div>
              )}

              {formData.role === 'Marketing' && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Nomor Telepon (WhatsApp)</label>
                  <input
                    required
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                    className="input-minimal w-full rounded-2xl py-3 px-4"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Alamat Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Contoh: email@glorymaspro.com"
                  className="input-minimal w-full rounded-2xl py-3 px-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Password</label>
                <input
                  required={!isEdit}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isEdit ? "(Kosongkan jika tidak diubah)" : "Minimal 8 karakter..."}
                  className="input-minimal w-full rounded-2xl py-3 px-4"
                />
              </div>
            </div>

            {/* === KOLOM KANAN === */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Foto Profil</label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/png, image/jpeg"
                  className="hidden"
                />

                <div
                  onClick={handlePhotoClick}
                  className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[rgba(0,0,0,0.1)] bg-[#F9FAFB] py-16 transition hover:bg-[#F3F4F6] cursor-pointer"
                >
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Preview" className="h-full w-full object-cover max-h-[250px]" />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white shadow-md transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
                        title="Hapus Foto"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="mb-3 h-10 w-10 text-[#D4AF37]" />
                      <p className="text-sm font-medium text-[#1F2937]">Klik untuk unggah foto profil</p>
                      <p className="mt-1 text-xs text-soft">PNG, JPG up to 2MB. Rekomendasi rasio 1:1 (Kotak).</p>
                    </>
                  )}
                </div>
              </div>
            </div>


            <div className="md:col-span-2 mt-6 flex gap-4 border-t border-[rgba(0,0,0,0.06)] pt-8">
              <button type="submit" disabled={loading} className="btn-gold flex-1 rounded-2xl py-4 font-bold text-sm transition disabled:opacity-50">
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/accounts')}
                className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-sm text-[#1F2937] transition hover:bg-gray-200"
              >
                Kembali
              </button>
            </div>
          </form>
        )}
      </div>

      <AlertModal
        isOpen={alertInfo.isOpen}
        title={alertInfo.title}
        message={alertInfo.message}
        onOk={() => setAlertInfo({ ...alertInfo, isOpen: false })}
      />

      <SuccessModal
        isOpen={showSuccess}
        title="Berhasil Disimpan"
        message="Data akun telah berhasil disimpan ke sistem."
        onOk={handleSuccessOk}
      />
    </div>
  )
}
