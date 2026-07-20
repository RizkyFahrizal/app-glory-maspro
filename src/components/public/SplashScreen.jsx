import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true)
    }, 2000)

    // Remove from DOM entirely after 2.5 seconds (allowing 500ms for the fade transition)
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAFAFA] transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl border border-[rgba(212,175,55,0.2)]">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#D4AF37] border-r-[#D4AF37] animate-spin"></div>
          <span className="text-3xl font-bold tracking-widest text-[#D4AF37]">G</span>
        </div>
        <h1 className="mt-8 text-2xl font-semibold tracking-[0.3em] text-[#1F2937]">GLORY MASPRO</h1>
        <p className="mt-2 text-sm font-medium tracking-widest text-[#B8860B]">PROPERTY COLLECTION</p>
      </div>
    </div>
  )
}
