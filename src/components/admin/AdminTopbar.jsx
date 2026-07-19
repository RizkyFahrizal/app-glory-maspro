import { Menu } from 'lucide-react'

export default function AdminTopbar({ onMenuClick }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-[rgba(244,211,94,0.12)] bg-[#0A0A0A]/90 px-4 backdrop-blur-md md:hidden">
      <h2 className="text-lg font-semibold tracking-widest text-[#F5F2EA]">GLORY MASPRO</h2>
      <button onClick={onMenuClick} className="p-2 text-[#C9AA4A] transition hover:text-[#F5F2EA]">
        <Menu className="h-6 w-6" />
      </button>
    </div>
  )
}
