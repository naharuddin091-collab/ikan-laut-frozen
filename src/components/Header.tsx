import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  totalItems: number;
  onOrderClick: () => void;
}

const NAV_LINKS = [
  { href: '#katalog', label: 'Katalog' },
  { href: '#keunggulan', label: 'Keunggulan' },
  { href: '#cara-pesan', label: 'Cara Pesan' },
  { href: '#form-pesanan', label: 'Form Pesanan' },
];

export function Header({ totalItems, onOrderClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#D5E1E9] bg-[#F6F9FB]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#"
          className="font-display text-xl font-bold tracking-tight text-[#0C1E2C] whitespace-nowrap shrink-0"
        >
          Ikan Laut Frozen
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#435B6B]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#0C1E2C] hover:underline hover:underline-offset-8 decoration-[#0B5D7A]/50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOrderClick}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0B5D7A] px-5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#08475E] active:scale-[0.99] cursor-pointer"
          >
            {totalItems > 0 ? `Pesan (${totalItems})` : 'Pesan Sekarang'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#D5E1E9] text-[#0C1E2C] md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Navigasi seluler"
          className="border-t border-[#D5E1E9] bg-white px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 items-center rounded-md px-3 text-sm font-medium text-[#0C1E2C] hover:bg-[#EDF3F7]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
