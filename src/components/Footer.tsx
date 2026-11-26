export function Footer() {
  return (
    <footer className="border-t border-[#D5E1E9] bg-[#0C1E2C] text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-xl font-bold tracking-tight text-white">
              Ikan Laut Frozen
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-300">
              Pemasok ikan laut dan hasil laut beku higienis untuk kebutuhan dapur rumah tangga,
              katering, dan restoran dengan rantai dingin -18°C.
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-sm font-semibold text-white">Jam Operasional & Pengiriman</p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
              <li>Senin – Sabtu · 07.00 – 17.00 WIB</li>
              <li>Pengiriman kurir instan & termos es same-day</li>
              <li>Melayani pembelian eceran & pasokan grosir</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-sm font-semibold text-white">Navigasi</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Katalog Ikan Laut
                </a>
              </li>
              <li>
                <a href="#keunggulan" className="hover:text-white transition-colors">
                  Standar Rantai Dingin
                </a>
              </li>
              <li>
                <a href="#form-pesanan" className="hover:text-white transition-colors">
                  Form Pesanan Website
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} Ikan Laut Frozen. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
