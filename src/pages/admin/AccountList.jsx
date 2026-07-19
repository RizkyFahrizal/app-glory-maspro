import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Plus, MapPin, Phone, Mail, Pencil, Trash2, ChevronUp, ChevronDown, BadgeCheck, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { dummyAccounts } from '../../data/dummyAccounts'

export default function AccountList() {
  const adminAccs = dummyAccounts.filter(acc => acc.role === 'Admin')
  const marketingAccs = dummyAccounts.filter(acc => acc.role === 'Marketing')
  
  const [marketingQueue, setMarketingQueue] = useState(marketingAccs)

  const [accountToDelete, setAccountToDelete] = useState(null)
  const [showSuccessDelete, setShowSuccessDelete] = useState(false)

  const handleDelete = () => {
    setShowSuccessDelete(true)
    setAccountToDelete(null)
    setTimeout(() => setShowSuccessDelete(false), 2000)
  }

  const moveUp = (index) => {
    if (index === 0) return
    const newQueue = [...marketingQueue]
    const temp = newQueue[index]
    newQueue[index] = newQueue[index - 1]
    newQueue[index - 1] = temp
    setMarketingQueue(newQueue)
  }

  const moveDown = (index) => {
    if (index === marketingQueue.length - 1) return
    const newQueue = [...marketingQueue]
    const temp = newQueue[index]
    newQueue[index] = newQueue[index + 1]
    newQueue[index + 1] = temp
    setMarketingQueue(newQueue)
  }

  const renderCard = (account, index = null, isMarketing = false) => {
    const isCurrentTurn = isMarketing && index === 0

    return (
      <div 
        key={account.id} 
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
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1 text-soft transition hover:text-[#C9AA4A] disabled:opacity-30 disabled:hover:text-soft"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button 
                onClick={() => moveDown(index)}
                disabled={index === marketingQueue.length - 1}
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
            onClick={() => setAccountToDelete(account)}
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

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#F5F2EA]">Kelola Akun & Distribusi Leads</h1>
          <p className="mt-2 text-sm text-soft">Manajemen staf dan urutan antrean leads Marketing.</p>
        </div>
        
        <Link 
          to="/admin/accounts/create"
          className="btn-gold flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition md:justify-start"
        >
          <Plus className="h-5 w-5" /> Tambah Akun Baru
        </Link>
      </div>

      {/* Admin Section */}
      <div className="mt-10">
        <h2 className="mb-6 text-lg font-semibold tracking-wide text-[#F5F2EA]">Tim Admin</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adminAccs.map((account) => renderCard(account))}
        </div>
      </div>

      {/* Marketing Queue Section */}
      <div className="mt-12">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-wide text-[#F5F2EA]">Antrean Tim Marketing (Round-Robin)</h2>
            <p className="mt-1 text-xs text-soft">Arahkan kursor ke kartu untuk menaik-turunkan urutan antrean.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {marketingQueue.map((account, index) => renderCard(account, index, true))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {accountToDelete && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-[2rem] p-8 text-center border border-[rgba(244,211,94,0.08)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-400/10 text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-[#F5F2EA]">Hapus Akun?</h3>
            <p className="mt-2 text-sm text-soft">
              Apakah Anda yakin ingin menghapus <strong>{accountToDelete.name}</strong> dari sistem? Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-4">
              <button 
                onClick={() => setAccountToDelete(null)}
                className="rounded-2xl px-6 py-3 text-sm font-medium text-soft transition hover:text-[#F5F2EA]"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                className="rounded-2xl bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Success Notification Modal */}
      {showSuccessDelete && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center border border-[rgba(244,211,94,0.08)]">
            <CheckCircle2 className="mb-4 h-12 w-12 text-[#C9AA4A]" />
            <h3 className="text-xl font-semibold text-[#F5F2EA]">Berhasil Dihapus</h3>
            <p className="mt-2 text-sm text-soft">Data akun telah dihapus dari sistem.</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
