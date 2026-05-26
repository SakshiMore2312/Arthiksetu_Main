import { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'ta', label: 'Tamil' }
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state with Google Translate's cookie or local storage on load
  useEffect(() => {
    const getLanguageFromCookie = () => {
      const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return localStorage.getItem('arthiksetu_lang') || 'en';
    };

    const initialLang = getLanguageFromCookie();
    if (LANGUAGES.some(l => l.code === initialLang)) {
      setCurrentLang(initialLang);
    }

    // Close the dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync Google Translate element value when it loads
  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        clearInterval(interval);
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
        const activeLang = match ? match[1] : (localStorage.getItem('arthiksetu_lang') || 'en');
        
        if (select.value !== activeLang) {
          select.value = activeLang;
          select.dispatchEvent(new Event('change'));
        }
      }
      attempts++;
      if (attempts > 50) clearInterval(interval); // Stop checking after 10s
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      setCurrentLang(langCode);
      localStorage.setItem('arthiksetu_lang', langCode);
    } else {
      console.warn('Google Translate selector not found yet.');
      // If it's not ready in DOM, at least set our state and localStorage
      setCurrentLang(langCode);
      localStorage.setItem('arthiksetu_lang', langCode);
      // Also update Google Translate cookie directly to ensure persistence
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=.vercel.app`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=arthiksetu-rouge.vercel.app`;
      // Reload to let Google Translate initialize with the updated cookie
      window.location.reload();
    }
    setIsOpen(false);
  };

  const activeLanguageLabel = LANGUAGES.find(l => l.code === currentLang)?.label || 'English';

  return (
    <div className="fixed bottom-6 right-6 z-[9999] notranslate" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0A1F44] border border-white/10 text-white text-sm font-bold shadow-2xl hover:bg-[#1e3a5f] hover:-translate-y-0.5 transition-all duration-300 focus:outline-none"
      >
        <Globe className="w-4 h-4 text-blue-400" />
        <span>{activeLanguageLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-3 w-36 rounded-xl bg-white border border-gray-200 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 dark:bg-gray-900 dark:border-gray-800">
          <div className="py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  currentLang === lang.code
                    ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-900/30 font-semibold'
                    : 'text-gray-750 dark:text-gray-300'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
