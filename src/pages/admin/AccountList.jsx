import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { dummyAccounts } from '../../data/dummyAccounts'
import AccountCard from '../../components/admin/AccountCard'
import SuccessModal from '../../components/admin/SuccessModal'
import DeleteModal from '../../components/admin/DeleteModal'

export default function AccountList() {
  const adminAccs = dummyAccounts.filter(acc => acc.role === 'Admin')
  const marketingAccs = dummyAccounts.filter(acc => acc.role === 'Marketing')
  
  const [adminAccounts] = useState(adminAccs)
  const [marketingQueue, setMarketingQueue] = useState(marketingAccs)

  const [accountToDelete, setAccountToDelete] = useState(null)
  const [showSuccessDelete, setShowSuccessDelete] = useState(false)

  const confirmDelete = () => {
    setAccountToDelete(null)
    setShowSuccessDelete(true)
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

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#F5F2EA]">Kelola Akun</h1>
          <p className="mt-2 text-sm text-soft">Manajemen akses admin dan tim marketing.</p>
        </div>
        
        <Link 
          to="/admin/accounts/create" 
          className="btn-gold flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition"
        >
          <Plus className="h-5 w-5" /> Tambah Akun Baru
        </Link>
      </div>

      {/* Admin Section */}
      <div className="mt-10">
        <h2 className="mb-6 text-xl font-bold text-[#F5F2EA]">Tim Admin</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminAccounts.map((account) => (
            <AccountCard 
              key={account.id} 
              account={account} 
              onDelete={() => setAccountToDelete(account)}
            />
          ))}
        </div>
      </div>

      <hr className="my-10 border-[rgba(244,211,94,0.08)]" />

      {/* Marketing Section */}
      <div className="mb-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#F5F2EA]">Antrean Tim Marketing (Round-Robin)</h2>
          <p className="mt-1 text-sm text-soft">
            Urutan penerimaan prospek. Nomor urut #1 akan menerima prospek (leads) berikutnya.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          {marketingQueue.map((account, index) => (
            <AccountCard 
              key={account.id}
              account={account}
              index={index}
              isMarketing={true}
              isCurrentTurn={index === 0}
              isFirst={index === 0}
              isLast={index === marketingQueue.length - 1}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
              onDelete={() => setAccountToDelete(account)}
            />
          ))}
        </div>
      </div>

      <DeleteModal 
        isOpen={!!accountToDelete}
        itemName={accountToDelete?.name}
        onCancel={() => setAccountToDelete(null)}
        onConfirm={confirmDelete}
      />

      <SuccessModal 
        isOpen={showSuccessDelete}
        title="Berhasil Dihapus"
        message="Akun pengguna telah dihapus dari sistem."
      />
    </div>
  )
}
