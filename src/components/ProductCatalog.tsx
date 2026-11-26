import { Fish, Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { formatRupiah } from '../data/products';
import type { Product, ProductCategory } from '../types/order';

interface ProductCatalogProps {
  products: Product[];
  quantities: Record<string, number>;
  onIncrement: (product: Product) => void;
  onDecrement: (productId: string) => void;
  onOrderProductNow: (product: Product) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Semua',
  'Fillet & Loin',
  'Ikan Utuh',
  'Seafood Pilihan',
];

export function ProductCatalog({
  products,
  quantities,
  onIncrement,
  onDecrement,
  onOrderProductNow,
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const visibleProducts =
    selectedCategory === 'Semua'
      ? products
      : products.filter((item) => item.category === selectedCategory);

  return (
    <section id="katalog" className="border-b border-[#D5E1E9] bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium text-[#0B5D7A]">Katalog Pilihan Hari Ini</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0C1E2C] sm:text-4xl">
              Ikan Laut & Seafood Beku Siap Olah
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#435B6B] sm:text-base">
              Tambahkan produk yang diinginkan agar otomatis terisi ke formulir pesanan, atau ketik
              kebutuhan grosir langsung di bagian bawah.
            </p>
          </div>

          {/* Interactive Filter Controls (Segmented Buttons) */}
          <div
            role="tablist"
            aria-label="Filter kategori produk"
            className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#EDF3F7] p-1 self-start md:self-auto"
          >
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`h-9 rounded-md px-3.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#0C1E2C] shadow-xs'
                      : 'text-[#435B6B] hover:text-[#0C1E2C]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Uniform Product Grid */}
        <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => {
            const qty = quantities[product.id] ?? 0;
            const imgBroken = Boolean(failedImages[product.id]);

            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#D5E1E9] bg-[#FAFDFE] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#AEC5D5]"
              >
                <button
                  type="button"
                  onClick={() => setActiveProduct(product)}
                  aria-label={`Lihat detail ${product.name}`}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#E7EFF4] text-left cursor-pointer"
                >
                  {!imgBroken ? (
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [product.id]: true }))
                      }
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#DCE8F0] to-[#EDF3F7] p-6 text-center text-[#0C1E2C]">
                      <Fish className="h-8 w-8 text-[#0B5D7A]" aria-hidden="true" />
                      <span className="mt-2 text-sm font-semibold">{product.name}</span>
                    </div>
                  )}
                </button>

                <div className="flex flex-1 flex-col p-5">
                  {/* Unboxed Metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#435B6B]">
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.unitLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#0B5D7A]">{product.stockNote}</span>
                  </div>

                  <h3 className="mt-2 text-base font-semibold leading-snug text-[#0C1E2C]">
                    <button
                      type="button"
                      onClick={() => setActiveProduct(product)}
                      className="text-left hover:text-[#0B5D7A] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </button>
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-[#435B6B]">
                    {product.cutStyle} — {product.origin}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#E4EDF3] pt-4 mt-5">
                    <div>
                      <p className="font-mono text-base font-medium text-[#0C1E2C] tabular-nums">
                        {formatRupiah(product.price)}
                      </p>
                      <p className="text-xs text-[#5A7282]">estimasi per pack</p>
                    </div>

                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => onIncrement(product)}
                        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#0B5D7A] bg-white px-4 text-xs font-semibold text-[#0B5D7A] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#0B5D7A] hover:text-white cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        Pilih
                      </button>
                    ) : (
                      <div className="inline-flex h-10 items-center rounded-lg border border-[#0B5D7A] bg-[#0B5D7A] text-white">
                        <button
                          type="button"
                          onClick={() => onDecrement(product.id)}
                          aria-label={`Kurangi jumlah ${product.name}`}
                          className="inline-flex h-full w-9 items-center justify-center rounded-l-lg hover:bg-[#08475E] cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[2rem] text-center font-mono text-xs font-medium tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onIncrement(product)}
                          aria-label={`Tambah jumlah ${product.name}`}
                          className="inline-flex h-full w-9 items-center justify-center rounded-r-lg hover:bg-[#08475E] cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Product Detail Dialog */}
      {activeProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-produk-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1E2C]/60 p-4 backdrop-blur-[2px]"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#D5E1E9] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="relative aspect-[4/3] bg-[#E7EFF4] sm:col-span-5 sm:aspect-auto">
                {!failedImages[activeProduct.id] ? (
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.imageAlt}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[220px] flex-col items-center justify-center bg-[#DCE8F0] p-6 text-[#0C1E2C]">
                    <Fish className="h-10 w-10 text-[#0B5D7A]" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between p-6 sm:col-span-7">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs text-[#435B6B]">
                      {activeProduct.category} · {activeProduct.unitLabel} ·{' '}
                      <span className="font-medium text-[#0B5D7A]">{activeProduct.stockNote}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveProduct(null)}
                      aria-label="Tutup detail produk"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#435B6B] hover:bg-[#EDF3F7] hover:text-[#0C1E2C] cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <h3
                    id="detail-produk-title"
                    className="mt-2 font-display text-2xl font-bold text-[#0C1E2C]"
                  >
                    {activeProduct.name}
                  </h3>

                  <p className="mt-2 font-mono text-lg font-medium text-[#0C1E2C] tabular-nums">
                    {formatRupiah(activeProduct.price)}{' '}
                    <span className="font-sans text-xs font-normal text-[#5A7282]">
                      / {activeProduct.unitLabel}
                    </span>
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-[#435B6B]">
                    {activeProduct.description}
                  </p>

                  <dl className="mt-4 space-y-2 border-t border-[#E4EDF3] pt-4 text-xs text-[#435B6B]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#5A7282]">Asal Tangkapan</dt>
                      <dd className="font-medium text-[#0C1E2C]">{activeProduct.origin}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#5A7282]">Potongan</dt>
                      <dd className="font-medium text-[#0C1E2C]">{activeProduct.cutStyle}</dd>
                    </div>
                    <div>
                      <dt className="text-[#5A7282]">Saran Penyimpanan</dt>
                      <dd className="mt-0.5 leading-relaxed text-[#0C1E2C]">
                        {activeProduct.storageTip}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onOrderProductNow(activeProduct);
                      setActiveProduct(null);
                    }}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-[#0B5D7A] px-4 text-sm font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#08475E] cursor-pointer"
                  >
                    Tambah & Isi Form Pesanan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProduct(null)}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-[#C2D3DF] px-4 text-sm font-medium text-[#0C1E2C] whitespace-nowrap hover:border-[#0B5D7A] cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
