import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="border-t border-[rgba(244,211,94,0.12)] bg-[#0A0A0A]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <p className="section-label">Glory Maspro</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-soft">
            Properti minimalis dengan presentasi bersih, informasi jelas, dan nuansa premium yang tetap nyaman dilihat.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-[0.22em] text-[#F8F8F8] uppercase">Tautan</h4>
          <ul className="mt-4 space-y-3 text-sm text-soft">
            <li>
              <Link to="/" className="transition hover:text-[#F4D35E]">
                Katalog Properti
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-[0.22em] text-[#F8F8F8] uppercase">Kontak</h4>
          <div className="mt-4 space-y-2 text-sm text-soft">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#F4D35E]" /> Jl. Raya Properti No. 123, Surabaya</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#F4D35E]" /> +62 812-3456-7890</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#F4D35E]" /> hello@glorymaspro.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(248,248,248,0.06)] py-5 text-center text-xs uppercase tracking-[0.18em] text-soft">
        &copy; 2026 Glory Maspro. All rights reserved.
      </div>
    </footer>
  )
}