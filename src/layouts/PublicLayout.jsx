import { Outlet } from 'react-router-dom'
import PublicNavbar from '../components/public/PublicNavbar'
import PublicFooter from '../components/public/PublicFooter'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#F8F8F8]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-10">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  )
}