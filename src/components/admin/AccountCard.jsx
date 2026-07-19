import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Pencil, Trash2, ChevronUp, ChevronDown, BadgeCheck } from 'lucide-react'

export default function AccountCard({ 
  account, 
  index = null, 
  isMarketing = false, 
  isCurrentTurn = false,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  onDelete
}) {
  return (
    <div 
      className={`glass-panel group relative flex flex-col overflow-hidden rounded-[2rem] border p-6 transition-all ${
        isCurrentTurn 
          ? 'border-[#C9AA4A] shadow-[0_0_20px_rgba(201,170,74,0.15)] bg-[rgba(201,170,74,0.03)]' 
          : 'border-[rgba(244,211,94,0.08)] hover:border-[rgba(244,211,94,0.2)]'
      }`}
    >
      {/* Sequence & Navigation (Marketing Only) */}
      {isMarketing && (
        <div className="absolute left-6 top-6 z-10 flex flex-col items-center gap-1">
          <span className={`flex h-8 w-8 items-center justify-center rounded-full font-bold backdrop-blur-sm border ${
            isCurrentTurn 
              ? 'bg-[#C9AA4A] text-[#101010] border-[#C9AA4A]' 
              : 'bg-[#101010]/80 text-[#F5F2EA] border-[rgba(244,211,94,0.2)]'
          }`}>
            #{index + 1}
          </span>
          <div className="flex flex-col mt-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button 
              onClick={() => onMoveUp(index)}
              disabled={isFirst}
              className="p-1 text-soft transition hover:text-[#C9AA4A] disabled:opacity-30 disabled:hover:text-soft"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onMoveDown(index)}
              disabled={isLast}
              className="p-1 text-soft transition hover:text-[#C9AA4A] disabled:opacity-30 disabled:hover:text-soft"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons (Hover) */}
      <div className="absolute right-4 top-4 z-10 flex opacity-0 transition-opacity group-hover:opacity-100">
        <Link 
          to={`/admin/accounts/edit/${account.id}`}
          className="rounded-full bg-[#101010]/80 p-2 text-soft backdrop-blur-sm transition hover:text-[#C9AA4A]"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button 
          onClick={() => onDelete(account)}
          className="rounded-full bg-[#101010]/80 p-2 text-soft backdrop-blur-sm transition hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Profile Header */}
      <div className={`flex items-center gap-4 ${isMarketing ? 'ml-12' : ''}`}>
        <img 
          src={account.photo} 
          alt={account.name} 
          className="h-16 w-16 rounded-full border-2 border-[rgba(244,211,94,0.1)] object-cover"
        />
        <div>
          <h3 className="text-lg font-bold text-[#F5F2EA]">{account.name}</h3>
          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
            account.role === 'Admin' 
              ? 'bg-[#C9AA4A]/10 text-[#C9AA4A]' 
              : 'bg-blue-400/10 text-blue-400'
          }`}>
            {account.role}
          </span>
        </div>
      </div>

      {/* Position & Current Turn Indicator */}
      <div className="mt-6 mb-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-soft">Jabatan</p>
          <p className="mt-1 font-medium text-[#F5F2EA]">{account.position}</p>
        </div>
        {isCurrentTurn && (
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#C9AA4A]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C9AA4A] shadow-sm">
            <BadgeCheck className="h-3 w-3" />
            Giliran Saat Ini
          </div>
        )}
      </div>

      <hr className="my-4 border-[rgba(244,211,94,0.05)]" />

      {/* Contact Details */}
      <div className="flex flex-col gap-3 text-sm text-soft">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-[#C9AA4A]" />
          <span>{account.coverage_area}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-[#C9AA4A]" />
          <span>{account.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-[#C9AA4A]" />
          <span className="truncate">{account.email}</span>
        </div>
      </div>
    </div>
  )
}
