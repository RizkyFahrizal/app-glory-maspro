import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ScrollText, MapPin, Building2, Clock, Phone, Map as MapIcon, Compass } from 'lucide-react'
import logoImg from '../../assets/public/logo-glory-maspro.webp'

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="w-full bg-[#FDFBF7] font-sans text-[#2C1A00] pb-24 overflow-hidden">
      
      {/* 1. HERO SECTION (Gradient background) */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden flex items-center justify-center min-h-[350px]">
        {/* Background Gradients to match reference */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] via-[#F5B041] to-[#E67E22] opacity-90"></div>
        
        {/* Curved Bottom SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[150%] md:w-[120%] h-[100px] md:h-[150px] -ml-[10%] block fill-[#FDFBF7]">
            <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full max-w-5xl mx-auto"
        >
          {/* Logo Circle */}
          <div className="bg-white p-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex-shrink-0 relative">
            <div className="absolute inset-0 rounded-full border-4 border-[#B8860B]/30 scale-[1.05]"></div>
            <img 
              src={logoImg} 
              alt="Logo Glory Maspro" 
              className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full"
            />
          </div>

          {/* Title Area */}
          <div className="text-center md:text-left text-white drop-shadow-md">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">
              Glory Maspro
            </h1>
            <p className="text-xl md:text-2xl font-bold opacity-90 mb-2">
              Property Collection
            </p>
            <p className="text-sm md:text-base font-medium opacity-80 uppercase tracking-widest">
              Sidoarjo - Surabaya, Jawa Timur
            </p>
          </div>
        </motion.div>
      </section>

      {/* 2. SEJARAH & KANTOR PERUSAHAAN */}
      <section className="relative z-20 -mt-12 md:-mt-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 bg-white px-8 py-3 rounded-full shadow-sm border border-gray-100">
            <ScrollText className="w-6 h-6 text-[#B8860B]" />
            <h2 className="text-2xl font-extrabold text-[#2C1A00]">Sejarah & Kantor Perusahaan</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: History Timeline/Cards */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-orange-50 border border-orange-100 p-6 rounded-3xl shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-400 text-white p-2 rounded-xl">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-orange-900">Awal Berdiri</h3>
              </div>
              <p className="text-orange-800/80 text-sm leading-relaxed">
                Glory Maspro didirikan sebagai solusi bagi para pencari hunian dan properti komersial yang membutuhkan layanan profesional dan terpercaya. Berawal dari kecintaan terhadap dunia real estat dan komitmen untuk memberikan layanan terbaik.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-orange-50/50 border border-orange-100/50 p-6 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-400 text-white p-2 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-orange-900">Perkembangan</h3>
              </div>
              <p className="text-orange-800/80 text-sm leading-relaxed">
                Seiring berjalannya waktu, Glory Maspro terus berkembang dan berkolaborasi dengan berbagai developer terkemuka. Kami aktif menghadirkan berbagai pilihan perumahan mulai dari klaster eksklusif hingga apartemen berkonsep TOD.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-orange-50/30 border border-orange-100/30 p-6 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-400 text-white p-2 rounded-xl">
                  <ScrollText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-orange-900">Makna Nama Perusahaan</h3>
              </div>
              <p className="text-orange-800/80 text-sm leading-relaxed">
                Nama "Glory Maspro" mencerminkan semangat kejayaan (Glory) dan penguasaan di bidang properti (Master Property). Nama ini merepresentasikan dedikasi para agen kami dalam melayani sepenuh hati serta membangun jaringan yang solid.
              </p>
            </motion.div>
          </div>

          {/* Right: Office Photo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative h-[400px] lg:h-full min-h-[400px] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white"
          >
            {/* Foto Kantor */}
            <img 
              src="/aboutbg.webp" 
              alt="Tim Glory Maspro / Kantor" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay label at bottom right */}
            <div className="absolute bottom-6 right-6 bg-[#FFD700] text-[#2C1A00] px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
              <MapPin className="w-5 h-5" />
              Kantor Pusat Glory Maspro
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. LOKASI PERUSAHAAN */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 bg-white px-8 py-3 rounded-full shadow-sm border border-gray-100">
            <MapPin className="w-6 h-6 text-[#B8860B]" />
            <h2 className="text-2xl font-extrabold text-[#2C1A00]">Lokasi Perusahaan</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-[#FFF9E5] p-6 rounded-3xl border border-[#FDE68A] flex gap-4">
              <div className="bg-[#FFD700] p-3 rounded-2xl h-fit text-[#2C1A00]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#2C1A00] mb-1">Alamat</h4>
                <p className="text-sm text-[#5C4000] leading-relaxed">
                  Kantor Glory Maspro<br />
                  Sidoarjo - Surabaya<br />
                  Jawa Timur 61254
                </p>
                <div className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                  <MapIcon className="w-3 h-3" /> MAPS
                </div>
              </div>
            </div>

            <div className="bg-[#FFF9E5]/70 p-6 rounded-3xl border border-[#FDE68A]/70 flex gap-4">
              <div className="bg-orange-300/50 p-3 rounded-2xl h-fit text-[#2C1A00]">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#2C1A00] mb-1">Jam Operasional</h4>
                <p className="text-sm text-[#5C4000] leading-relaxed">
                  Senin - Jumat: 09.00 - 17.00 WIB<br />
                  Sabtu: 09.00 - 14.00 WIB<br />
                  Minggu: Libur
                </p>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex gap-4">
              <div className="bg-red-400 p-3 rounded-2xl h-fit text-white">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#2C1A00] mb-1">Kontak</h4>
                <p className="text-sm text-[#5C4000] leading-relaxed">
                  Email: info@glorymaspro.com<br />
                  Instagram: @glorymaspro
                </p>
              </div>
            </div>

            <a 
              href="https://maps.app.goo.gl/ypjmHXKv6gwiDkm47" 
              target="_blank" 
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full bg-[#F5B041] hover:bg-[#E67E22] text-white font-bold py-4 rounded-2xl transition-colors shadow-md"
            >
              <MapIcon className="w-5 h-5" /> Buka di Google Maps
            </a>
          </div>

          {/* Right: Google Maps Iframe */}
          <div className="lg:col-span-8 h-[400px] lg:h-full min-h-[400px] w-full rounded-[2rem] overflow-hidden shadow-lg border-4 border-white bg-gray-200 relative">
            <iframe 
              title="Google Maps Lokasi Perusahaan"
              src="https://maps.google.com/maps?q=-7.455827,112.6873922&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}
