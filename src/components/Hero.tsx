import { ArrowDownRight, Fish } from 'lucide-react';
import { useState } from 'react';
import { HERO_IMAGE_PATH } from '../data/products';

interface HeroProps {
  onBrowseCatalog: () => void;
  onStartOrder: () => void;
}

const COLD_CHAIN_METRICS = [
  { value: '-18°C', label: 'Pembekuan cepat sejak dari kapal & cold storage' },
  { value: 'Vacuum', label: 'Kemasan kedap udara menjaga tekstur alami' },
  { value: 'Same-Day', label: 'Pengiriman termos es & kurir instan terjaga' },
  { value: 'Tanpa Obat', label: '100% murni ikan laut tanpa pengawet kimia' },
];

export function Hero({ onBrowseCatalog, onStartOrder }: HeroProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="border-b border-[#D5E1E9] bg-[#F6F9FB]">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 lg:px-8 lg:pt-14 lg:pb-16">
        {/* 2-Column Balanced Split */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-between lg:col-span-6 lg:py-2">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#0B5D7A]">
                Pasokan Laut Nusantara · Beku Cepat -18°C · Eceran & Restoran
              </p>

              <h1 className="mt-4 font-display text-[clamp(2.25rem,4vw,3.45rem)] font-bold leading-[1.08] tracking-tight text-[#0C1E2C]">
                Ikan Laut Segar, Dibekukan di Puncak Kesegaran.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#435B6B]">
                Dari fillet kakap merah, tuna saku grade sashimi, hingga kembung banjar bersih siap
                masak. Pilih langsung dari katalog kami dan kirim pesanan Anda—tim kami segera
                mengonfirmasi stok, harga terbaru, dan jadwal pengiriman via WhatsApp.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartOrder}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0B5D7A] px-6 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#08475E] active:scale-[0.99] cursor-pointer"
              >
                Isi Form Pesanan
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onBrowseCatalog}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-[#C2D3DF] bg-white px-6 text-sm font-semibold text-[#0C1E2C] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#0B5D7A] hover:text-[#0B5D7A] cursor-pointer"
              >
                Lihat Katalog Ikan
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl border border-[#D5E1E9] bg-[#132939] sm:min-h-[340px]">
              {!imageError ? (
                <img
                  src={HERO_IMAGE_PATH}
                  alt="Koleksi ikan laut segar beku: tuna loin, fillet kakap merah, dan ikan kembung di atas es serut"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-gradient-to-br from-[#0F2A3D] to-[#1A435B] p-8 text-center text-white">
                  <Fish className="h-12 w-12 text-[#88C5DA]" aria-hidden="true" />
                  <p className="mt-3 font-display text-xl font-semibold">Ikan Laut Frozen</p>
                  <p className="mt-1 text-sm text-slate-200">
                    Tangkapan Laut Segar · Kemasan Vakum -18°C
                  </p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0C1E2C]/80 via-[#0C1E2C]/35 to-transparent px-5 pt-10 pb-4">
                <p className="text-xs font-medium text-white/95">
                  Tuna Saku · Fillet Kakap Merah · Kembung Banjar — Siap Kirim Hari Ini
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Proof Strip */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#D5E1E9] pt-8 lg:grid-cols-4 lg:gap-8">
          {COLD_CHAIN_METRICS.map((item) => (
            <div key={item.value}>
              <p className="font-mono text-lg font-medium tracking-tight text-[#0C1E2C] tabular-nums">
                {item.value}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-[#435B6B]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
