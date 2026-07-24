import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, ImagePlus, X } from 'lucide-react'
import axios from 'axios'
import SuccessModal from '../../components/admin/SuccessModal'
import AlertModal from '../../components/admin/AlertModal'
import DeleteModal from '../../components/admin/DeleteModal'
import CustomSelect from '../../components/public/CustomSelect'
import ProductImageUploader from '../../components/admin/ProductImageUploader'

export default function ProductForm() {
  const { id } = useParams()
  const location = useLocation()
  const isView = location.pathname.includes('/view/')
  const isEdit = Boolean(id) && !isView
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageToDelete, setImageToDelete] = useState(null)
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' })

  // Role guard: marketing cannot create/edit products
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const isMarketing = userData.role?.toLowerCase() === 'marketing'
    if (isMarketing && (location.pathname.includes('/create') || location.pathname.includes('/edit'))) {
      navigate('/admin/products', { replace: true, state: { restricted: true } })
    }
  }, [location.pathname, navigate])

  const [formData, setFormData] = useState({
    title: '',
    price_start: '',
    price_start_multiplier: 'Jt',
    price_end: '',
    price_end_multiplier: 'Jt',
    location: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    land_area: '',
    building_area: '',
    property_type: 'Rumah',
    electricity: '',
    certificate: 'SHM',
    facing: 'Timur',
    furnish: 'Non-Furnished',
    note: '',
    description: '',
    status: 'available'
  })

  const [images, setImages] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [initialLoading, setInitialLoading] = useState(isEdit || isView)

  useEffect(() => {
    if (isEdit || isView) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`https://api.glorymaspro.biz.id/api/products/${id}`)
          if (res.data && res.data.success) {
            const data = res.data.data

            // Format Harga
            const formatPrice = (val) => {
              if (!val) return { v: '', m: 'Jt' }
              if (val >= 1000000000 && val % 1000000000 === 0) return { v: val / 1000000000, m: 'M' }
              if (val >= 1000000 && val % 1000000 === 0) return { v: val / 1000000, m: 'Jt' }
              return { v: val, m: 'Jt' }
            }
            const pStart = formatPrice(data.price_start)
            const pEnd = formatPrice(data.price_end)

            setFormData({
              title: data.title || '',
              price_start: pStart.v,
              price_start_multiplier: pStart.m,
              price_end: pEnd.v,
              price_end_multiplier: pEnd.m,
              location: data.location || '',
              address: data.address || '',
              bedrooms: data.bedrooms || '',
              bathrooms: data.bathrooms || '',
              land_area: data.land_area || '',
              building_area: data.building_area || '',
              property_type: data.property_type || 'Rumah',
              electricity: data.electricity || '',
              certificate: data.certificate || 'SHM',
              facing: data.facing || 'Timur',
              furnish: data.furnish || 'Non-Furnished',
              note: data.note || '',
              description: data.description || '',
              status: data.status || 'available'
            })
            if (data.images) {
              setExistingImages(data.images)
            }
          }
        } catch (error) {
          console.error("Failed to fetch product:", error)
        } finally {
          setInitialLoading(false)
        }
      }
      fetchProduct()
    }
  }, [id, isEdit, isView])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)

      const totalImages = existingImages.length + images.length + selectedFiles.length
      if (totalImages > 7) {
        setAlertInfo({ isOpen: true, title: 'Batas Maksimal Media', message: 'Maksimal hanya boleh ada 7 media (foto/video) dalam satu produk.' })
        return
      }

      const videoFiles = selectedFiles.filter(f => f.type.startsWith('video/'))
      const existingVideos = existingImages.filter(img => img.image_path.endsWith('.webm') || img.image_path.endsWith('.mp4'))
      const currentNewVideos = images.filter(f => f.type.startsWith('video/'))
      if (videoFiles.length + existingVideos.length + currentNewVideos.length > 1) {
        setAlertInfo({ isOpen: true, title: 'Batas Maksimal Video', message: 'Maksimal hanya diperbolehkan 1 video (.webm/.mp4) untuk setiap produk.' })
        return
      }

      let hasOversizedVideo = false;
      let hasOversizedImage = false;
      for (const file of selectedFiles) {
        if (file.type.startsWith('video/') && file.size > 15 * 1024 * 1024) {
          hasOversizedVideo = true;
        } else if (file.type.startsWith('image/') && file.size > 5 * 1024 * 1024) {
          hasOversizedImage = true;
        }
      }

      if (hasOversizedVideo) {
        setAlertInfo({ isOpen: true, title: 'Ukuran Video Terlalu Besar', message: 'Maksimal ukuran file video adalah 15MB.' })
        return
      }
      if (hasOversizedImage) {
        setAlertInfo({ isOpen: true, title: 'Ukuran Foto Terlalu Besar', message: 'Maksimal ukuran file foto adalah 5MB.' })
        return
      }

      setImages(prev => [...prev, ...selectedFiles])

      // Generate Previews
      const previews = selectedFiles.map(file => {
        return {
          file,
          url: URL.createObjectURL(file),
          type: file.type.startsWith('video/') ? 'video' : 'image'
        }
      })
      setNewImagePreviews(prev => [...prev, ...previews])
    }
  }

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => {
      const newPrev = [...prev]
      URL.revokeObjectURL(newPrev[index].url)
      newPrev.splice(index, 1)
      return newPrev
    })
  }

  const handleConfirmDeleteImage = async () => {
    if (!imageToDelete) return
    try {
      const token = localStorage.getItem('token') || ''
      await axios.delete(`https://api.glorymaspro.biz.id/api/products/images/${imageToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExistingImages(prev => prev.filter(img => img.id !== imageToDelete))
    } catch (error) {
      console.error('Failed to delete image:', error)
      alert('Gagal menghapus gambar')
    } finally {
      setImageToDelete(null)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token') || ''
      const payload = new FormData()

      // Additional required fields by backend not directly in form
      payload.append('listing_type', 'Dijual')
      payload.append('status', 'available')

      const convertToRealValue = (val, mult) => {
        if (!val) return 0
        if (mult === 'M') return Number(val) * 1000000000
        return Number(val) * 1000000
      }

      Object.keys(formData).forEach(key => {
        if (key === 'price_start') {
          payload.append('price_start', convertToRealValue(formData.price_start, formData.price_start_multiplier))
        } else if (key === 'price_end') {
          payload.append('price_end', convertToRealValue(formData.price_end, formData.price_end_multiplier))
        } else if (key !== 'price_start_multiplier' && key !== 'price_end_multiplier') {
          payload.append(key, formData[key])
        }
      })

      images.forEach((file) => {
        payload.append('images[]', file)
      })

      if (isEdit) {
        payload.append('_method', 'PUT')
        await axios.post(`https://api.glorymaspro.biz.id/api/products/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        await axios.post('https://api.glorymaspro.biz.id/api/products', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }
      setShowSuccess(true)
    } catch (error) {
      console.error('Failed to save product:', error)
      alert(error.response?.data?.message || 'Gagal menyimpan properti')
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessOk = () => {
    setShowSuccess(false)
    navigate('/admin/products')
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#B8860B] transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2937]">
          {isView ? 'Detail Properti' : isEdit ? 'Edit Data Properti' : 'Tambah Properti Baru'}
        </h1>
        <p className="mt-2 text-sm text-soft">
          {isView ? 'Detail informasi properti.' : isEdit ? 'Perbarui informasi properti secara detail di bawah ini.' : 'Lengkapi formulir di bawah ini untuk mendaftarkan properti baru ke dalam katalog.'}
        </p>
      </div>

      {initialLoading ? (
        <div className="glass-panel rounded-3xl p-6 md:p-10 border border-[rgba(0,0,0,0.06)] bg-white animate-pulse">
          <div className="h-10 w-1/3 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
              <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
              <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
              <div className="h-24 w-full bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
              <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
              <div className="h-32 w-full bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="glass-panel rounded-3xl p-6 md:p-10 border border-[rgba(0,0,0,0.06)] bg-white">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* Kiri: Info Utama */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Nama Properti</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Villa Mewah Bali..."
                  disabled={isView}
                  className={`input-minimal w-full rounded-2xl py-3 px-4 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Harga Mulai</label>
                  <div className="relative flex items-center">
                    <input
                      required
                      type="number"
                      name="price_start"
                      value={formData.price_start}
                      onChange={handleInputChange}
                      placeholder="0"
                      disabled={isView}
                      className={`input-minimal w-full rounded-2xl py-3 pl-4 pr-16 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-16 border-l border-[rgba(212,175,55,0.2)]">
                      {isView ? (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400 bg-gray-50 rounded-r-2xl">{formData.price_start_multiplier}</div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleInputChange({ target: { name: 'price_start_multiplier', value: formData.price_start_multiplier === 'Jt' ? 'M' : 'Jt' } })}
                          className="h-full w-full bg-transparent flex items-center justify-center text-sm font-semibold text-[#8B6508] outline-none cursor-pointer rounded-r-2xl hover:bg-[#D4AF37]/10 transition-colors"
                        >
                          {formData.price_start_multiplier}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Harga Sampai</label>
                  <div className="relative flex items-center">
                    <input
                      required
                      type="number"
                      name="price_end"
                      value={formData.price_end}
                      onChange={handleInputChange}
                      placeholder="0"
                      disabled={isView}
                      className={`input-minimal w-full rounded-2xl py-3 pl-4 pr-16 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-16 border-l border-[rgba(212,175,55,0.2)]">
                      {isView ? (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400 bg-gray-50 rounded-r-2xl">{formData.price_end_multiplier}</div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleInputChange({ target: { name: 'price_end_multiplier', value: formData.price_end_multiplier === 'Jt' ? 'M' : 'Jt' } })}
                          className="h-full w-full bg-transparent flex items-center justify-center text-sm font-semibold text-[#8B6508] outline-none cursor-pointer rounded-r-2xl hover:bg-[#D4AF37]/10 transition-colors"
                        >
                          {formData.price_end_multiplier}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Tipe Properti</label>
                  <input
                    required
                    type="text"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    placeholder="Contoh: Rumah / Gudang"
                    disabled={isView}
                    className={`input-minimal w-full rounded-2xl py-3 px-4 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Status Ketersediaan</label>
                  {isView ? (
                    <input type="text" value={formData.status === 'sold' ? 'Terjual / Sold Out' : 'Tersedia'} disabled className="input-minimal w-full rounded-2xl py-3 px-4 bg-gray-50 text-gray-500 cursor-not-allowed" />
                  ) : (
                    <CustomSelect
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isView}
                      placeholder="Pilih Status"
                      options={[
                        { label: "Tersedia", value: "available" },
                        { label: "Terjual / Sold Out", value: "sold" }
                      ]}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Lokasi</label>
                <input
                  required
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jakarta Selatan"
                  disabled={isView}
                  className={`input-minimal w-full rounded-2xl py-3 px-4 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Alamat Lengkap</label>
                <textarea
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Alamat detail properti..."
                  disabled={isView}
                  className={`input-minimal w-full rounded-2xl py-3 px-4 resize-none ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Catatan Tambahan</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Tuliskan catatan tambahan..."
                  disabled={isView}
                  className={`input-minimal w-full rounded-2xl py-3 px-4 resize-none ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                ></textarea>
              </div>
            </div>

            {/* Kanan: Spesifikasi & Deskripsi */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Tidur</label>
                  <input
                    required
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    disabled={isView}
                    className={`input-minimal w-full rounded-2xl py-3 px-4 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Mandi</label>
                  <input
                    required
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    disabled={isView}
                    className={`input-minimal w-full rounded-2xl py-3 px-4 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Luas Tanah</label>
                  <div className="relative flex items-center">
                    <input
                      required
                      type="number"
                      name="land_area"
                      value={formData.land_area}
                      onChange={handleInputChange}
                      placeholder="0"
                      disabled={isView}
                      className={`input-minimal w-full rounded-2xl py-3 pl-4 pr-12 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                    />
                    <span className="absolute right-4 text-sm font-semibold text-gray-400 pointer-events-none">m²</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Luas Bangunan</label>
                  <div className="relative flex items-center">
                    <input
                      required
                      type="number"
                      name="building_area"
                      value={formData.building_area}
                      onChange={handleInputChange}
                      placeholder="0"
                      disabled={isView}
                      className={`input-minimal w-full rounded-2xl py-3 pl-4 pr-12 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                    />
                    <span className="absolute right-4 text-sm font-semibold text-gray-400 pointer-events-none">m²</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Sertifikat</label>
                  <input
                    type="text"
                    name="certificate"
                    value={formData.certificate}
                    onChange={handleInputChange}
                    placeholder="SHM / HGB"
                    disabled={isView}
                    className={`input-minimal w-full rounded-2xl py-3 px-4 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Listrik</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="electricity"
                      value={formData.electricity}
                      onChange={handleInputChange}
                      placeholder="2200"
                      disabled={isView}
                      className={`input-minimal w-full rounded-2xl py-3 pl-4 pr-16 ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                    />
                    <span className="absolute right-4 text-sm font-semibold text-gray-400 pointer-events-none">VA</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Perabotan</label>
                  {isView ? (
                    <input type="text" value={formData.furnish} disabled className="input-minimal w-full rounded-2xl py-3 px-4 bg-gray-50 text-gray-500 cursor-not-allowed" />
                  ) : (
                    <CustomSelect
                      name="furnish"
                      value={formData.furnish}
                      onChange={handleInputChange}
                      disabled={isView}
                      placeholder="Pilih Perabotan"
                      options={[
                        { label: "Non-Furnished", value: "Non-Furnished" },
                        { label: "Semi-Furnished", value: "Semi-Furnished" },
                        { label: "Fully-Furnished", value: "Fully-Furnished" }
                      ]}
                    />
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Arah Hadap</label>
                  {isView ? (
                    <input type="text" value={formData.facing} disabled className="input-minimal w-full rounded-2xl py-3 px-4 bg-gray-50 text-gray-500 cursor-not-allowed" />
                  ) : (
                    <CustomSelect
                      name="facing"
                      value={formData.facing}
                      onChange={handleInputChange}
                      disabled={isView}
                      placeholder="Pilih Arah"
                      options={[
                        { label: "Utara", value: "Utara" },
                        { label: "Timur laut", value: "Timur laut" },
                        { label: "Timur", value: "Timur" },
                        { label: "Tenggara", value: "Tenggara" },
                        { label: "Selatan", value: "Selatan" },
                        { label: "Barat daya", value: "Barat daya" },
                        { label: "Barat", value: "Barat" },
                        { label: "Barat laut", value: "Barat laut" }
                      ]}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Deskripsi Lengkap</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="7"
                  placeholder="Tuliskan spesifikasi, keunggulan, dan deskripsi detail properti..."
                  disabled={isView}
                  className={`input-minimal w-full rounded-2xl py-3 px-4 resize-none ${isView ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                ></textarea>
              </div>
            </div>
          </div>

          <ProductImageUploader
            isView={isView}
            isEdit={isEdit}
            existingImages={existingImages}
            newImagePreviews={newImagePreviews}
            onImageChange={handleImageChange}
            onSetImageToDelete={setImageToDelete}
            onRemoveNewImage={removeNewImage}
          />

          <div className="mt-10 flex items-center justify-end gap-4 border-t border-[rgba(0,0,0,0.06)] pt-6">
            <Link
              to="/admin/products"
              className="rounded-2xl px-6 py-3 text-sm font-medium text-soft transition hover:text-[#1F2937]"
            >
              Kembali
            </Link>
            {!isView && (
              <button
                type="submit"
                disabled={loading}
                className="btn-gold flex items-center gap-2 rounded-2xl px-8 py-3 text-sm font-semibold transition disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {loading ? 'Menyimpan...' : 'Simpan Properti'}
              </button>
            )}
          </div>
        </form>
      )}

      <AlertModal
        isOpen={alertInfo.isOpen}
        title={alertInfo.title}
        message={alertInfo.message}
        onOk={() => setAlertInfo({ ...alertInfo, isOpen: false })}
      />

      <SuccessModal
        isOpen={showSuccess}
        title="Berhasil Disimpan"
        message="Data properti Anda telah berhasil disimpan ke database."
        onOk={handleSuccessOk}
      />

      <DeleteModal
        isOpen={!!imageToDelete}
        title="Hapus Media"
        message="Apakah Anda yakin ingin menghapus media ini secara permanen dari properti?"
        onCancel={() => setImageToDelete(null)}
        onConfirm={handleConfirmDeleteImage}
      />
    </div>
  )
}
