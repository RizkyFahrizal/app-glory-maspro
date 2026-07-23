import { Menu } from 'lucide-react'

export default function AdminTopbar({ onMenuClick }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-[rgba(212,175,55,0.2)] bg-[#FCFAF5]/80 px-4 backdrop-blur-xl md:hidden">
      <h2 className="text-lg font-semibold tracking-widest text-[#1F2937]">GLORY MASPRO</h2>
      <button onClick={onMenuClick} className="p-2 text-[#B8860B] transition hover:text-[#D4AF37]">
        <Menu className="h-6 w-6" />
      </button>
    </div>
  )
}
