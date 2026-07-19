import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, MapPin } from 'lucide-react'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div className="mt-20 text-center text-lg text-[#E7D48A]">Memuat detail properti...</div>
  }

  if (!product) {
    return <div className="mt-20 text-center text-lg text-[#F5F2EA]">Properti tidak ditemukan.</div>
  }

  // Format nomor WA untuk link (memastikan diawali dengan 62)
  const marketingData = product.user?.waMarketing || product.user?.wa_marketing || {}
  const waNumber = marketingData.phone_number || ''
  const waLink = `https://wa.me/${waNumber}?text=Halo%20saya%20tertarik%20dengan%20properti%20${product.title}%20(${product.listing_id})`

  return (
    <div className="glass-panel rounded-[2rem] p-5 md:p-8">
      <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#E7D48A] transition hover:text-[#F5F2EA]">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-[rgba(245,242,234,0.08)] bg-[#181818]">
             {product.images && product.images.length > 0 ? (
               <img 
                 src={product.images.find(img => img.is_primary)?.image_path || product.images[0].image_path} 
                 alt="Cover" 
                 className="h-full w-full object-cover"
               />
             ) : (
               <div className="flex h-full w-full items-center justify-center text-sm text-soft">No Image</div>
             )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {product.images?.map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-2xl border border-[rgba(245,242,234,0.06)] bg-[#181818]">
                <img src={img.image_path} alt="Thumbnail" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label">Detail Properti</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#F5F2EA] md:text-4xl">{product.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-soft">
            <MapPin className="h-4 w-4 text-[#C9AA4A]" /> {product.location} - {product.address}
          </p>
          
          <div className="mt-5 text-3xl font-semibold text-[#E7D48A]">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 rounded-[1.5rem] border border-[rgba(245,242,234,0.08)] bg-[#202020] p-4 md:p-5">
            <div><span className="text-xs uppercase tracking-[0.16em] text-[#C9AA4A]">Tipe Properti</span><p className="mt-1 font-medium text-[#F5F2EA]">{product.property_type}</p></div>
            <div><span className="text-xs uppercase tracking-[0.16em] text-[#C9AA4A]">Sertifikat</span><p className="mt-1 font-medium text-[#F5F2EA]">{product.certificate}</p></div>
            <div><span className="text-xs uppercase tracking-[0.16em] text-[#C9AA4A]">Luas Tanah</span><p className="mt-1 font-medium text-[#F5F2EA]">{product.land_area} m²</p></div>
            <div><span className="text-xs uppercase tracking-[0.16em] text-[#C9AA4A]">Luas Bangunan</span><p className="mt-1 font-medium text-[#F5F2EA]">{product.building_area} m²</p></div>
            <div><span className="text-xs uppercase tracking-[0.16em] text-[#C9AA4A]">Kamar Tidur</span><p className="mt-1 font-medium text-[#F5F2EA]">{product.bedrooms}</p></div>
            <div><span className="text-xs uppercase tracking-[0.16em] text-[#C9AA4A]">Kamar Mandi</span><p className="mt-1 font-medium text-[#F5F2EA]">{product.bathrooms}</p></div>
            <div><span className="text-xs uppercase tracking-[0.16em] text-[#C9AA4A]">Listrik</span><p className="mt-1 font-medium text-[#F5F2EA]">{product.electricity}</p></div>
            <div><span className="text-xs uppercase tracking-[0.16em] text-[#C9AA4A]">Arah Hadap</span><p className="mt-1 font-medium text-[#F5F2EA]">{product.facing}</p></div>
          </div>

          <div className="mt-7">
            <h3 className="text-sm font-semibold tracking-[0.18em] text-[#E7D48A] uppercase">Deskripsi</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-soft">{product.description}</p>
          </div>

          <div className="mt-8 border-t border-[rgba(245,242,234,0.06)] pt-6">
            <p className="mb-3 text-sm text-soft">Tertarik dengan properti ini? Hubungi marketing kami:</p>
            <a 
              href={waLink} 
              target="_blank" 
              rel="noreferrer"
              className="btn-gold block w-full rounded-2xl py-3 px-4 text-center transition"
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}