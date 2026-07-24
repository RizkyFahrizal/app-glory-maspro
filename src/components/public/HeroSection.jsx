import logoHero from '../../assets/public/logo-glory-maspro.webp'

export default function HeroSection() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.3)]"
      style={{
        background: 'rgba(252, 250, 245, 0.7)',
        boxShadow: '0 0 0 1px rgba(212,175,55,0.1), 0 8px 40px rgba(184,134,11,0.1), inset 0 1px 0 rgba(212,175,55,0.2)'
      }}
    >
      {/* Gold glow corners */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#D4AF37]/8 blur-3xl" />

      <div className="relative flex items-stretch min-h-[280px] md:min-h-[320px]">
        {/* LEFT: Text content — flush left, padded */}
        <div className="flex flex-1 flex-col justify-center px-7 py-8 md:px-10 md:py-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
            Katalog Properti KPR
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.15] text-[#1F2937] md:text-5xl lg:text-6xl">
            Satu <span className="text-[#B8860B]">Tempat</span> <br />
            Banyak <span className="text-[#B8860B]">Pilihan</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-soft">
            Tentukan pilihan property mu yang tepat hanya di Glory Maspro. Kami menyediakan kurasi terbaik untuk gaya hidup Anda.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#D4AF37]/40 px-4 py-1.5 text-xs font-semibold text-[#B8860B]">Rumah KPR</span>
            <span className="rounded-full border border-[#D4AF37]/40 px-4 py-1.5 text-xs font-semibold text-[#B8860B]">Murah</span>
            <span className="rounded-full border border-[#D4AF37]/40 px-4 py-1.5 text-xs font-semibold text-[#B8860B]">Nyaman</span>
          </div>
        </div>

        {/* RIGHT: Logo fills the right column, no extra wrapper box */}
        <div className="hidden md:flex w-[40%] items-center justify-center relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-l from-[#D4AF37]/5 to-transparent" />
          <div className="absolute inset-0 -m-4 rounded-full bg-[#D4AF37]/8 blur-3xl" />
          <img
            src={logoHero}
            alt="Hero Properti"
            className="relative h-full w-full max-h-[320px] object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105 p-6"
          />
        </div>
      </div>
    </div>
  )
}
