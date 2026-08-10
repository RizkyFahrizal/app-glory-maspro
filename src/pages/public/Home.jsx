import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building2, Users, Trophy, ArrowRight, MapPin, Search, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react'
import Katalog from './Katalog'

// Dummy Data untuk Proyek
const projects = [
  {
    id: 1,
    name: 'PT Lentera',
    description: 'Proyek perumahan eksklusif dengan fasilitas lengkap untuk keluarga modern yang mencari kenyamanan dan keamanan.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    facilities: ['One Gate System', 'Taman Bermain', 'Masjid', 'Security 24 Jam']
  },
  {
    id: 2,
    name: 'PT Kahuripan',
    description: 'Kawasan hunian asri dengan konsep hijau, menawarkan lingkungan yang sehat dan dekat dengan pusat perbelanjaan.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
    facilities: ['Jogging Track', 'Club House', 'Kolam Renang', 'Kawasan Hijau']
  }
]

// Dummy Data untuk Penghargaan
const awards = [
  {
    id: 1,
    title: 'Top Agent 2025',
    description: 'Penghargaan agen penjualan dengan volume transaksi tertinggi di wilayah Jawa Timur.',
    image: '/aboutbg.webp'
  },
  {
    id: 2,
    title: 'Sold Out Tercepat',
    description: 'Berhasil menjual habis 3 klaster perumahan hanya dalam waktu 6 bulan.',
    image: '/herobg.webp'
  },
  {
    id: 3,
    title: 'Pelayanan Terbaik',
    description: 'Tingkat kepuasan klien 99% dari tahap konsultasi hingga proses akad kredit KPR.',
    image: '/agentsbg.webp'
  }
]

export default function Home() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const catalogRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      const y = catalogRef.current.getBoundingClientRect().top + window.scrollY - 20; // Offset sedikit di atas tombol
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  const handleCariProperti = () => {
    setIsCatalogOpen(true)
    setTimeout(scrollToCatalog, 50)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-[#1F2937]">
        <div className="absolute inset-0">
          <img
            src="/herobg.webp"
            alt="Hero Background"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
              Wujudkan Hunian Impian Anda Bersama <span className="text-[#D4AF37]">Glory Maspro</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Kami adalah partner terpercaya Anda dalam menemukan properti terbaik, mulai dari perumahan komersial hingga subsidi dengan fasilitas unggulan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleCariProperti}
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-[#D4AF37]/30"
              >
                <Search className="w-5 h-5" /> Cari Properti Sekarang
              </button>
              <a
                href="#proyek"
                className="bg-transparent hover:bg-white text-white hover:text-[#1F2937] border-2 border-white px-8 py-4 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto text-center"
              >
                Lihat Proyek Kami
              </a>
            </div>

            {/* Social Media Links */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="https://instagram.com/glorymaspro"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,20,147,0.3)]"
              >
                <img src="/ig-icon.svg" alt="Instagram" className="w-full h-full object-contain" />
              </a>
              <a
                href="https://tiktok.com/@glory.maspro2"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300 text-black shadow-lg shadow-black/20 relative group"
              >
                <div className="relative w-6 h-6">
                  <svg viewBox="0 0 24 24" fill="#25F4EE" className="w-6 h-6 absolute -top-[1.5px] -left-[1.5px] transition-all group-hover:-top-[2px] group-hover:-left-[2px]">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04.15 1.53.85 3.01 2.11 3.82 1.34.86 3.03 1.01 4.54.91v4.06c-1.39-.12-2.76-.58-3.92-1.36-.2-.13-.39-.27-.58-.42v6.62c0 2.27-.67 4.58-2.12 6.32-1.6 1.95-3.99 3.09-6.49 3.16-2.52.07-5.06-.94-6.83-2.71-1.66-1.66-2.52-4.04-2.27-6.39.26-2.45 1.63-4.66 3.69-5.91 2.05-1.24 4.58-1.55 6.84-.87.49.15.96.34 1.4.58V12.6c-.46-.35-.98-.63-1.54-.8-.96-.31-2.02-.27-2.95.1-1.12.44-2.06 1.35-2.46 2.47-.44 1.25-.33 2.7.29 3.85.64 1.18 1.83 2.07 3.15 2.37 1.29.3 2.7.08 3.83-.57 1.07-.63 1.82-1.72 2.06-2.94.1-.5.13-1.02.13-1.53V0h-2.6z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="#FE2C55" className="w-6 h-6 absolute top-[1.5px] left-[1.5px] transition-all group-hover:top-[2px] group-hover:left-[2px]">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04.15 1.53.85 3.01 2.11 3.82 1.34.86 3.03 1.01 4.54.91v4.06c-1.39-.12-2.76-.58-3.92-1.36-.2-.13-.39-.27-.58-.42v6.62c0 2.27-.67 4.58-2.12 6.32-1.6 1.95-3.99 3.09-6.49 3.16-2.52.07-5.06-.94-6.83-2.71-1.66-1.66-2.52-4.04-2.27-6.39.26-2.45 1.63-4.66 3.69-5.91 2.05-1.24 4.58-1.55 6.84-.87.49.15.96.34 1.4.58V12.6c-.46-.35-.98-.63-1.54-.8-.96-.31-2.02-.27-2.95.1-1.12.44-2.06 1.35-2.46 2.47-.44 1.25-.33 2.7.29 3.85.64 1.18 1.83 2.07 3.15 2.37 1.29.3 2.7.08 3.83-.57 1.07-.63 1.82-1.72 2.06-2.94.1-.5.13-1.02.13-1.53V0h-2.6z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="#000000ff" className="w-6 h-6 absolute top-0 left-0 relative z-10">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04.15 1.53.85 3.01 2.11 3.82 1.34.86 3.03 1.01 4.54.91v4.06c-1.39-.12-2.76-.58-3.92-1.36-.2-.13-.39-.27-.58-.42v6.62c0 2.27-.67 4.58-2.12 6.32-1.6 1.95-3.99 3.09-6.49 3.16-2.52.07-5.06-.94-6.83-2.71-1.66-1.66-2.52-4.04-2.27-6.39.26-2.45 1.63-4.66 3.69-5.91 2.05-1.24 4.58-1.55 6.84-.87.49.15.96.34 1.4.58V12.6c-.46-.35-.98-.63-1.54-.8-.96-.31-2.02-.27-2.95.1-1.12.44-2.06 1.35-2.46 2.47-.44 1.25-.33 2.7.29 3.85.64 1.18 1.83 2.07 3.15 2.37 1.29.3 2.7.08 3.83-.57 1.07-.63 1.82-1.72 2.06-2.94.1-.5.13-1.02.13-1.53V0h-2.6z" />
                  </svg>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tentang Kami Text */}
      <section className="py-24 px-6 relative bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#B8860B] uppercase mb-3">Tentang Kami</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-6 leading-tight">
              Dedikasi Membangun Masa Depan Properti Indonesia
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              Glory Maspro didirikan dengan visi untuk memberikan kemudahan akses kepemilikan rumah bagi seluruh lapisan masyarakat. Berbekal pengalaman bertahun-tahun, kami telah bekerja sama dengan developer-developer terkemuka untuk memasarkan proyek perumahan berkualitas yang strategis dan bernilai investasi tinggi.
            </p>
            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
              Prinsipal kami memiliki standar ketat dalam menyeleksi setiap proyek, memastikan bahwa hanya hunian dengan legalitas jelas, fasilitas memadai, dan konstruksi terbaik yang kami tawarkan kepada Anda.
            </p>

            <div className="flex items-center justify-center gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold text-[#D4AF37]">10+</span>
                <span className="text-sm md:text-base text-gray-500 font-medium mt-2">Tahun Pengalaman</span>
              </div>
              <div className="w-px h-16 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold text-[#D4AF37]">1000+</span>
                <span className="text-sm md:text-base text-gray-500 font-medium mt-2">Keluarga Bahagia</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pimpinan Organisasi */}
      <section className="w-full bg-white pb-16 flex justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <img
            src="/agentsbg.webp"
            alt="Tim Glory Maspro"
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#D4AF37] text-white shadow-xl hover:bg-[#B8860B] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Pencapaian Proyek */}
      <section className="py-20 bg-[#1F2937] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3">Pencapaian Kami</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Penjualan Terbaik & Terpercaya</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm group"
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={award.image}
                    alt={award.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-8 text-center">
                  <h4 className="text-xl font-bold mb-3 text-white">{award.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {award.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daftar Proyek */}
      <section id="proyek" className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#B8860B] uppercase mb-3">Portofolio Kami</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-[#1F2937]">Semua Proyek</h3>
            </div>
            {/* 
            Link Katalog di kanan atas disembunyikan sesuai desain baru 
            (sekarang ada tombol accordion di bawah)
            <Link 
              to="/katalog" 
              className="group flex items-center gap-2 text-[#D4AF37] font-semibold hover:text-[#B8860B] transition"
            >
              Lihat Semua Katalog Produk
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link> 
            */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-gray-50 border border-[rgba(0,0,0,0.04)]"
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-8">
                  <h4 className="text-2xl font-bold text-[#1F2937] mb-3">{project.name}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mb-8">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Fasilitas Utama:</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.facilities.map((fac, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-xs font-medium text-gray-600 shadow-sm">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/project/${project.id}`}
                    className="inline-flex items-center justify-center w-full btn-gold rounded-xl px-6 py-3.5 font-semibold transition-all duration-300 gap-2 hover:-translate-y-1 hover:shadow-lg text-white"
                  >
                    Lihat Detail Proyek <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Anchor + Toggle */}
      <div ref={catalogRef} />
      <section className="bg-gray-50 flex justify-center py-8">
        <button
          onClick={() => {
            const willOpen = !isCatalogOpen
            setIsCatalogOpen(willOpen)
            if (willOpen) {
              setTimeout(scrollToCatalog, 50)
            }
          }}
          className="flex items-center gap-2 bg-[#D4AF37] text-white px-8 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-[#1F2937] transition-all duration-300 shadow-lg"
        >
          {isCatalogOpen ? 'Tutup Katalog' : 'Lihat Katalog'}
          {isCatalogOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </section>

      {/* Accordion Katalog Content */}
      <AnimatePresence>
        {isCatalogOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden bg-gray-50"
          >
            <div className="pb-16 pt-8">
              <Katalog />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}