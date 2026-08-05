import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, CheckCircle2, Home as HomeIcon, Building2, Tag, Layers } from 'lucide-react'
import ProductCard from '../../components/public/ProductCard'

// Teks Deskripsi Panjang dari User
const sampleLongDescription = `Tentang Properti
Samesta Mahata Serpong – Apartemen TOD Strategis di Jantung BSD
Samesta Mahata Serpong merupakan hunian modern berkonsep Transit Oriented Development (TOD) yang dikembangkan untuk mendukung gaya hidup urban yang lebih praktis, efisien, dan terhubung dengan transportasi publik. Berlokasi strategis di kawasan BSD Serpong, apartemen ini memiliki akses langsung ke Stasiun KRL Rawa Buntu, sehingga mobilitas menuju Jakarta maupun berbagai pusat aktivitas di Tangerang Selatan menjadi jauh lebih mudah.

Mengusung konsep mixed-use dan compact living, Samesta Mahata Serpong dirancang untuk memberikan keseimbangan antara produktivitas dan kualitas hidup. Penghuni dapat mengurangi waktu perjalanan, memiliki lebih banyak waktu bersama keluarga, serta menikmati lingkungan hunian yang modern dan fungsional di kawasan yang terus berkembang pesat.

Selain unggul dari sisi konektivitas, proyek ini juga berada di koridor premium BSD yang dikelilingi pusat bisnis, pendidikan, hiburan, dan gaya hidup. Dengan harga mulai Rp400 jutaan, Samesta Mahata Serpong menjadi pilihan menarik baik untuk hunian pribadi maupun investasi properti jangka panjang.

Keunggulan & Selling Point:
• Konsep Transit Oriented Development (TOD)
• Akses langsung ke Stasiun KRL Rawa Buntu
• Berada di kawasan BSD Serpong yang terus berkembang
• Cocok untuk profesional muda, pasangan muda, dan investor
• Desain compact living yang efisien dan modern
• Potensi nilai investasi tinggi di koridor transportasi dan bisnis

Lokasi Strategis:
• Langsung terhubung ke Stasiun Rawa Buntu
• Dekat Tol Jakarta–Serpong
• ±5 menit ke distrik baru BSD bernilai tinggi
• Dekat AEON Mall BSD
• Dekat ICE BSD
• Dekat The Breeze BSD
• Dekat pusat bisnis, kuliner, dan fasilitas publik BSD

Konsep Hunian TOD:
• Memanfaatkan transportasi publik (KRL, busway, angkutan kota)
• Mendukung pengurangan penggunaan kendaraan pribadi
• Lingkungan lebih terintegrasi dan efisien
• Memberikan lebih banyak waktu untuk keluarga dan istirahat

Promo & Benefit Pembelian:
• Harga mulai Rp400 jutaan
• Tanpa DP
• Free Full Furnished
• Diskon hingga Rp100 juta

Cocok Untuk:
• Tempat tinggal dengan mobilitas tinggi
• Investasi sewa harian maupun bulanan
• Karyawan dan profesional di Jakarta & BSD
• Mahasiswa dan keluarga muda

Samesta Mahata Serpong menghadirkan kombinasi ideal antara lokasi premium BSD, akses transportasi publik terbaik, dan harga yang masih sangat kompetitif. Dengan konsep TOD yang semakin diminati dan promo pembelian yang menarik, apartemen ini menjadi kesempatan tepat untuk memiliki hunian modern sekaligus aset investasi yang potensial.

Hubungi Agent Glory Maspro sekarang untuk mendapatkan informasi lengkap mengenai tipe unit, harga terbaru, simulasi cicilan, ketersediaan unit, serta jadwalkan survei dan konsultasi pembelian Samesta Mahata Serpong sebelum promo dan unit terbaik berakhir.`

// Dummy Data untuk Proyek (Disamakan dengan di Home.jsx)
const projectsData = {
  '1': {
    id: 1,
    name: 'PT Lentera / Samesta Mahata Serpong',
    description: 'Proyek perumahan eksklusif dengan fasilitas lengkap untuk keluarga modern yang mencari kenyamanan dan keamanan.',
    longDescription: sampleLongDescription,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920',
    location: 'BSD Serpong, Tangerang',
    facilities: ['Akses Stasiun KRL', 'One Gate System', 'Komersial Area', 'Security 24 Jam', 'CCTV Area', 'Taman Bermain'],
    promos: [
      {
        id: 1,
        title: 'Promo Merdeka Tanpa DP',
        description: 'Dapatkan kesempatan memiliki apartemen atau rumah idaman tanpa uang muka (DP 0%). Promo berlaku untuk pembelian bulan ini beserta hadiah langsung Full Furnished.',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 2,
        title: 'Diskon Spesial Rp 100 Juta',
        description: 'Beli hunian Samesta Mahata Serpong sekarang dan nikmati potongan harga langsung hingga Rp 100 Juta rupiah untuk tipe-tipe premium kami.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
      }
    ],
    clusters: [
      {
        id: 1,
        name: 'Cluster Ametis',
        description: 'Cluster premium yang mengusung desain minimalis tropis. Cocok untuk pasangan muda dengan aksesibilitas tinggi ke fasilitas komersial.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 2,
        name: 'Cluster Beryl',
        description: 'Menawarkan hunian 2 lantai dengan luas tanah ekstra dan taman pribadi. Berada tepat di tengah kawasan hijau proyek.',
        image: 'https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  '2': {
    id: 2,
    name: 'PT Kahuripan',
    description: 'Kawasan hunian asri dengan konsep hijau, menawarkan lingkungan yang sehat dan dekat dengan pusat perbelanjaan.',
    longDescription: 'Menjadi pionir dalam konsep hunian ramah lingkungan, PT Kahuripan menawarkan pengalaman tinggal yang menyatu dengan alam tanpa mengorbankan aksesibilitas perkotaan. Mengusung konsep "Green Living", lebih dari 30% area proyek didedikasikan untuk ruang terbuka hijau.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1920',
    location: 'Surabaya Barat, Jawa Timur',
    facilities: ['Jogging Track', 'Club House', 'Kolam Renang', 'Kawasan Hijau', 'Fitness Center'],
    promos: [],
    clusters: []
  }
}

// Dummy products (nanti diganti fetch API dengan filter project_id)
const dummyProducts = [
  {
    id: 1,
    title: 'Cluster Ametis - Tipe 45',
    price_range: 'Rp 450 Jt - Rp 550 Jt',
    location: 'Sidoarjo',
    bedrooms: 2,
    bathrooms: 1,
    building_area: 45,
    property_type: 'RUMAH',
    listing_id: 'PRJ-001',
    is_available: 1,
    slug: 'cluster-ametis-tipe-45',
    images: [{ image_path: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' }]
  },
  {
    id: 2,
    title: 'Cluster Beryl - Tipe 60',
    price_range: 'Rp 650 Jt - Rp 750 Jt',
    location: 'Sidoarjo',
    bedrooms: 3,
    bathrooms: 2,
    building_area: 60,
    property_type: 'RUMAH',
    listing_id: 'PRJ-002',
    is_available: 1,
    slug: 'cluster-beryl-tipe-60',
    images: [{ image_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }]
  },
  {
    id: 3,
    title: 'Cluster Ruby - Tipe 90 (2 Lantai)',
    price_range: 'Rp 950 Jt - Rp 1.2 M',
    location: 'Sidoarjo',
    bedrooms: 4,
    bathrooms: 3,
    building_area: 90,
    property_type: 'RUMAH',
    listing_id: 'PRJ-003',
    is_available: 1,
    slug: 'cluster-ruby-tipe-90',
    images: [{ image_path: 'https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&w=800&q=80' }]
  }
]

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulasi fetch data dari API
    setTimeout(() => {
      setProject(projectsData[id] || null)
      setLoading(false)
    }, 500)

    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Proyek Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-8">Maaf, data proyek yang Anda cari tidak tersedia.</p>
        <Link to="/" className="bg-[#D4AF37] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#B8860B] transition">
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

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
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 py-12 md:px-16 md:py-16">
          <div className="max-w-7xl mx-auto w-full">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-widest mb-4">
                Proyek Unggulan
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 shadow-sm leading-tight">
                {project.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-200">
                <MapPin className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-lg md:text-xl">{project.location}</span>
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
              {project.promos.slice(0, 6).map(promo => (
                <div key={promo.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-200 group flex flex-col">
                  <div className="h-48 overflow-hidden shrink-0">
                    <img src={promo.image} alt={promo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
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
              {project.longDescription}
            </div>

            {/* Fasilitas Kawasan (Digabung ke kotak ini) */}
            <div className="pt-10 border-t border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-8">Fasilitas Kawasan</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.facilities.map((fac, idx) => (
                  <li key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="p-2 bg-[#D4AF37]/10 rounded-xl shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <span className="text-gray-700 font-medium leading-relaxed">{fac}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* List Cluster */}
          {project.clusters && project.clusters.length > 0 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-8 flex items-center gap-3">
                <Layers className="w-8 h-8 text-[#D4AF37]" /> Daftar Cluster
              </h2>
              <div className="flex flex-col gap-8">
                {project.clusters.map(cluster => (
                  <div key={cluster.id} className="flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group">
                    <div className="md:w-2/5 h-56 md:h-auto overflow-hidden shrink-0">
                      <img src={cluster.image} alt={cluster.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-8 flex flex-col justify-center md:w-3/5">
                      <h3 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-4">{cluster.name}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{cluster.description}</p>
                    </div>
                  </div>
                ))}
              </div>
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
            {dummyProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

    </motion.div>
  )
}
