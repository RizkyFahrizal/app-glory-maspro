import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductLightbox({
  isOpen,
  onClose,
  images,
  lightboxIndex,
  setLightboxIndex
}) {
  if (!isOpen || images.length === 0) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in" onClick={onClose}>
      {/* Close Btn */}
      <button
        onClick={onClose}
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
  )
}
