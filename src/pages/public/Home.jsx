import { useState, useEffect } from 'react'
import axios from 'axios'
import logoHero from '../../assets/public/logo-glory-maspro.webp'
import ProductCard from '../../components/public/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then((response) => {
        setProducts(response.data.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Ada error saat mengambil data:', error)
        setLoading(false)
      })
  }, [])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(products.length / itemsPerPage)

  return (
    <>
      <div className="glass-panel relative mb-10 overflow-hidden rounded-[2rem] border border-[rgba(245,242,234,0.08)]">
        <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-10">
          <div className="flex flex-col justify-center">
            <p className="section-label">Katalog Properti Premium</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-[#F5F2EA] md:text-6xl">
              Cukup di satu tempat temukan property yang tepat
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-soft md:text-base">
              Tentukan pilihan property mu yang tepat hanya di Glory Maspro.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-soft">
              <span className="rounded-full border border-[rgba(245,242,234,0.08)] bg-[rgba(245,242,234,0.03)] px-4 py-2">Rumah KPR</span>
              <span className="rounded-full border border-[rgba(245,242,234,0.08)] bg-[rgba(245,242,234,0.03)] px-4 py-2">Murah</span>
              <span className="rounded-full border border-[rgba(245,242,234,0.08)] bg-[rgba(245,242,234,0.03)] px-4 py-2">Nyaman</span>
            </div>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-[1.75rem] border border-[rgba(245,242,234,0.08)]">
            <img
                src={logoHero}
                alt="Hero Properti"
                className="h-full w-full object-cover opacity-72"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/20 to-transparent" />
          </div>
        </div>
      </div>

      <div className="glass-panel mb-9 flex flex-col gap-4 rounded-[1.75rem] p-4 md:flex-row md:items-center md:p-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9AA4A]">🔍</span>
          <input
            type="text"
            placeholder="Cari lokasi atau nama perumahan..."
            className="input-minimal w-full rounded-2xl py-3 pl-12 pr-4 transition"
          />
        </div>
        <button className="btn-gold rounded-2xl px-8 py-3 transition">
          Cari
        </button>
        <button className="btn-ghost flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition">
          ⚙️ Filter
        </button>
      </div>

      {/* <div className="mb-8 flex items-end justify-between p-5 md:p-6">
        <div>
          <p className="section-label">Katalog</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#F5F2EA] md:text-3xl">
            Katalog Properti Terbaru
          </h2>
        </div>
      </div> */}

      {loading ? (
        <div className="mt-20 mb-40 text-center text-lg font-medium text-[#E7D48A]">
          Sedang memuat data properti eksklusif...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((product) => (
            // Panggil komponen ProductCard dan lemparkan data product-nya via props
            <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 mb-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${currentPage === 1 ? 'cursor-not-allowed border border-[rgba(245,242,234,0.06)] bg-[rgba(245,242,234,0.03)] text-[rgba(245,242,234,0.35)]' : 'btn-gold'}`}
              >
                ← Prev
              </button>

              <span className="rounded-full border border-[rgba(245,242,234,0.08)] bg-[#202020] px-4 py-2 text-sm font-semibold text-[#F5F2EA]">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${currentPage === totalPages ? 'cursor-not-allowed border border-[rgba(245,242,234,0.06)] bg-[rgba(245,242,234,0.03)] text-[rgba(245,242,234,0.35)]' : 'btn-gold'}`}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}