import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';

export default function CustomSelect({ options, value, name, onChange, placeholder, icon: Icon, className, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
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

  const selectedOption = options.find(opt => opt.value === value);

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
          <span className={selectedOption && selectedOption.value !== '' ? 'text-[#1F2937]' : 'text-soft'}>
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
          <ul className="max-h-60 overflow-auto py-2">
            {options.map((opt) => (
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
            ))}
          </ul>
        </div>,
        document.body
      )}
    </>
  );
}
