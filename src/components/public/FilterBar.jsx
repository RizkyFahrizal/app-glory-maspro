import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react'
import CustomSelect from './CustomSelect'

export default function FilterBar({
  filters,
  locations,
  propertyTypes,
  isFilterOpen,
  onFilterChange,
  onSearch,
  onToggleFilter,
  onClearFilter,
  setFilters
}) {
  return (
    <div className="glass-panel mb-9 flex flex-col rounded-[1.75rem] p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#8B6508]" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={onFilterChange}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Cari nama perumahan atau kata kunci..."
            className="input-minimal w-full rounded-2xl py-3 pl-12 pr-12 transition shadow-sm"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-soft hover:text-[#8B6508]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <CustomSelect
          name="location"
          value={filters.location}
          onChange={onFilterChange}
          placeholder="Semua Lokasi"
          icon={MapPin}
          options={[
            { label: "Semua Lokasi", value: "" },
            ...locations.map(loc => ({ label: loc, value: loc }))
          ]}
          className="md:w-64"
        />

        <button onClick={onSearch} className="btn-gold rounded-2xl px-8 py-3 transition">
          Cari
        </button>
        <button
          onClick={onToggleFilter}
          className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold transition ${isFilterOpen ? 'bg-[#D4AF37] text-white shadow-md' : 'btn-ghost'}`}
        >
          <SlidersHorizontal className="h-4 w-4" /> Filter
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${isFilterOpen ? 'mt-6 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
          }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-6 border-t border-[rgba(0,0,0,0.06)] pt-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Tipe Properti</label>
              <CustomSelect
                name="property_type"
                value={filters.property_type}
                onChange={onFilterChange}
                placeholder="Semua Tipe"
                options={[
                  { label: "Semua Tipe", value: "" },
                  ...propertyTypes.map(type => ({ label: type, value: type }))
                ]}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Tidur</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={onFilterChange}
                  placeholder="Jumlah kamar..."
                  className="input-minimal w-full rounded-xl py-2.5 px-3 pr-8"
                />
                {filters.bedrooms && (
                  <button type="button" onClick={() => setFilters(prev => ({ ...prev, bedrooms: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8860B]">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-soft">Kamar Mandi</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={onFilterChange}
                  placeholder="Jumlah kamar..."
                  className="input-minimal w-full rounded-xl py-2.5 px-3 pr-8"
                />
                {filters.bathrooms && (
                  <button type="button" onClick={() => setFilters(prev => ({ ...prev, bathrooms: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8860B]">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-end justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-soft">Range Harga</label>
                <span className="text-[10px] font-medium text-[#B8860B] opacity-80">*Klik JT/M u/ ubah satuan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex flex-1">
                  <input type="number" min="0" name="min_price" value={filters.min_price} onChange={onFilterChange} placeholder="Min" className="input-minimal w-full rounded-xl py-2.5 pl-3 pr-16" />
                  {filters.min_price && (
                    <button type="button" onClick={() => setFilters(prev => ({ ...prev, min_price: '' }))} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8860B] z-10">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, min_price_unit: prev.min_price_unit === 'JT' ? 'M' : 'JT' }))}
                    className="absolute right-0 top-0 bottom-0 rounded-r-xl bg-[rgba(212,175,55,0.1)] px-3 text-xs font-bold text-[#8B6508] transition hover:bg-[rgba(212,175,55,0.2)] border-l border-[rgba(212,175,55,0.2)]"
                  >
                    {filters.min_price_unit}
                  </button>
                </div>
                <span className="text-soft">-</span>
                <div className="relative flex flex-1">
                  <input type="number" min="0" name="max_price" value={filters.max_price} onChange={onFilterChange} placeholder="Max" className="input-minimal w-full rounded-xl py-2.5 pl-3 pr-16" />
                  {filters.max_price && (
                    <button type="button" onClick={() => setFilters(prev => ({ ...prev, max_price: '' }))} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B8860B] z-10">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, max_price_unit: prev.max_price_unit === 'JT' ? 'M' : 'JT' }))}
                    className="absolute right-0 top-0 bottom-0 rounded-r-xl bg-[rgba(212,175,55,0.1)] px-3 text-xs font-bold text-[#8B6508] transition hover:bg-[rgba(212,175,55,0.2)] border-l border-[rgba(212,175,55,0.2)]"
                  >
                    {filters.max_price_unit}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
