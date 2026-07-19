import { Link } from 'react-router-dom'

export default function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(244,211,94,0.12)] bg-[#0A0A0A]/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className="section-label">Property Collection</p>
          <h1 className="mt-1 text-xl font-semibold tracking-[0.28em] text-[#F4D35E] md:text-2xl">
            GLORY MASPRO
          </h1>
        </div>

        <Link to="/admin" className="btn-gold rounded-full px-5 py-2 text-sm transition md:px-6">
          Login
        </Link>
      </div>
    </nav>
  )
}