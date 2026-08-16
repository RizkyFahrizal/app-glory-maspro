import { useState, useRef, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ImagePlus, X, Plus, Trash2 } from 'lucide-react'
import SuccessModal from '../../components/admin/SuccessModal'
import api from '../../utils/api'

export default function ProjectForm() {
  const { id } = useParams()
  const location = useLocation()
  const isView = location.pathname.includes('/view/')
  const isEdit = Boolean(id) && !isView
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(isEdit || isView)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const headerInputRef = useRef(null)

  // Role guard: marketing cannot create/edit projects
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const isMarketing = userData.role?.toLowerCase() === 'marketing'
    if (isMarketing && (location.pathname.includes('/create') || location.pathname.includes('/edit'))) {
      navigate('/admin/projects', { replace: true, state: { restricted: true } })
    }
  }, [location.pathname, navigate])

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    region: '',
    description: '',
    long_description: '',
    drive_link: '',
    facilities: [''],
    promos: [],
    sub_projects: []
  })

  // Images state (Files)
  const [images, setImages] = useState({
    image_header: null
  })

  // Previews
  const [previews, setPreviews] = useState({
    image_header: null
  })

  const [promoImages, setPromoImages] = useState({})
  const [clusterImages, setClusterImages] = useState({})
  
  const [promoPreviews, setPromoPreviews] = useState({})
  const [clusterPreviews, setClusterPreviews] = useState({})

  const getFullUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `https://api.glorymaspro.com/storage/${path}`
  }

  // Fetch for Edit or View
  useEffect(() => {
    if (isEdit || isView) {
      const fetchData = async () => {
        try {
          const res = await api.get(`/projects/${id}`)
          const data = res.data.data
          setFormData({
            title: data.title || '',
            location: data.location || '',
            region: data.region || '',
            description: data.description || '',
            long_description: data.long_description || '',
            drive_link: data.drive_link || '',
            facilities: Array.isArray(data.facilities) && data.facilities.length > 0 ? data.facilities : [''],
            promos: Array.isArray(data.promos) ? data.promos : [],
            sub_projects: Array.isArray(data.sub_projects) ? data.sub_projects : []
          })
          setPreviews({
            image_header: getFullUrl(data.image_header)
          })

          const initialPromoPreviews = {}
          if (Array.isArray(data.promos)) {
            data.promos.forEach(p => {
              if (p.image) initialPromoPreviews[p.id] = getFullUrl(p.image)
            })
          }
          setPromoPreviews(initialPromoPreviews)

          const initialClusterPreviews = {}
          if (Array.isArray(data.sub_projects)) {
            data.sub_projects.forEach(c => {
              if (c.image) initialClusterPreviews[c.id] = getFullUrl(c.image)
            })
          }
          setClusterPreviews(initialClusterPreviews)
        } catch (err) {
          console.error(err)
          alert('Gagal mengambil data proyek')
          navigate('/admin/projects')
        } finally {
          setInitLoading(false)
        }
      }
      fetchData()
    }
  }, [id, isEdit, isView, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Cover Image handlers
  const handleImageChange = (e, key) => {
    const file = e.target.files[0]
    if (file) {
      setImages(prev => ({ ...prev, [key]: file }))
      setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }))
    }
  }

  const handleRemoveImage = (e, key, ref) => {
    e.stopPropagation()
    setImages(prev => ({ ...prev, [key]: null }))
    setPreviews(prev => ({ ...prev, [key]: null }))
    if (ref.current) ref.current.value = ''
  }

  // Facilities Array
  const addFacility = () => setFormData(prev => ({ ...prev, facilities: [...prev.facilities, ''] }))
  const removeFacility = (index) => setFormData(prev => ({ ...prev, facilities: prev.facilities.filter((_, i) => i !== index) }))
  const updateFacility = (index, val) => {
    const newFacs = [...formData.facilities]
    newFacs[index] = val
    setFormData(prev => ({ ...prev, facilities: newFacs }))
  }

  // Promos Array
  const addPromo = () => setFormData(prev => ({ ...prev, promos: [...prev.promos, { id: Date.now(), title: '', description: '', image: null }] }))
  const removePromo = (idToRemove) => {
    setFormData(prev => ({ ...prev, promos: prev.promos.filter(p => p.id !== idToRemove) }))
    setPromoImages(prev => { const newObj = { ...prev }; delete newObj[idToRemove]; return newObj; })
    setPromoPreviews(prev => { const newObj = { ...prev }; delete newObj[idToRemove]; return newObj; })
  }
  const updatePromo = (idToUpdate, field, val) => {
    setFormData(prev => ({
      ...prev,
      promos: prev.promos.map(p => p.id === idToUpdate ? { ...p, [field]: val } : p)
    }))
  }
  const handlePromoImage = (e, id) => {
    const file = e.target.files[0]
    if (file) {
      setPromoImages(prev => ({ ...prev, [id]: file }))
      setPromoPreviews(prev => ({ ...prev, [id]: URL.createObjectURL(file) }))
    }
  }

  // Clusters (sub_projects) Array
  const addCluster = () => setFormData(prev => ({ ...prev, sub_projects: [...prev.sub_projects, { id: Date.now(), name: '', description: '', image: null }] }))
  const removeCluster = (idToRemove) => {
    setFormData(prev => ({ ...prev, sub_projects: prev.sub_projects.filter(c => c.id !== idToRemove) }))
    setClusterImages(prev => { const newObj = { ...prev }; delete newObj[idToRemove]; return newObj; })
    setClusterPreviews(prev => { const newObj = { ...prev }; delete newObj[idToRemove]; return newObj; })
  }
  const updateCluster = (idToUpdate, field, val) => {
    setFormData(prev => ({
      ...prev,
      sub_projects: prev.sub_projects.map(c => c.id === idToUpdate ? { ...c, [field]: val } : c)
    }))
  }
  const handleClusterImage = (e, id) => {
    const file = e.target.files[0]
    if (file) {
      setClusterImages(prev => ({ ...prev, [id]: file }))
      setClusterPreviews(prev => ({ ...prev, [id]: URL.createObjectURL(file) }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = new FormData()
    payload.append('title', formData.title)
    payload.append('location', formData.location)
    payload.append('region', formData.region)
    payload.append('description', formData.description)
    payload.append('long_description', formData.long_description)
    payload.append('drive_link', formData.drive_link)

    // Append JSON arrays
    const cleanFacilities = formData.facilities.filter(f => f.trim() !== '')
    payload.append('facilities', JSON.stringify(cleanFacilities))
    payload.append('promos', JSON.stringify(formData.promos))
    payload.append('sub_projects', JSON.stringify(formData.sub_projects))

    // Append global files
    if (images.image_header) payload.append('image_header', images.image_header)

    // Append individual promo images
    Object.keys(promoImages).forEach(id => {
      if (promoImages[id]) payload.append(`promo_image_${id}`, promoImages[id])
    })

    // Append individual cluster images
    Object.keys(clusterImages).forEach(id => {
      if (clusterImages[id]) payload.append(`cluster_image_${id}`, clusterImages[id])
    })

    // Note: The route in api.php is Route::post('/projects/{id}') so we don't need _method=PUT

    try {
      if (isEdit) {
        await api.post(`/projects/${id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/projects', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setShowSuccess(true)
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menyimpan proyek.')
    } finally {
      setLoading(false)
    }
  }

  if (initLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-medium animate-pulse">Memuat data proyek...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl pb-20">
      <div className="mb-8">
        <button type="button" onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#B8860B] transition hover:text-[#D4AF37]">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Halaman Sebelumnya
        </button>
        <h1 className="text-2xl font-semibold text-[#1F2937]">
          {isView ? 'Detail Proyek' : isEdit ? 'Edit Proyek' : 'Tambah Proyek Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* === SECTION 1: INFO DASAR === */}
        <div className="rounded-3xl bg-white p-8 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <h2 className="text-xl font-bold text-[#1F2937] mb-6">Informasi Dasar & Landing Page</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Nama Proyek</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} disabled={isView} placeholder="Contoh: Proyek Taman Anggun Sejahtera" className="input-minimal w-full rounded-2xl py-3 px-4 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Lokasi</label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange} disabled={isView} placeholder="Contoh: Sidoarjo, Surabaya" className="input-minimal w-full rounded-2xl py-3 px-4 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Daerah (Filter Utama)</label>
                <input required type="text" name="region" value={formData.region} onChange={handleChange} disabled={isView} placeholder="Contoh: Balungbendo, Tanggulangin, Wiyung" className="input-minimal w-full rounded-2xl py-3 px-4 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Link Google Drive (Media Promosi)</label>
                <input type="url" name="drive_link" value={formData.drive_link} onChange={handleChange} disabled={isView} placeholder="https://drive.google.com/..." className="input-minimal w-full rounded-2xl py-3 px-4 text-blue-600 disabled:bg-gray-100 disabled:text-blue-400" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Deskripsi Singkat (SEO/Card)</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} disabled={isView} rows="2" className="input-minimal w-full rounded-2xl py-3 px-4 resize-none disabled:bg-gray-100 disabled:text-gray-500"></textarea>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Gambar Cover (Hero Banner)</label>
              <input type="file" ref={headerInputRef} onChange={(e) => handleImageChange(e, 'image_header')} accept="image/*" className="hidden" disabled={isView} />
              <div onClick={() => !isView && headerInputRef.current?.click()} className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[rgba(0,0,0,0.1)] bg-[#F9FAFB] h-[250px] transition ${!isView ? 'hover:bg-[#F3F4F6] cursor-pointer' : ''}`}>
                {previews.image_header ? (
                  <>
                    <img src={previews.image_header} alt="Preview" className="h-full w-full object-cover" />
                    {!isView && (
                      <button type="button" onClick={(e) => handleRemoveImage(e, 'image_header', headerInputRef)} className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <ImagePlus className="mb-3 h-10 w-10 text-[#D4AF37]" />
                    <p className="text-sm font-medium text-[#1F2937]">Unggah Cover Header</p>
                  </>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Tentang Properti (Deskripsi Panjang)</label>
              <textarea required name="long_description" value={formData.long_description} onChange={handleChange} disabled={isView} rows="5" className="input-minimal w-full rounded-2xl py-3 px-4 disabled:bg-gray-100 disabled:text-gray-500" placeholder="Gunakan enter untuk membuat paragraf baru..."></textarea>
            </div>
          </div>
        </div>

        {/* === SECTION 2: FASILITAS === */}
        <div className="rounded-3xl bg-white p-8 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F2937]">Fasilitas Kawasan</h2>
            {!isView && (
              <button type="button" onClick={addFacility} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Fasilitas
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.facilities.map((fac, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" value={fac} onChange={(e) => updateFacility(idx, e.target.value)} disabled={isView} placeholder="Contoh: Kolam Renang" className="input-minimal flex-1 rounded-xl py-3 px-4 disabled:bg-gray-100 disabled:text-gray-500" />
                {!isView && (
                  <button type="button" onClick={() => removeFacility(idx)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* === SECTION 3: PROMOSI === */}
        <div className="rounded-3xl bg-white p-8 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F2937]">Daftar Promo</h2>
            {!isView && (
              <button type="button" onClick={addPromo} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Promo
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.promos.map((promo) => (
              <div key={promo.id} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 relative group flex gap-6">
                {!isView && (
                  <button type="button" onClick={() => removePromo(promo.id)} className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-100 rounded-xl bg-white opacity-0 group-hover:opacity-100 transition shadow-sm z-10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="w-1/3 shrink-0">
                  <input type="file" id={`promo-img-${promo.id}`} onChange={(e) => handlePromoImage(e, promo.id)} accept="image/*" className="hidden" disabled={isView} />
                  <div onClick={() => !isView && document.getElementById(`promo-img-${promo.id}`)?.click()} className={`group/img relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[rgba(0,0,0,0.1)] bg-[#F9FAFB] h-32 transition ${!isView ? 'hover:bg-[#F3F4F6] cursor-pointer' : ''}`}>
                    {promoPreviews[promo.id] ? (
                      <img src={promoPreviews[promo.id]} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center p-2">
                        <ImagePlus className="mx-auto mb-2 h-6 w-6 text-[#D4AF37]" />
                        <p className="text-[10px] font-medium text-[#1F2937]">Gambar Promo</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4 flex-1 pr-8">
                  <input type="text" placeholder="Judul Promo" value={promo.title} disabled={isView} onChange={(e) => updatePromo(promo.id, 'title', e.target.value)} className="input-minimal w-full rounded-xl py-2 px-4 font-semibold disabled:bg-gray-100 disabled:text-gray-500" />
                  <textarea placeholder="Deskripsi Promo" value={promo.description} disabled={isView} onChange={(e) => updatePromo(promo.id, 'description', e.target.value)} rows="2" className="input-minimal w-full rounded-xl py-2 px-4 resize-none text-sm disabled:bg-gray-100 disabled:text-gray-500"></textarea>
                </div>
              </div>
            ))}
            {formData.promos.length === 0 && <p className="text-sm text-soft text-center md:col-span-2 py-4">Belum ada promo yang ditambahkan.</p>}
          </div>
        </div>

        {/* === SECTION 4: CLUSTERS === */}
        <div className="rounded-3xl bg-white p-8 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F2937]">Daftar Cluster (Proyek Bagian)</h2>
            {!isView && (
              <button type="button" onClick={addCluster} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Cluster
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.sub_projects.map((cluster) => (
              <div key={cluster.id} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 relative group flex gap-6">
                {!isView && (
                  <button type="button" onClick={() => removeCluster(cluster.id)} className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-100 rounded-xl bg-white opacity-0 group-hover:opacity-100 transition shadow-sm z-10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="w-1/3 shrink-0">
                  <input type="file" id={`cluster-img-${cluster.id}`} onChange={(e) => handleClusterImage(e, cluster.id)} accept="image/*" className="hidden" disabled={isView} />
                  <div onClick={() => !isView && document.getElementById(`cluster-img-${cluster.id}`)?.click()} className={`group/img relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[rgba(0,0,0,0.1)] bg-[#F9FAFB] h-32 transition ${!isView ? 'hover:bg-[#F3F4F6] cursor-pointer' : ''}`}>
                    {clusterPreviews[cluster.id] ? (
                      <img src={clusterPreviews[cluster.id]} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center p-2">
                        <ImagePlus className="mx-auto mb-2 h-6 w-6 text-[#D4AF37]" />
                        <p className="text-[10px] font-medium text-[#1F2937]">Gambar Cluster</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4 flex-1 pr-8">
                  <input type="text" placeholder="Nama Cluster" value={cluster.name} disabled={isView} onChange={(e) => updateCluster(cluster.id, 'name', e.target.value)} className="input-minimal w-full rounded-xl py-2 px-4 font-semibold disabled:bg-gray-100 disabled:text-gray-500" />
                  <textarea placeholder="Deskripsi Singkat" value={cluster.description} disabled={isView} onChange={(e) => updateCluster(cluster.id, 'description', e.target.value)} rows="2" className="input-minimal w-full rounded-xl py-2 px-4 resize-none text-sm disabled:bg-gray-100 disabled:text-gray-500"></textarea>
                </div>
              </div>
            ))}
            {formData.sub_projects.length === 0 && <p className="text-sm text-soft text-center md:col-span-2 py-4">Belum ada cluster yang ditambahkan.</p>}
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex gap-4 pt-4">
          {!isView && (
            <button type="submit" disabled={loading} className="btn-gold flex-1 rounded-2xl py-4 font-bold text-sm transition disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Simpan Proyek'}
            </button>
          )}
          <button type="button" onClick={() => navigate(-1)} className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-sm text-[#1F2937] transition hover:bg-gray-200">
            {isView ? 'Kembali' : 'Batal'}
          </button>
        </div>

      </form>

      <SuccessModal
        isOpen={showSuccess}
        title="Berhasil Disimpan"
        message="Data proyek telah berhasil disimpan ke sistem."
        onOk={() => { setShowSuccess(false); navigate('/admin/projects'); }}
      />
    </div>
  )
}
