import { Outlet } from 'react-router-dom'
import PublicNavbar from '../components/public/PublicNavbar'
import PublicFooter from '../components/public/PublicFooter'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e9d387] via-[#f9e7a9] to-[#e9d387] text-[#1F2937]">
      {/* Decorative background layer */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {/* Warm gold gradient blobs for depth */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-[#F5D87A]/30 blur-[100px]" />
        <div className="absolute top-1/3 -right-20 h-[350px] w-[350px] rounded-full bg-[#C9A84C]/20 blur-[80px]" />
        <div className="absolute bottom-0 -left-20 h-[300px] w-[400px] rounded-full bg-[#D4AF37]/15 blur-[80px]" />

        {/* SVG dot pattern */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#7A5C00" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Subtle shimmer line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5D87A]/50 to-transparent" />
      </div>

      <PublicNavbar />

      <main className="relative mx-auto w-full max-w-7xl flex-1 px-6 pt-4 pb-10" style={{ zIndex: 1 }}>
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  )
}