import { useState, useRef, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ImagePlus, X, Plus, Trash2 } from 'lucide-react'
import SuccessModal from '../../components/admin/SuccessModal'

export default function ProjectForm() {
  const { id } = useParams()
  const location = useLocation()
  const isView = location.pathname.includes('/view/')
  const isEdit = Boolean(id) && !isView
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef(null)

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
    name: '',
    location: '',
    description: '',
    longDescription: '',
    driveLink: '',
    imagePreview: null,
    facilities: [''],
    promos: [],
    clusters: []
  })

  // Dummy fetch for Edit
  useEffect(() => {
    if (isEdit || isView) {
      setFormData({
        name: 'PT Lentera / Samesta Mahata Serpong',
        location: 'BSD Serpong, Tangerang',
        description: 'Proyek perumahan eksklusif.',
        longDescription: 'Samesta Mahata Serpong merupakan hunian modern berkonsep TOD...',
        driveLink: 'https://drive.google.com/drive/folders/dummy1',
        imagePreview: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920',
        facilities: ['Akses Stasiun KRL', 'One Gate System'],
        promos: [
          { id: 1, title: 'Promo Merdeka', description: 'Tanpa DP', imagePreview: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800' }
        ],
        clusters: [
          { id: 1, name: 'Cluster Ametis', description: 'Desain minimalis', imagePreview: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' }
        ]
      })
    }
  }, [isEdit, isView])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Cover Image
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

  // Facilities Array
  const addFacility = () => setFormData(prev => ({ ...prev, facilities: [...prev.facilities, ''] }))
  const removeFacility = (index) => setFormData(prev => ({ ...prev, facilities: prev.facilities.filter((_, i) => i !== index) }))
  const updateFacility = (index, val) => {
    const newFacs = [...formData.facilities]
    newFacs[index] = val
    setFormData(prev => ({ ...prev, facilities: newFacs }))
  }

  // Promos Array
  const addPromo = () => setFormData(prev => ({ ...prev, promos: [...prev.promos, { id: Date.now(), title: '', description: '', imagePreview: null }] }))
  const removePromo = (idToRemove) => setFormData(prev => ({ ...prev, promos: prev.promos.filter(p => p.id !== idToRemove) }))
  const updatePromo = (idToUpdate, field, val) => {
    setFormData(prev => ({
      ...prev,
      promos: prev.promos.map(p => p.id === idToUpdate ? { ...p, [field]: val } : p)
    }))
  }
  const handlePromoImage = (idToUpdate, file) => {
    if (file) {
      updatePromo(idToUpdate, 'imagePreview', URL.createObjectURL(file))
    }
  }

  // Clusters Array
  const addCluster = () => setFormData(prev => ({ ...prev, clusters: [...prev.clusters, { id: Date.now(), name: '', description: '', imagePreview: null }] }))
  const removeCluster = (idToRemove) => setFormData(prev => ({ ...prev, clusters: prev.clusters.filter(c => c.id !== idToRemove) }))
  const updateCluster = (idToUpdate, field, val) => {
    setFormData(prev => ({
      ...prev,
      clusters: prev.clusters.map(c => c.id === idToUpdate ? { ...c, [field]: val } : c)
    }))
  }
  const handleClusterImage = (idToUpdate, file) => {
    if (file) {
      updateCluster(idToUpdate, 'imagePreview', URL.createObjectURL(file))
    }
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
    <div className="mx-auto max-w-5xl pb-20">
      <div className="mb-8">
        <Link
          to="/admin/projects"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#B8860B] transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Proyek
        </Link>
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
                <input required type="text" name="name" value={formData.name} onChange={handleChange} disabled={isView} className="input-minimal w-full rounded-2xl py-3 px-4 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Lokasi</label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange} disabled={isView} className="input-minimal w-full rounded-2xl py-3 px-4 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Link Google Drive (Media Promosi)</label>
                <input required type="url" name="driveLink" value={formData.driveLink} onChange={handleChange} disabled={isView} placeholder="https://drive.google.com/..." className="input-minimal w-full rounded-2xl py-3 px-4 text-blue-600 disabled:bg-gray-100 disabled:text-blue-400" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Deskripsi Singkat (SEO/Card)</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} disabled={isView} rows="2" className="input-minimal w-full rounded-2xl py-3 px-4 resize-none disabled:bg-gray-100 disabled:text-gray-500"></textarea>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Gambar Cover (Hero Banner)</label>
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" disabled={isView} />
              <div onClick={() => !isView && fileInputRef.current?.click()} className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[rgba(0,0,0,0.1)] bg-[#F9FAFB] h-[250px] transition ${!isView ? 'hover:bg-[#F3F4F6] cursor-pointer' : ''}`}>
                {formData.imagePreview ? (
                  <>
                    <img src={formData.imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    {!isView && (
                      <button type="button" onClick={handleRemovePhoto} className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <ImagePlus className="mb-3 h-10 w-10 text-[#D4AF37]" />
                    <p className="text-sm font-medium text-[#1F2937]">Unggah Cover (1920x1080)</p>
                  </>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Tentang Properti (Deskripsi Panjang)</label>
              <textarea required name="longDescription" value={formData.longDescription} onChange={handleChange} disabled={isView} rows="10" className="input-minimal w-full rounded-2xl py-3 px-4 disabled:bg-gray-100 disabled:text-gray-500" placeholder="Gunakan enter untuk membuat paragraf baru..."></textarea>
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
            <h2 className="text-xl font-bold text-[#1F2937]">Promo Proyek</h2>
            {!isView && (
              <button type="button" onClick={addPromo} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Promo
              </button>
            )}
          </div>

          <div className="space-y-6">
            {formData.promos.map((promo, idx) => (
              <div key={promo.id} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex gap-6 items-start relative group">
                {!isView && (
                  <button type="button" onClick={() => removePromo(promo.id)} className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-100 rounded-xl bg-white opacity-0 group-hover:opacity-100 transition shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div className={`w-48 h-32 shrink-0 bg-white rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative ${!isView ? 'cursor-pointer' : ''}`}>
                  <input type="file" accept="image/*" disabled={isView} onChange={(e) => handlePromoImage(promo.id, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {promo.imagePreview ? (
                    <img src={promo.imagePreview} alt="Promo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">Foto Promo</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <input type="text" placeholder="Judul Promo" value={promo.title} disabled={isView} onChange={(e) => updatePromo(promo.id, 'title', e.target.value)} className="input-minimal w-full rounded-xl py-2 px-4 font-semibold disabled:bg-gray-100 disabled:text-gray-500" />
                  <textarea placeholder="Deskripsi Promo" value={promo.description} disabled={isView} onChange={(e) => updatePromo(promo.id, 'description', e.target.value)} rows="2" className="input-minimal w-full rounded-xl py-2 px-4 resize-none text-sm disabled:bg-gray-100 disabled:text-gray-500"></textarea>
                </div>
              </div>
            ))}
            {formData.promos.length === 0 && <p className="text-sm text-soft text-center py-4">Belum ada promo yang ditambahkan.</p>}
          </div>
        </div>

        {/* === SECTION 4: CLUSTERS === */}
        <div className="rounded-3xl bg-white p-8 border border-[rgba(0,0,0,0.06)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F2937]">Daftar Cluster</h2>
            {!isView && (
              <button type="button" onClick={addCluster} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Cluster
              </button>
            )}
          </div>

          <div className="space-y-6">
            {formData.clusters.map((cluster, idx) => (
              <div key={cluster.id} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex gap-6 items-start relative group">
                {!isView && (
                  <button type="button" onClick={() => removeCluster(cluster.id)} className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-100 rounded-xl bg-white opacity-0 group-hover:opacity-100 transition shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div className={`w-48 h-32 shrink-0 bg-white rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative ${!isView ? 'cursor-pointer' : ''}`}>
                  <input type="file" accept="image/*" disabled={isView} onChange={(e) => handleClusterImage(cluster.id, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {cluster.imagePreview ? (
                    <img src={cluster.imagePreview} alt="Cluster" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">Foto Cluster</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <input type="text" placeholder="Nama Cluster" value={cluster.name} disabled={isView} onChange={(e) => updateCluster(cluster.id, 'name', e.target.value)} className="input-minimal w-full rounded-xl py-2 px-4 font-semibold disabled:bg-gray-100 disabled:text-gray-500" />
                  <textarea placeholder="Deskripsi Singkat" value={cluster.description} disabled={isView} onChange={(e) => updateCluster(cluster.id, 'description', e.target.value)} rows="2" className="input-minimal w-full rounded-xl py-2 px-4 resize-none text-sm disabled:bg-gray-100 disabled:text-gray-500"></textarea>
                </div>
              </div>
            ))}
            {formData.clusters.length === 0 && <p className="text-sm text-soft text-center py-4">Belum ada cluster yang ditambahkan.</p>}
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex gap-4 pt-4">
          {!isView && (
            <button type="submit" disabled={loading} className="btn-gold flex-1 rounded-2xl py-4 font-bold text-sm transition disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Simpan Proyek'}
            </button>
          )}
          <button type="button" onClick={() => navigate('/admin/projects')} className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-sm text-[#1F2937] transition hover:bg-gray-200">
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
