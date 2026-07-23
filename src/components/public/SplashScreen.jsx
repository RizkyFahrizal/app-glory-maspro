import { useEffect, useLayoutEffect, useState } from 'react'
import logoGlory from '../../assets/public/logo-glory-maspro.webp'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)

  // useLayoutEffect runs synchronously before browser paint to prevent scrollbar flash
  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  useEffect(() => {

    // Trigger entry animations shortly after mount
    const enterTimer = setTimeout(() => {
      setIsAnimatingIn(true)
    }, 100)

    // Start fading out after 2.2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
      // Allow scrolling right as the splash screen fades out to avoid sudden jump
      document.body.style.overflow = 'auto'
    }, 2200)

    // Remove from DOM entirely after 3 seconds
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#ffe055] via-[#E8D080] to-[#ffe055] transition-all duration-700 ease-in-out ${isFadingOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
    >
      {/* Decorative ambient light (optimized with radial gradient instead of blur) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)' }} />
      </div>

      <div className={`relative flex flex-col items-center justify-center transition-all duration-1000 ease-out transform will-change-transform ${isAnimatingIn ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>

        {/* Logo Image with rings (optimized shadows) */}
        <div className="relative flex h-32 w-32 items-center justify-center shadow-xl rounded-full">
          <img
            src={logoGlory}
            alt="Glory Maspro Logo"
            className="relative z-10 h-full w-full object-contain p-2 bg-white/20 rounded-full"
          />
          {/* Subtle glowing ring behind the logo (optimized) */}
          <div className="absolute inset-0 rounded-full bg-white/30 shadow-[0_0_40px_rgba(255,255,255,0.6)] -z-10 animate-pulse" />

          {/* Spinning Rings */}
          <div className="absolute -inset-2 rounded-full border-2 border-transparent border-t-[#D4AF37] border-r-[#D4AF37]/40 animate-[spin_3s_linear_infinite]" />
          <div className="absolute -inset-4 rounded-full border-2 border-transparent border-b-[#FFFFFF]/90 border-l-[#FFFFFF]/30 animate-[spin_4s_linear_infinite_reverse]" />
        </div>

        {/* Text */}
        <div className={`mt-6 flex flex-col items-center transition-all duration-1000 delay-300 ease-out ${isAnimatingIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-3xl font-bold tracking-[0.35em] text-[#2C1A00] drop-shadow-sm">
            GLORY MASPRO
          </h1>
          <div className="mt-3 h-[1px] w-16 bg-gradient-to-r from-transparent via-[#4A3000] to-transparent opacity-40" />
          <p className="mt-3 text-xs font-bold tracking-[0.4em] text-[#4A3000]/80 uppercase">
            Property Collection
          </p>
        </div>
      </div>
    </div>
  )
}
