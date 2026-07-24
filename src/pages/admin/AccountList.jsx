import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Plus, Search, X, SearchX, RefreshCcw } from 'lucide-react'
import axios from 'axios'
import AccountCard from '../../components/admin/AccountCard'
import SuccessModal from '../../components/admin/SuccessModal'
import DeleteModal from '../../components/admin/DeleteModal'
import AlertModal from '../../components/admin/AlertModal'
import RoleNotice from '../../components/admin/RoleNotice'

const SkeletonAccountCard = () => (
  <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(0,0,0,0.04)] bg-gradient-to-br from-white to-[#FDF5D3]/50 p-6 shadow-sm">
    <div className="flex animate-pulse items-center gap-4 border-b border-[rgba(0,0,0,0.06)] pb-6">
      <div className="h-16 w-16 rounded-full bg-gray-200"></div>
      <div className="flex-1 space-y-3">
        <div className="h-5 w-3/4 rounded-md bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded-md bg-gray-200"></div>
      </div>
    </div>
    <div className="mt-6 animate-pulse space-y-4">
      <div className="flex items-center gap-3"><div className="h-4 w-4 rounded-full bg-gray-200"></div><div className="h-4 w-1/2 rounded-md bg-gray-200"></div></div>
      <div className="flex items-center gap-3"><div className="h-4 w-4 rounded-full bg-gray-200"></div><div className="h-4 w-2/3 rounded-md bg-gray-200"></div></div>
    </div>
  </div>
)

const EmptyState = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[rgba(0,0,0,0.1)] bg-gradient-to-br from-white to-[#FDF5D3]/50 py-16 text-center shadow-sm backdrop-blur-sm col-span-full">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#B8860B]">
      <SearchX className="h-8 w-8" />
    </div>
    <h3 className="mb-2 text-lg font-bold text-[#1F2937]">Akun Tidak Ditemukan</h3>
    <p className="mb-6 max-w-md text-sm text-soft">
      Tidak ada data akun yang cocok dengan kata kunci pencarian Anda. Coba gunakan kata kunci lain.
    </p>
    <button
      onClick={onReset}
      className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-[#1F2937] transition hover:bg-gray-200"
    >
      Bersihkan Pencarian
    </button>
  </div>
)

export default function AccountList() {
  const [adminSearch, setAdminSearch] = useState('')
  const [marketingSearch, setMarketingSearch] = useState('')
  const [adminAccounts, setAdminAccounts] = useState([])
  const [marketingQueue, setMarketingQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' })

  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const isMarketing = userData.role?.toLowerCase() === 'marketing'
  const location = useLocation()
  const wasRedirected = location.state?.restricted

  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchAccounts()
    // Auto-refresh interval (10 detik)
    const intervalId = setInterval(() => {
      fetchAccounts(false) // false means background refresh, no loading screen
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchAccounts = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const token = localStorage.getItem('token') || ''
      const res = await axios.get('https://api.glorymaspro.biz.id/api/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data && res.data.success) {
        const users = res.data.data
        setAdminAccounts(users.filter(u => u.role?.toLowerCase() === 'admin' || u.name === 'Super Admin'))
        const marketingUsers = users.filter(u => u.role?.toLowerCase() === 'marketing')
        marketingUsers.sort((a, b) => {
          const qA = a.wa_marketing?.queue_order || 0
          const qB = b.wa_marketing?.queue_order || 0
          return qA - qB
        })
        setMarketingQueue(marketingUsers)
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await fetchAccounts(false)
    setTimeout(() => setIsRefreshing(false), 500) // Animasi putar minimum 500ms
  }

  const [accountToDelete, setAccountToDelete] = useState(null)
  const [showSuccessDelete, setShowSuccessDelete] = useState(false)

  const confirmDelete = async () => {
    if (!accountToDelete) return

    try {
      const token = localStorage.getItem('token') || ''
      await axios.delete(`https://api.glorymaspro.biz.id/api/accounts/${accountToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowSuccessDelete(true)
      setTimeout(() => setShowSuccessDelete(false), 2000)
      fetchAccounts() // Refresh list after delete
    } catch (error) {
      console.error('Failed to delete account:', error)
      setAlertInfo({ isOpen: true, title: 'Gagal Menghapus', message: error.response?.data?.message || 'Gagal menghapus akun.' })
    } finally {
      setAccountToDelete(null)
    }
  }

  const saveReorder = async (queue) => {
    try {
      const token = localStorage.getItem('token') || ''
      const orderedIds = queue.map(acc => acc.wa_marketing?.id).filter(Boolean)
      if (orderedIds.length > 0) {
        await axios.post('https://api.glorymaspro.biz.id/api/wa-marketing/reorder', { ordered_ids: orderedIds }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('Failed to reorder:', error)
    }
  }

  const moveUp = (index) => {
    if (index === 0) return
    const newQueue = [...marketingQueue]
    const temp = newQueue[index]
    newQueue[index] = newQueue[index - 1]
    newQueue[index - 1] = temp
    setMarketingQueue(newQueue)
    saveReorder(newQueue)
  }

  const moveDown = (index) => {
    if (index === marketingQueue.length - 1) return
    const newQueue = [...marketingQueue]
    const temp = newQueue[index]
    newQueue[index] = newQueue[index + 1]
    newQueue[index + 1] = temp
    setMarketingQueue(newQueue)
    saveReorder(newQueue)
  }

  const filteredAdmin = adminAccounts.filter(acc =>
    acc.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    acc.email.toLowerCase().includes(adminSearch.toLowerCase())
  )

  const filteredMarketing = marketingQueue.filter(acc =>
    acc.name.toLowerCase().includes(marketingSearch.toLowerCase()) ||
    acc.email.toLowerCase().includes(marketingSearch.toLowerCase())
  )

  const getCurrentTurnId = () => {
    if (marketingQueue.length === 0) return null
    // Cari yang is_next_in_queue = true
    const nextAcc = marketingQueue.find(acc => acc.wa_marketing?.is_next_in_queue)
    if (nextAcc) return nextAcc.id

    // Fallback: Jika tidak ada, kembalikan urutan pertama (queue_order terkecil)
    return marketingQueue[0].id
  }

  const currentTurnId = getCurrentTurnId()

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Kelola Akun</h1>
          <p className="mt-2 text-sm text-soft">Manajemen akses admin dan tim marketing.</p>
        </div>

        {!isMarketing && (
          <Link
            to="/admin/accounts/create"
            className="btn-gold flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition"
          >
            <Plus className="h-5 w-5" /> Tambah Akun Baru
          </Link>
        )}
      </div>

      {(isMarketing || wasRedirected) && (
        <RoleNotice message="Role Marketing hanya dapat melihat data akun. Tambah, ubah, dan hapus akun hanya bisa dilakukan oleh Admin." />
      )}

      {/* Admin Section Box */}
      <div className="mt-8 rounded-3xl bg-white p-6 md:p-8 border border-[rgba(0,0,0,0.06)] shadow-sm">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-bold text-[#1F2937]">Tim Admin</h2>
          <div className="relative w-full max-w-sm sm:w-64">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Cari admin..."
              className="input-minimal w-full rounded-2xl py-3 pl-12 pr-10 text-sm bg-gray-50 border border-[rgba(0,0,0,0.05)] focus:bg-white"
            />
            {adminSearch && (
              <button
                onClick={() => setAdminSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <SkeletonAccountCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAdmin.length > 0 ? (
              filteredAdmin.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  isViewerMarketing={isMarketing}
                  onDelete={() => setAccountToDelete(account)}
                />
              ))
            ) : (
              <EmptyState onReset={() => setAdminSearch('')} />
            )}
          </div>
        )}
      </div>

      {/* Marketing Section Box */}
      <div className="mt-8 mb-10 rounded-3xl bg-white p-6 md:p-8 border border-[rgba(0,0,0,0.06)] shadow-sm">
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-[rgba(0,0,0,0.06)] pb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Tim Marketing</h2>
            <p className="mt-2 text-sm text-soft max-w-xl">
              Informasi Tim Marketing Sekaligus Petunjuk Sistem Urutan Prospek Client Masuk.
            </p>
          </div>

          <div className="flex w-full max-w-sm sm:w-auto items-center gap-2 shrink-0">
            <button
              onClick={handleManualRefresh}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-50 border border-[rgba(0,0,0,0.05)] text-gray-500 hover:bg-gray-100 hover:text-[#1F2937] transition-all"
              title="Perbarui urutan"
            >
              <RefreshCcw className={`h-5 w-5 ${isRefreshing ? 'animate-spin text-[#B8860B]' : ''}`} />
            </button>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={marketingSearch}
                onChange={(e) => setMarketingSearch(e.target.value)}
                placeholder="Cari marketing..."
                className="input-minimal w-full rounded-2xl py-3 pl-12 pr-10 text-sm bg-gray-50 border border-[rgba(0,0,0,0.05)] focus:bg-white"
              />
              {marketingSearch && (
                <button
                  onClick={() => setMarketingSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map(i => <SkeletonAccountCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredMarketing.length > 0 ? (
              filteredMarketing.map((account, index) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  index={index}
                  isMarketing={true}
                  isViewerMarketing={isMarketing}
                  viewerAccountId={userData.id}
                  isCurrentTurn={account.id === currentTurnId}
                  isFirst={index === 0}
                  isLast={index === marketingQueue.length - 1}
                  onMoveUp={() => moveUp(index)}
                  onMoveDown={() => moveDown(index)}
                  onDelete={() => setAccountToDelete(account)}
                />
              ))
            ) : (
              <EmptyState onReset={() => setMarketingSearch('')} />
            )}
          </div>
        )}
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

      <AlertModal
        isOpen={alertInfo.isOpen}
        title={alertInfo.title}
        message={alertInfo.message}
        onOk={() => setAlertInfo({ ...alertInfo, isOpen: false })}
      />
    </div>
  )
}
