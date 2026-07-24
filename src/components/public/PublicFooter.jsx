import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="border-t border-[rgba(212,175,55,0.2)] bg-[#101010]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <p className="section-label">Glory Maspro</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-soft">
            Tentukan pilihan property mu yang tepat hanya di Glory Maspro. Kami menyediakan kurasi terbaik untuk gaya hidup Anda.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-[0.22em] text-[#F5F2EA] uppercase">Tautan</h4>
          <ul className="mt-4 space-y-3 text-sm text-soft">
            <li>
              <Link to="/" className="text-[#6b7280] transition-colors duration-300 hover:text-[#e9d387] hover:drop-shadow-[0_0_8px_rgba(233,211,135,0.4)]">
                Katalog Properti
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-[0.22em] text-[#F5F2EA] uppercase">Kontak</h4>
          <div className="mt-4 space-y-2 text-sm text-soft">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#D4AF37]" />Jeonju City, Candi, Sidoarjo, East Java</p>
            {/* <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#D4AF37]" /> +62 812-3456-7890</p> */}
            {/* <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#D4AF37]" /> hello@glorymaspro.com</p> */}
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(244,211,94,0.06)] py-5 text-center text-xs uppercase tracking-[0.18em] text-soft">
        &copy; 2026 Glory Maspro. All rights reserved.
      </div>
    </footer>
  )
}