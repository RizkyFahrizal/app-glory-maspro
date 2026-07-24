import { ImagePlus, X } from 'lucide-react'

export default function ProductImageUploader({
  isView,
  isEdit,
  existingImages,
  newImagePreviews,
  onImageChange,
  onSetImageToDelete,
  onRemoveNewImage
}) {
  return (
    <div className="mt-8 border-t border-[rgba(0,0,0,0.06)] pt-8">
      <h2 className="mb-4 text-lg font-bold text-[#1F2937]">Media Properti (Foto & Video)</h2>

      {(isEdit || isView) && existingImages.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-soft">Media Saat Ini:</p>
          <div className="flex flex-wrap gap-4">
            {existingImages.map(img => (
              <div key={img.id} className="relative h-32 w-32 rounded-xl border border-[rgba(0,0,0,0.1)] shadow-sm overflow-hidden group">
                {img.image_path.endsWith('.webm') || img.image_path.endsWith('.mp4') ? (
                  <video src={img.image_path} className="h-full w-full object-cover" muted loop playsInline autoPlay />
                ) : (
                  <img src={img.image_path} alt="Existing" className="h-full w-full object-cover" />
                )}
                {!isView && (
                  <button
                    type="button"
                    onClick={() => onSetImageToDelete(img.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-600"
                    title="Hapus media ini"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isView && (
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-soft">Tambahkan Media Baru:</p>
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(0,0,0,0.1)] bg-[#F9FAFB] py-12 transition hover:bg-[#F3F4F6] cursor-pointer">
            <ImagePlus className="mb-3 h-8 w-8 text-[#D4AF37]" />
            <p className="text-sm font-medium text-[#1F2937]">Klik untuk unggah foto & video</p>
            <p className="mt-1 text-xs text-soft text-center px-4">Maks 7 media (PNG/JPG up to 5MB, maks. 1 video WebM/MP4 up to 15MB)</p>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp, video/webm, video/mp4"
              onChange={onImageChange}
              className="hidden"
              disabled={isView}
            />
          </label>
        </div>
      )}

      {newImagePreviews.length > 0 && !isView && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-soft">Pratinjau Media Baru:</p>
          <div className="flex flex-wrap gap-4">
            {newImagePreviews.map((preview, idx) => (
              <div key={idx} className="relative h-32 w-32 rounded-xl border border-[rgba(0,0,0,0.1)] shadow-sm overflow-hidden group">
                {preview.type === 'video' ? (
                  <video src={preview.url} className="h-full w-full object-cover" muted loop playsInline autoPlay />
                ) : (
                  <img src={preview.url} alt={`Preview ${idx}`} className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => onRemoveNewImage(idx)}
                  className="absolute top-2 right-2 bg-gray-800/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-gray-900"
                  title="Batal unggah file ini"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
