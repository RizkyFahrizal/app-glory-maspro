import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';
import { Search } from 'lucide-react';

export default function CustomSelect({ options, value, name, onChange, placeholder, icon: Icon, className, disabled, searchable = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownStyle({
          top: rect.bottom + window.scrollY + 8, // 8px margin below button
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      };
      
      updatePosition();
      // Listen to scroll and resize events to keep the dropdown attached
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      // Focus the input without scrolling the page to the bottom
      searchInputRef.current.focus({ preventScroll: true });
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = searchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  return (
    <>
      <div className={`relative ${className || ''}`}>
        {Icon && <Icon className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#8B6508]" />}
        
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`input-minimal flex w-full items-center justify-between rounded-2xl py-3 pr-4 transition shadow-sm ${Icon ? 'pl-12' : 'px-4'} ${disabled ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
        >
          <span className={`truncate ${selectedOption && selectedOption.value !== '' ? 'text-[#1F2937]' : 'text-soft'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {value && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ target: { name, value: '' } });
                }}
                className="text-gray-400 hover:text-[#B8860B] z-10"
              >
                <X className="h-4 w-4" />
              </div>
            )}
            <ChevronDown className={`h-4 w-4 text-[#8B6508] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
      </div>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: dropdownStyle.top,
            left: dropdownStyle.left,
            width: dropdownStyle.width,
            zIndex: 9999
          }}
          className="overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[#FCFAF5]/95 backdrop-blur-xl shadow-xl animate-fade-in"
        >
          {searchable && (
            <div className="p-2 border-b border-[rgba(0,0,0,0.06)] bg-[#FCFAF5]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          )}
          <ul className="max-h-60 overflow-auto py-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
                className={`cursor-pointer px-4 py-2.5 text-sm transition-colors hover:bg-[#D4AF37]/10 hover:text-[#B8860B] ${
                  value === opt.value ? 'bg-[#D4AF37]/10 font-semibold text-[#B8860B]' : 'text-[#1F2937]'
                }`}
              >
                {opt.label}
              </li>
            ))
            ) : (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">
                Pencarian tidak ditemukan
              </li>
            )}
          </ul>
        </div>,
        document.body
      )}
    </>
  );
}
