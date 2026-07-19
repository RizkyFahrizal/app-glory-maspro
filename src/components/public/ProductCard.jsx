import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, BedDouble, Bath, Scaling, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleNextImage = (e) => {
    e.preventDefault()
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const handlePrevImage = (e) => {
    e.preventDefault()
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    }
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="card-minimal group flex flex-col overflow-hidden rounded-[1.5rem] transition duration-300"
    >
      <div className="relative h-52 w-full overflow-hidden bg-[#181818]">
        {product.images && product.images.length > 0 ? (
          <>
            <div 
              className="flex h-full w-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {product.images.map((img) => (
                <div key={img.id} className="h-full w-full flex-shrink-0 overflow-hidden">
                  <img
                    src={img.image_path}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 backdrop-blur-sm transition hover:bg-[#C9AA4A] hover:text-black group-hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 backdrop-blur-sm transition hover:bg-[#C9AA4A] hover:text-black group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                  {product.images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? 'w-4 bg-[#C9AA4A]' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-soft">No Image</div>
        )}
        <span className="absolute right-3 top-3 z-10 rounded-full border border-[rgba(245,242,234,0.1)] bg-[#101010]/86 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#E7D48A]">
          {product.status === 'Available' ? 'TERSEDIA' : 'TERJUAL'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-[#F5F2EA] transition-colors group-hover:text-[#E7D48A]">
          {product.title}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-soft">
          <MapPin className="h-4 w-4 text-[#C9AA4A]" /> {product.location}
        </p>

        <div className="mt-4 text-2xl font-semibold text-[#E7D48A]">
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
        </div>

        <div className="mt-auto border-t border-[rgba(245,242,234,0.06)] pt-4">
          <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-[#F5F2EA] md:text-xs">
            <div className="flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(245,242,234,0.06)] bg-[rgba(245,242,234,0.03)] px-2 py-2 text-center">
              <BedDouble className="h-3.5 w-3.5 text-soft" />
              <span>{product.bedrooms} KT</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(245,242,234,0.06)] bg-[rgba(245,242,234,0.03)] px-2 py-2 text-center">
              <Bath className="h-3.5 w-3.5 text-soft" />
              <span>{product.bathrooms} KM</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(245,242,234,0.06)] bg-[rgba(245,242,234,0.03)] px-2 py-2 text-center">
              <Scaling className="h-3.5 w-3.5 text-soft" />
              <span>{product.building_area} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}