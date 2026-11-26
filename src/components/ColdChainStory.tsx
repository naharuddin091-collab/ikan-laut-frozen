const ORDER_STEPS = [
  {
    number: '01.',
    title: 'Pilih Produk & Jumlah',
    description:
      'Klik ikan laut dari katalog kami atau tulis langsung jenis dan berat pesanan Anda—melayani kebutuhan dapur rumah tangga mulai 500g hingga pasokan rutin katering & restoran.',
  },
  {
    number: '02.',
    title: 'Kirim Formulir Pesanan',
    description:
      'Lengkapi nama, nomor WhatsApp aktif, alamat pengiriman, serta catatan khusus seperti permintaan potong steak, pisah kepala, atau jadwal antar.',
  },
  {
    number: '03.',
    title: 'Konfirmasi Stok & Pengiriman',
    description:
      'Pesanan langsung masuk ke sistem kami. Tim admin segera menghubungi WhatsApp Anda untuk konfirmasi ketersediaan stok, total harga terbaru, dan armada kurir beku.',
  },
];

export function ColdChainStory() {
  return (
    <section
      id="keunggulan"
      className="border-b border-[#D5E1E9] bg-[#EDF3F7] py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div id="cara-pesan" className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left: 3-step ordering & quality process */}
          <div className="lg:col-span-7">
            <p className="text-xs font-medium text-[#0B5D7A]">Cara Pesan & Standar Mutu</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0C1E2C] sm:text-4xl">
              Pemesanan Cepat Tanpa Ribet, Kesegaran Terjaga Sampai Dapur.
            </h2>

            <div className="mt-8 divide-y divide-[#D5E1E9] border-t border-[#D5E1E9]">
              {ORDER_STEPS.map((step) => (
                <div key={step.number} className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:gap-6">
                  <p className="font-mono text-sm font-medium text-[#0B5D7A] tabular-nums sm:col-span-2">
                    {step.number}
                  </p>
                  <div className="sm:col-span-10">
                    <h3 className="text-base font-semibold text-[#0C1E2C]">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#435B6B]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Adjacent Proof & Attributable Testimonial */}
          <div className="flex flex-col justify-between rounded-xl border border-[#D5E1E9] bg-white p-6 sm:p-8 lg:col-span-5">
            <div>
              <p className="text-xs font-medium text-[#0B5D7A]">Testimoni Mitra Dapur</p>
              <blockquote className="mt-4 font-display text-xl leading-snug font-semibold text-[#0C1E2C]">
                “Sebelumnya kami sering mengalami susut berat hingga 20% saat mencairkan ikan dari
                pemasok lama. Sejak beralih ke Ikan Laut Frozen, glazing es tipis, daging kakap dan
                tuna tetap padat, dan konfirmasi stok lewat WhatsApp selalu di bawah 15 menit.”
              </blockquote>

              <div className="mt-6 border-t border-[#E4EDF3] pt-5">
                <p className="text-sm font-semibold text-[#0C1E2C]">Hendra Wijaya</p>
                <p className="mt-0.5 text-xs text-[#435B6B]">
                  Kepala Dapur · Warung Pesisir Nusantara, Jakarta Selatan
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-[#E4EDF3] pt-6">
              <div>
                <p className="font-mono text-2xl font-medium text-[#0C1E2C] tabular-nums">
                  &lt; 15 mnt
                </p>
                <p className="mt-1 text-xs leading-snug text-[#435B6B]">
                  Rata-rata waktu konfirmasi stok di jam operasional
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-medium text-[#0C1E2C] tabular-nums">
                  -18°C
                </p>
                <p className="mt-1 text-xs leading-snug text-[#435B6B]">
                  Suhu simpan cold room sebelum diserahkan ke kurir
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
