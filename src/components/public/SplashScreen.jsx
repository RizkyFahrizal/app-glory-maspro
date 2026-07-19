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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#101010] transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="animate-fade-in mb-1 text-4xl font-bold tracking-widest text-[#E7D48A] md:text-5xl lg:text-6xl">
          GLORY MASPRO
        </h1>
        <div className="mt-4 h-[1px] w-0 animate-[expand-width_1s_ease-in-out_forwards] bg-gradient-to-r from-transparent via-[#C9AA4A] to-transparent" />
        <p className="mt-4 text-xs tracking-[0.3em] text-soft opacity-0 animate-[fade-in_1s_ease-in-out_0.5s_forwards]">
          PREMIUM PROPERTY EXCELLENCE
        </p>
      </div>
    </div>
  )
}
