import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2, Home as HomeIcon, Building2, Tag, Layers } from 'lucide-react'
import ProductCard from '../../components/public/ProductCard'

import api from '../../utils/api'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [clusterPage, setClusterPage] = useState(1)
  const clustersPerPage = 2

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/projects/${id}`)
        if (res.data && res.data.data) {
          setProject(res.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch project detail:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()

    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]"></div>
          <div className="text-lg font-medium text-[#B8860B]">Memuat detail properti...</div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50 flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Proyek Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-8">Maaf, data proyek yang Anda cari tidak tersedia.</p>
        <Link to="/" className="bg-[#D4AF37] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#B8860B] transition shadow-lg shadow-[#D4AF37]/30">
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  const products = project?.products || []
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  const clusters = project?.sub_projects || [];
  const totalClusterPages = Math.ceil(clusters.length / clustersPerPage);
  const paginatedClusters = clusters.slice((clusterPage - 1) * clustersPerPage, clusterPage * clustersPerPage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50"
    >
      {/* Header Banner */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-[#1F2937]">
        <img
          src={project.image_header ? (project.image_header.startsWith('http') ? project.image_header : `https://api.glorymaspro.com/storage/${project.image_header}`) : '/herobg.webp'}
          alt={project.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-black/30 to-transparent" />

        {/* Tombol Kembali (Absolute di Kiri Atas) */}
        <div className="absolute top-6 left-6 md:top-8 md:left-12 z-20">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full text-[#1F2937] hover:bg-gray-100 transition-all duration-300 font-bold text-sm shadow-xl hover:-translate-y-0.5">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end px-6 py-12 md:px-16 md:py-16">
          <div className="max-w-7xl mx-auto w-full">

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-widest mb-4">
                Proyek Unggulan
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 shadow-sm leading-tight">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-200">
                <MapPin className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-lg md:text-xl">
                  {[project.region, project.location].filter(Boolean).join(' - ')}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promo Proyek */}
      {project.promos && project.promos.length > 0 && (
        <section className="pt-16 pb-8 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-8 flex items-center gap-3">
              <Tag className="w-8 h-8 text-[#D4AF37]" /> Promo Spesial
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.promos.map((promo, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-200 group flex flex-col">
                  {promo.image && (
                    <div className="h-48 overflow-hidden shrink-0">
                      <img src={promo.image.startsWith('http') ? promo.image : `https://api.glorymaspro.com/storage/${promo.image}`} alt={promo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold text-[#1F2937] mb-3 line-clamp-2">{promo.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">{promo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Konten Utama */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Tentang Properti + Fasilitas */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-8 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#D4AF37]" /> Tentang Properti
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-justify mb-12">
              {project.description}
            </div>

            {/* Fasilitas Kawasan (Digabung ke kotak ini) */}
            <div className="pt-10 border-t border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-8">Fasilitas Kawasan</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.facilities && Array.isArray(project.facilities) && project.facilities.map((fac, idx) => (
                  <li key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="p-2 bg-[#D4AF37]/10 rounded-xl shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <span className="text-gray-700 font-medium leading-relaxed">{fac.value || fac}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* List Cluster */}
          {clusters && clusters.length > 0 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-8 flex items-center gap-3">
                <Layers className="w-8 h-8 text-[#D4AF37]" /> Daftar Cluster
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedClusters.map((cluster, idx) => (
                  <div key={idx} className="flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group">
                    {cluster.image && (
                      <div className="h-56 overflow-hidden shrink-0">
                        <img src={cluster.image.startsWith('http') ? cluster.image : `https://api.glorymaspro.com/storage/${cluster.image}`} alt={cluster.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-8 flex flex-col justify-center flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-4">{cluster.name}</h3>
                      <p className="text-gray-600 leading-relaxed">{cluster.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Cluster */}
              {totalClusterPages > 1 && (
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => setClusterPage(p => Math.max(1, p - 1))}
                    disabled={clusterPage === 1}
                    className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white shadow-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Sebelumnya
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Hal {clusterPage} dari {totalClusterPages}
                    </span>
                  </div>
                  <button
                    onClick={() => setClusterPage(p => Math.min(totalClusterPages, p + 1))}
                    disabled={clusterPage === totalClusterPages}
                    className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white shadow-sm"
                  >
                    Selanjutnya
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Katalog / Daftar Produk Tersedia */}
      <section className="py-16 px-6 bg-[#1F2937]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3">Tersedia di Proyek Ini</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-3">
              <HomeIcon className="w-8 h-8 text-[#D4AF37]" /> Pilihan Unit & Rumah
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
                Belum ada produk untuk proyek ini.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full border border-gray-600 text-gray-300 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-gray-600 disabled:hover:text-gray-300 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  {getPageNumbers().map((num, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof num === 'number' && setCurrentPage(num)}
                      disabled={num === '...'}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                        currentPage === num
                          ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30'
                          : num === '...'
                          ? 'text-gray-500 cursor-default'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full border border-gray-600 text-gray-300 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-gray-600 disabled:hover:text-gray-300 transition-all"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm font-medium text-gray-400">
                Menampilkan halaman {currentPage} dari {totalPages}
              </p>
            </div>
          )}
        </div>
      </section>

    </motion.div>
  )
}
