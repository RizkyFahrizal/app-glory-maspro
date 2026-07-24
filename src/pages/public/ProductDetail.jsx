import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, MapPin, X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isContacting, setIsContacting] = useState(false)

  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${slug}`)
        if (response.data && response.data.success) {
          setProduct(response.data.data)
        } else {
          setProduct(null)
        }
      } catch (error) {
        console.error('Failed to fetch product detail:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProductDetail()
  }, [slug])

  // Handle escape key for lightbox
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setIsLightboxOpen(false)
    if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev + 1) % (product?.images?.length || 1))
    if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1))
  }, [product])

  useEffect(() => {
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, handleKeyDown])

  if (loading) {
    return <div className="mt-20 text-center text-lg text-[#B8860B]">Memuat detail properti...</div>
  }

  if (!product) {
    return <div className="mt-20 text-center text-lg text-[#1F2937]">Properti tidak ditemukan.</div>
  }

  const handleContactClick = async (e) => {
    e.preventDefault()
    if (isContacting) return
    setIsContacting(true)
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/wa-marketing/next')
      let waNumber = ''
      if (res.data && res.data.success && res.data.data?.phone_number) {
        waNumber = res.data.data.phone_number
      } else {
        const marketingData = product.user?.waMarketing || product.user?.wa_marketing || {}
        waNumber = marketingData.phone_number || ''
      }

      if (!waNumber) {
        alert('Maaf, nomor WhatsApp marketing belum tersedia.')
        setIsContacting(false)
        return
      }

      let cleanNumber = waNumber.replace(/\D/g, '')
      if (cleanNumber.startsWith('0')) cleanNumber = '62' + cleanNumber.substring(1)
      const waLink = `https://wa.me/${cleanNumber}?text=Halo%20saya%20tertarik%20dengan%20properti%20*${encodeURIComponent(product.title)}*%20(${product.listing_id})`
      window.open(waLink, '_blank')
    } catch (error) {
      console.error('Failed to get next WA:', error)
      const marketingData = product.user?.waMarketing || product.user?.wa_marketing || {}
      const fallbackNumber = marketingData.phone_number || ''
      if (fallbackNumber) {
        let cleanNumber = fallbackNumber.replace(/\D/g, '')
        if (cleanNumber.startsWith('0')) cleanNumber = '62' + cleanNumber.substring(1)
        const waLink = `https://wa.me/${cleanNumber}?text=Halo%20saya%20tertarik%20dengan%20properti%20*${encodeURIComponent(product.title)}*%20(${product.listing_id})`
        window.open(waLink, '_blank')
      } else {
        alert('Gagal menghubungi marketing, server sedang sibuk.')
      }
    } finally {
      setIsContacting(false)
    }
  }

  const images = product.images || []
  const hasMoreImages = images.length > 4

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const renderMediaThumb = (media, className) => {
    const isVideo = media.image_path.match(/\.(webm|mp4)$/i)
    return (
      <div className={`relative h-full w-full ${className}`}>
        {isVideo ? (
          <>
            <video src={media.image_path} muted className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="rounded-full bg-white/30 p-3 backdrop-blur-md">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
          </>
        ) : (
          <img src={media.image_path} alt="Media" className="h-full w-full object-cover" />
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="pb-16 pt-4"
    >
      <div className="glass-panel rounded-[2rem] p-5 md:p-8">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#B8860B] transition hover:text-[#D4AF37]">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* LEFT COLUMN: Images, Description, Note */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-3">
              {/* Main Image */}
              <div
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-[rgba(0,0,0,0.06)] bg-[#F3F4F6] cursor-pointer"
                onClick={() => images.length > 0 && openLightbox(0)}
              >
                {images.length > 0 ? (
                  <>
                    {renderMediaThumb(images[0], "transition duration-500 group-hover:scale-105")}
                    <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-soft">No Image</div>
                )}
              </div>

              {/* Thumbnails (Max 3) */}
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.slice(1, 4).map((img, idx) => {
                    const isLastThumb = idx === 2
                    return (
                      <div
                        key={img.id}
                        className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#F3F4F6] cursor-pointer"
                        onClick={() => openLightbox(idx + 1)}
                      >
                        {renderMediaThumb(img, "transition duration-500 group-hover:scale-110")}

                        {/* Overlay "Lihat Semua" on 3rd thumbnail if there are more than 4 images total */}
                        {hasMoreImages && isLastThumb ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-[2px] transition hover:bg-black/50">
                            <span className="font-semibold tracking-wide">Lihat Semua</span>
                            <span className="text-[10px] uppercase tracking-wider text-white/80 mt-1">{images.length} Media</span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold tracking-[0.18em] text-[#B8860B] uppercase">Deskripsi</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-soft">{product.description || '-'}</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="md:col-span-5">
            <p className="section-label">Detail Properti</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#1F2937] md:text-4xl leading-tight">{product.title}</h1>
            <div className="mt-3 flex items-start gap-2 text-sm text-soft">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#D4AF37]" />
              <div className="flex flex-col">
                <span className="font-medium text-[#1F2937]">{product.location}</span>
                {product.address && <span className="text-xs">{product.address}</span>}
              </div>
            </div>

            <div className="mt-6 text-3xl font-semibold text-[#B8860B]">
              {product.price_start === product.price_end
                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price_start)
                : `${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price_start)} - ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price_end)}`
              }
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 rounded-[1.5rem] border border-[rgba(0,0,0,0.06)] bg-white p-4 md:p-5 shadow-sm">
              <div><span className="text-xs uppercase tracking-[0.16em] text-[#D4AF37]">Tipe Properti</span><p className="mt-1 font-medium text-[#1F2937]">{product.property_type || '-'}</p></div>
              <div><span className="text-xs uppercase tracking-[0.16em] text-[#D4AF37]">Sertifikat</span><p className="mt-1 font-medium text-[#1F2937]">{product.certificate || '-'}</p></div>
              <div><span className="text-xs uppercase tracking-[0.16em] text-[#D4AF37]">Luas Tanah</span><p className="mt-1 font-medium text-[#1F2937]">{product.land_area ? `${product.land_area} m²` : '-'}</p></div>
              <div><span className="text-xs uppercase tracking-[0.16em] text-[#D4AF37]">Luas Bangunan</span><p className="mt-1 font-medium text-[#1F2937]">{product.building_area ? `${product.building_area} m²` : '-'}</p></div>
              <div><span className="text-xs uppercase tracking-[0.16em] text-[#D4AF37]">Kamar Tidur</span><p className="mt-1 font-medium text-[#1F2937]">{product.bedrooms || '-'}</p></div>
              <div><span className="text-xs uppercase tracking-[0.16em] text-[#D4AF37]">Kamar Mandi</span><p className="mt-1 font-medium text-[#1F2937]">{product.bathrooms || '-'}</p></div>
              <div><span className="text-xs uppercase tracking-[0.16em] text-[#D4AF37]">Listrik</span><p className="mt-1 font-medium text-[#1F2937]">{product.electricity ? `${product.electricity} Watt` : '-'}</p></div>
              <div><span className="text-xs uppercase tracking-[0.16em] text-[#D4AF37]">Arah Hadap</span><p className="mt-1 font-medium text-[#1F2937]">{product.facing || '-'}</p></div>
              <div><span className="text-xs uppercase tracking-[0.16em] text-[#D4AF37]">Furnish</span><p className="mt-1 font-medium text-[#1F2937]">{product.furnish || '-'}</p></div>
            </div>

            {product.note && (
              <div className="mt-7 rounded-[1.5rem] bg-[#D4AF37]/10 p-5 border border-[#D4AF37]/20">
                <h3 className="text-xs font-semibold tracking-[0.18em] text-[#B8860B] uppercase mb-2">Catatan Tambahan</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#8B6508]">{product.note}</p>
              </div>
            )}

            <div className="mt-8 border-t border-[rgba(0,0,0,0.06)] pt-6">
              <p className="mb-4 text-sm text-soft">Tertarik dengan properti ini? Segera hubungi marketing kami untuk penawaran terbaik:</p>
              <button
                onClick={handleContactClick}
                disabled={isContacting}
                className="btn-gold block w-full rounded-2xl py-3.5 px-4 text-center text-sm font-bold tracking-wide transition shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isContacting ? 'Menghubungkan...' : 'Hubungi via WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Media Preview Modal */}
      {isLightboxOpen && images.length > 0 && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setIsLightboxOpen(false)}>
          {/* Close Btn */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Nav Btns */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + images.length) % images.length) }}
                className="absolute left-4 md:left-8 rounded-full bg-white/10 p-3 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % images.length) }}
                className="absolute right-4 md:right-8 rounded-full bg-white/10 p-3 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Main Media Content */}
          <div
            className="flex max-h-[85vh] max-w-[85vw] flex-col items-center justify-center overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {images[lightboxIndex].image_path.match(/\.(webm|mp4)$/i) ? (
              <video
                src={images[lightboxIndex].image_path}
                controls
                autoPlay
                muted
                className="max-h-[80vh] max-w-full rounded-md object-contain shadow-2xl"
              />
            ) : (
              <img
                src={images[lightboxIndex].image_path}
                alt="Preview"
                className="max-h-[80vh] max-w-full rounded-md object-contain shadow-2xl"
              />
            )}
          </div>

          {/* Indicator */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 md:bottom-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === lightboxIndex ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/30'}`}
              />
            ))}
          </div>
        </div>,
        document.body
      )}
    </motion.div>
  )
}