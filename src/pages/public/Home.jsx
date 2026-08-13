import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building2, Users, Trophy, ArrowRight, ArrowLeft, MapPin, Search, ChevronDown, ChevronUp, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import Katalog from './Katalog'

import api from '../../utils/api'

export default function Home() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const catalogRef = useRef(null)
  const awardsScrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [projects, setProjects] = useState([])
  const [selectedRegion, setSelectedRegion] = useState('Semua Daerah')
  const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi')
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)

  const checkScroll = () => {
    if (awardsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = awardsScrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [awards])

  const scrollAwards = (direction) => {
    if (awardsScrollRef.current) {
      const element = awardsScrollRef.current
      const cardWidth = element.children[0]?.offsetWidth || 380
      const gap = window.innerWidth >= 768 ? 32 : 24 // md:gap-8 (32px) or gap-6 (24px)
      const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap)

      const start = element.scrollLeft
      const duration = 500
      let startTime = null

      const animateScroll = (currentTime) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)

        // easeInOutQuad
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress

        element.scrollLeft = start + (scrollAmount * ease)
        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll)
        }
      }
      requestAnimationFrame(animateScroll)
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [resProjects, resAwards] = await Promise.all([
          api.get('/projects'),
          api.get('/achievements')
        ])

        if (resProjects.data && resProjects.data.data) {
          setProjects(resProjects.data.data)
        } else {
          setProjects(Array.isArray(resProjects.data) ? resProjects.data : [])
        }

        if (resAwards.data && resAwards.data.data) {
          setAwards(resAwards.data.data)
        } else {
          setAwards(Array.isArray(resAwards.data) ? resAwards.data : [])
        }
      } catch (error) {
        console.error('Failed to fetch data on home', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const smoothScrollTo = (targetY, duration = 1200) => {
    const startY = window.scrollY;
    const difference = targetY - startY;
    const startTime = performance.now();

    const step = (currentTime) => {
      let progress = (currentTime - startTime) / duration;
      if (progress > 1) progress = 1;

      // Easing function (Ease In Out Quart)
      const easeInOutQuart = progress < 0.5
        ? 8 * progress * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      window.scrollTo(0, startY + difference * easeInOutQuart);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  const scrollToTop = () => {
    smoothScrollTo(0, 1500) // 1.5 seconds to top
  }

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      const y = catalogRef.current.getBoundingClientRect().top + window.scrollY - 20;
      smoothScrollTo(y, 1200) // 1.2 seconds to catalog
    }
  }

  const handleCariProperti = () => {
    setIsCatalogOpen(true)
    setTimeout(scrollToCatalog, 50)
  }

  const scrollToProyek = () => {
    const el = document.getElementById('proyek')
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 20;
      smoothScrollTo(y, 1200)
    }
  }

  const uniqueLocations = ['Semua Lokasi', ...new Set(projects.map(p => p.location).filter(Boolean))]

  const availableRegions = selectedLocation === 'Semua Lokasi'
    ? projects.map(p => p.region).filter(Boolean)
    : projects.filter(p => p.location === selectedLocation).map(p => p.region).filter(Boolean)

  const uniqueRegions = ['Semua Daerah', ...new Set(availableRegions)]

  const filteredProjects = projects.filter(p => {
    const matchRegion = selectedRegion === 'Semua Daerah' || p.region === selectedRegion
    const matchLocation = selectedLocation === 'Semua Lokasi' || p.location === selectedLocation
    return matchRegion && matchLocation
  })

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleRegionChange = (region) => {
    setSelectedRegion(region)
    setCurrentPage(1)
  }

  const handleLocationChange = (loc) => {
    setSelectedLocation(loc)
    setSelectedRegion('Semua Daerah')
    setCurrentPage(1)
    setIsLocationDropdownOpen(false)
  }

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      start = 1;
      end = 5;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - 4;
      end = totalPages;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-1">

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
              Satu <span className="text-[#D4AF37]">Tempat</span> Banyak <span className="text-[#D4AF37]">Pilihan</span> <br /> Bersama <span className="text-[#D4AF37]">Glory Maspro</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Kami adalah partner terpercaya Anda dalam menemukan properti terbaik, mulai dari perumahan komersial hingga subsidi dengan fasilitas unggulan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleCariProperti}
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-[#D4AF37]/30"
              >
                Cari Properti Sekarang
              </button>
              <button
                onClick={scrollToProyek}
                className="bg-white/20 hover:bg-white text-white hover:text-[#1F2937] backdrop-blur-md border border-white/40 px-8 py-4 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto text-center shadow-lg"
              >
                Lihat Proyek Kami
              </button>
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
              <a
                href="https://tiktok.com/@glory.maspro"
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
      <section className="py-10 px-6 relative bg-white">
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
      <section className="py-10 bg-[#1F2937] text-white">
        <div className="max-w-[1400px] mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3">Pencapaian Kami</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Penjualan Terbaik & Terpercaya</h3>
          </div>

          <div className="relative group">
            {/* Left Button */}
            {canScrollLeft && (
              <button
                onClick={() => scrollAwards('left')}
                className="absolute left-0 md:left-2 top-[40%] -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-gray-600 bg-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37] transition shadow-lg md:opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div
              ref={awardsScrollRef}
              onScroll={checkScroll}
              className="flex gap-6 md:gap-8 overflow-x-auto pb-8 [&::-webkit-scrollbar]:hidden scroll-smooth"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {awards.map((award, index) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm group min-w-[280px] w-[280px] md:min-w-[380px] md:w-[380px] shrink-0 flex flex-col"
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={award.image ? (award.image.startsWith('http') ? award.image : `http://127.0.0.1:8000/storage/${award.image}`) : '/aboutbg.webp'}
                      alt={award.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-8 text-center flex-1">
                    <h4 className="text-xl font-bold mb-3 text-white">{award.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {award.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Button */}
            {canScrollRight && (
              <button
                onClick={() => scrollAwards('right')}
                className="absolute right-0 md:right-2 top-[40%] -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-gray-600 bg-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37] transition shadow-lg md:opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Daftar Proyek */}
      <section id="proyek" className="py-10 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#B8860B] uppercase mb-3">Proyek Unggulan Kami</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-[#1F2937]">Proyek Yang Kami Tawarkan</h3>
            </div>

            <div className="relative w-full md:w-[300px]">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white py-3.5 pl-4 pr-4 text-sm font-semibold text-[#1F2937] shadow-sm transition hover:border-[#D4AF37] focus:border-[#D4AF37]"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{selectedLocation}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLocationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-50 mt-2 w-full rounded-xl bg-white py-2 shadow-xl border border-[rgba(0,0,0,0.05)] max-h-60 overflow-y-auto"
                  >
                    {uniqueLocations.map((loc, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLocationChange(loc)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedLocation === loc
                          ? 'bg-[#D4AF37]/10 text-[#B8860B] font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            {uniqueRegions.map((region, idx) => (
              <button
                key={idx}
                onClick={() => handleRegionChange(region)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${selectedRegion === region
                  ? 'bg-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-gray-50 border border-[rgba(0,0,0,0.04)] flex flex-col"
              >
                <Link to={`/project/${project.slug || project.id}`} className="flex-1 flex flex-col h-full w-full">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={project.header_image ? (project.header_image.startsWith('http') ? project.header_image : `http://127.0.0.1:8000/storage/${project.header_image}`) : '/herobg.webp'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="text-2xl font-bold text-[#1F2937] mb-3">{project.title}</h4>
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {project.facilities && Array.isArray(project.facilities) && project.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.facilities.slice(0, 3).map((facility, i) => (
                          <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">
                            {facility.value || facility}
                          </span>
                        ))}
                        {project.facilities.length > 3 && (
                          <span className="px-3 py-1.5 bg-[#D4AF37]/10 text-[#B8860B] text-xs font-semibold rounded-lg">
                            +{project.facilities.length - 3} lagi
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <span
                        className="inline-flex items-center justify-center w-full btn-gold rounded-xl px-6 py-3.5 font-semibold transition-all duration-300 gap-2 hover:-translate-y-1 hover:shadow-lg text-white"
                      >
                        Lihat Detail Proyek <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1.5">
                {getPageNumbers().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-medium transition ${currentPage === page
                      ? 'text-[#D4AF37] font-bold'
                      : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Catalog Anchor + Toggle */}
      <div ref={catalogRef} />
      <section className="bg-gray-50 py-8 w-full">
        <div className="flex items-center justify-center max-w-7xl mx-auto px-6">
          <div className="flex-1 h-[1px] bg-[#D4AF37]/30"></div>
          <button
            onClick={() => {
              const willOpen = !isCatalogOpen
              setIsCatalogOpen(willOpen)
              if (willOpen) {
                setTimeout(scrollToCatalog, 50)
              }
            }}
            className="flex items-center gap-2 text-[#D4AF37] hover:text-[#B8860B] px-6 font-bold tracking-widest uppercase transition-colors duration-300 relative"
          >
            {isCatalogOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            <span>{isCatalogOpen ? 'Tutup Pencarian' : 'Cari Propertimu'}</span>
            {isCatalogOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <div className="flex-1 h-[1px] bg-[#D4AF37]/30"></div>
        </div>
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
            <div className="pb-5 pt-1">
              <Katalog />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}