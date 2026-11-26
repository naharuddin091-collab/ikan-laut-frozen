import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Loader2,
  Minus,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { formatRupiah, N8N_WORKFLOW_TEMPLATE } from '../data/products';
import type {
  CartItem,
  OrderApiResponse,
  OrderFormValues,
  Product,
  ServerWebhookConfig,
} from '../types/order';

interface OrderFormSectionProps {
  cartItems: CartItem[];
  formValues: OrderFormValues;
  isCatalogSynced: boolean;
  onFormChange: (field: keyof OrderFormValues, value: string) => void;
  onIncrementCart: (product: Product) => void;
  onDecrementCart: (productId: string) => void;
  onClearCart: () => void;
  onResetOrder: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  nama: 'Nama Lengkap',
  whatsapp: 'Nomor WhatsApp',
  produk: 'Produk Pesanan',
  jumlah: 'Jumlah Pesanan',
  alamat: 'Alamat Pengiriman',
  catatan: 'Catatan Tambahan',
};

function formatIndonesianTimestamp(isoString: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta',
    }).format(new Date(isoString)) + ' WIB';
  } catch {
    return isoString;
  }
}

function buildSafeWhatsAppUrl(order: OrderFormValues): string {
  const lines = [
    'Halo Ikan Laut Frozen, saya ingin mengonfirmasi pesanan website:',
    `Nama: ${order.nama}`,
    `Produk: ${order.produk}`,
    `Jumlah: ${order.jumlah}`,
    order.alamat ? `Alamat: ${order.alamat}` : '',
    order.catatan ? `Catatan: ${order.catatan}` : '',
  ].filter(Boolean);

  return `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`;
}

function isAllowedClientWebhookUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol === 'https:') {
      return true;
    }
    if (
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function OrderFormSection({
  cartItems,
  formValues,
  isCatalogSynced,
  onFormChange,
  onIncrementCart,
  onDecrementCart,
  onClearCart,
  onResetOrder,
}: OrderFormSectionProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorResponse, setErrorResponse] = useState<{
    message: string;
    missingFields: string[];
  } | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderApiResponse | null>(null);

  // Optional n8n integration drawer for store owners/developers
  const [n8nPanelOpen, setN8nPanelOpen] = useState(false);
  const [serverConfig, setServerConfig] = useState<ServerWebhookConfig>({
    serverWebhookConfigured: false,
    localEndpoint: '/api/ikan-laut-frozen-order',
    webhookPath: 'ikan-laut-frozen-order',
  });
  const [useCustomN8nUrl, setUseCustomN8nUrl] = useState(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [lastRawResponse, setLastRawResponse] = useState<string | null>(null);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/webhook-config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ServerWebhookConfig | null) => {
        if (active && data) {
          setServerConfig(data);
        }
      })
      .catch(() => {
        // Ignore non-fatal config probe failure
      });
    return () => {
      active = false;
    };
  }, []);

  const estimatedSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const estimatedWeightKg = cartItems.reduce(
    (sum, item) => sum + item.product.packWeightKg * item.quantity,
    0,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorResponse(null);

    const payload: OrderFormValues = {
      nama: formValues.nama.trim(),
      whatsapp: formValues.whatsapp.trim(),
      produk: formValues.produk.trim(),
      jumlah: formValues.jumlah.trim(),
      alamat: formValues.alamat.trim(),
      catatan: formValues.catatan.trim(),
    };

    const targetUrl =
      useCustomN8nUrl && customWebhookUrl.trim()
        ? customWebhookUrl.trim()
        : serverConfig.localEndpoint;

    if (useCustomN8nUrl && customWebhookUrl.trim() && !isAllowedClientWebhookUrl(targetUrl)) {
      setErrorResponse({
        message:
          'URL webhook n8n kustom harus menggunakan protokol https:// (atau http://localhost untuk pengujian lokal).',
        missingFields: [],
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as OrderApiResponse | null;
      if (data) {
        setLastRawResponse(JSON.stringify(data, null, 2));
      }

      if (!response.ok || !data?.success) {
        setErrorResponse({
          message:
            data?.message ??
            'Mohon lengkapi nama, WhatsApp, produk, dan jumlah pesanan.',
          missingFields: Array.isArray(data?.missingFields) ? data.missingFields : [],
        });
        return;
      }

      setConfirmedOrder(data);
    } catch {
      setErrorResponse({
        message:
          useCustomN8nUrl
            ? 'Gagal terhubung ke URL webhook n8n kustom. Pastikan workflow aktif dan mengizinkan CORS.'
            : 'Terjadi kendala jaringan saat mengirim pesanan. Silakan coba lagi.',
        missingFields: [],
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopyWorkflow() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(N8N_WORKFLOW_TEMPLATE, null, 2));
      setCopiedWorkflow(true);
      window.setTimeout(() => setCopiedWorkflow(false), 2200);
    } catch {
      // Clipboard unavailable in restricted context
    }
  }

  function handleStartNewOrder() {
    setConfirmedOrder(null);
    setErrorResponse(null);
    onResetOrder();
  }

  const missingSet = new Set(errorResponse?.missingFields ?? []);

  return (
    <section id="form-pesanan" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#0B5D7A]">Formulir Pemesanan Langsung</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0C1E2C] sm:text-4xl">
            Kirim Pesanan Ikan Laut Anda
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#435B6B] sm:text-base">
            Tidak perlu registrasi akun. Lengkapi detail pesanan di bawah ini—konfirmasi stok,
            harga terkini, dan biaya pengiriman akan kami kirim langsung ke WhatsApp Anda.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Selected Basket Summary + Optional n8n Webhook Inspector */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-xl border border-[#D5E1E9] bg-[#F6F9FB] p-6">
              <div className="flex items-center justify-between gap-4 border-b border-[#D5E1E9] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#0C1E2C]">Ringkasan Pilihan</h3>
                  <p className="mt-0.5 text-xs text-[#435B6B]">
                    {cartItems.length > 0
                      ? isCatalogSynced
                        ? 'Otomatis mengisi kolom Produk & Jumlah'
                        : 'Produk & Jumlah sedang diedit manual'
                      : 'Pilih dari katalog atau isi manual di formulir'}
                  </p>
                </div>
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-[#5A7282] hover:bg-white hover:text-[#B42318] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Kosongkan
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="py-6 text-sm text-[#435B6B]">
                  <p>Belum ada produk yang dipilih dari katalog.</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#5A7282]">
                    Anda tetap bisa mengetik langsung nama ikan dan jumlah pesanan (misal:{' '}
                    <span className="font-medium text-[#0C1E2C]">Fillet Kakap Merah · 3 kg</span>)
                    pada formulir di samping.
                  </p>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-[#E4EDF3]">
                    {cartItems.map(({ product, quantity }) => (
                      <li
                        key={product.id}
                        className="flex items-center justify-between gap-3 py-3.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#0C1E2C]">
                            {product.name}
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-[#5A7282] tabular-nums">
                            {formatRupiah(product.price)} × {quantity} pack
                          </p>
                        </div>

                        <div className="inline-flex h-8 items-center rounded-md border border-[#C2D3DF] bg-white shrink-0">
                          <button
                            type="button"
                            onClick={() => onDecrementCart(product.id)}
                            aria-label={`Kurangi ${product.name}`}
                            className="inline-flex h-full w-7 items-center justify-center text-[#0C1E2C] hover:bg-[#EDF3F7] cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[1.75rem] text-center font-mono text-xs font-medium tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onIncrementCart(product)}
                            aria-label={`Tambah ${product.name}`}
                            className="inline-flex h-full w-7 items-center justify-center text-[#0C1E2C] hover:bg-[#EDF3F7] cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-3 space-y-2 border-t border-[#D5E1E9] pt-4 text-sm">
                    <div className="flex items-center justify-between text-[#435B6B]">
                      <dt>Estimasi Berat Total</dt>
                      <dd className="font-mono font-medium text-[#0C1E2C] tabular-nums">
                        {estimatedWeightKg.toLocaleString('id-ID')} kg
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="font-medium text-[#0C1E2C]">Estimasi Subtotal</dt>
                      <dd className="font-mono text-base font-semibold text-[#0B5D7A] tabular-nums">
                        {formatRupiah(estimatedSubtotal)}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs leading-relaxed text-[#5A7282]">
                    Harga final & ongkos kirim dingin dikonfirmasi admin via WhatsApp sebelum
                    pembayaran.
                  </p>
                </>
              )}
            </div>

            {/* Collapsible n8n Webhook Integration Settings (Owner Utility) */}
            <div className="rounded-xl border border-[#D5E1E9] bg-white">
              <button
                type="button"
                onClick={() => setN8nPanelOpen((prev) => !prev)}
                aria-expanded={n8nPanelOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-[#0C1E2C]">
                    Integrasi Webhook n8n
                  </p>
                  <p className="mt-0.5 text-xs text-[#5A7282]">
                    {useCustomN8nUrl && customWebhookUrl.trim()
                      ? 'Mengirim langsung ke URL webhook n8n kustom'
                      : serverConfig.serverWebhookConfigured
                        ? 'Terhubung ke N8N_WEBHOOK_URL di server'
                        : `Endpoint bawaan · POST /${serverConfig.webhookPath}`}
                  </p>
                </div>
                {n8nPanelOpen ? (
                  <ChevronUp className="h-4 w-4 text-[#435B6B] shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#435B6B] shrink-0" />
                )}
              </button>

              {n8nPanelOpen && (
                <div className="space-y-4 border-t border-[#E4EDF3] px-5 py-4 text-xs text-[#435B6B]">
                  <p className="leading-relaxed">
                    Formulir ini menggunakan skema JSON persis dengan workflow{' '}
                    <span className="font-medium text-[#0C1E2C]">
                      Ikan Laut Frozen - Form Pesanan Website
                    </span>{' '}
                    (path <code className="font-mono text-[#0B5D7A]">ikan-laut-frozen-order</code>).
                  </p>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCustomN8nUrl}
                      onChange={(e) => setUseCustomN8nUrl(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#C2D3DF] accent-[#0B5D7A]"
                    />
                    <span className="leading-snug text-[#0C1E2C]">
                      Kirim langsung dari browser ke URL Webhook n8n kustom (memanfaatkan header
                      CORS workflow)
                    </span>
                  </label>

                  {useCustomN8nUrl && (
                    <div>
                      <label
                        htmlFor="custom-n8n-url"
                        className="block font-medium text-[#0C1E2C]"
                      >
                        URL Production / Test Webhook n8n
                      </label>
                      <input
                        id="custom-n8n-url"
                        type="url"
                        value={customWebhookUrl}
                        onChange={(e) => setCustomWebhookUrl(e.target.value)}
                        placeholder="https://n8n.domainanda.com/webhook/ikan-laut-frozen-order"
                        className="mt-1.5 h-10 w-full rounded-lg border border-[#C2D3DF] bg-[#F6F9FB] px-3 font-mono text-xs text-[#0C1E2C] placeholder:text-[#7C93A3]"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyWorkflow}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#C2D3DF] bg-white px-3 text-xs font-medium text-[#0C1E2C] hover:border-[#0B5D7A] cursor-pointer"
                    >
                      {copiedWorkflow ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#0B5D7A]" />
                          JSON Workflow Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Salin JSON Workflow n8n
                        </>
                      )}
                    </button>
                  </div>

                  {lastRawResponse && (
                    <div>
                      <p className="font-medium text-[#0C1E2C]">Respons JSON Terakhir:</p>
                      <pre className="mt-1.5 max-h-48 overflow-auto rounded-lg border border-[#E4EDF3] bg-[#F6F9FB] p-3 font-mono text-[11px] leading-relaxed text-[#0C1E2C]">
                        {lastRawResponse}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Form OR Confirmed Receipt */}
          <div className="rounded-xl border border-[#D5E1E9] bg-[#FAFDFE] p-6 sm:p-8 lg:col-span-7">
            {confirmedOrder ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2
                    className="mt-0.5 h-6 w-6 shrink-0 text-[#0F766E]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#0F766E]">
                      Pesanan Diterima · {confirmedOrder.brand}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#0C1E2C]">
                      Konfirmasi Pesanan Berhasil
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#435B6B]">
                      {confirmedOrder.message}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-[#D5E1E9] bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4EDF3] pb-3 text-xs text-[#5A7282]">
                    <span>Detail Ringkasan Pesanan</span>
                    <span className="font-mono tabular-nums">
                      {formatIndonesianTimestamp(confirmedOrder.receivedAt)}
                    </span>
                  </div>

                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                      <dt className="text-[#5A7282]">Nama Pemesan</dt>
                      <dd className="font-medium text-[#0C1E2C] sm:col-span-2">
                        {confirmedOrder.order.nama}
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                      <dt className="text-[#5A7282]">WhatsApp</dt>
                      <dd className="font-mono font-medium text-[#0C1E2C] tabular-nums sm:col-span-2">
                        {confirmedOrder.order.whatsapp}
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                      <dt className="text-[#5A7282]">Produk</dt>
                      <dd className="font-medium text-[#0C1E2C] sm:col-span-2">
                        {confirmedOrder.order.produk}
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                      <dt className="text-[#5A7282]">Jumlah</dt>
                      <dd className="font-medium text-[#0C1E2C] sm:col-span-2">
                        {confirmedOrder.order.jumlah}
                      </dd>
                    </div>
                    {confirmedOrder.order.alamat && (
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                        <dt className="text-[#5A7282]">Alamat</dt>
                        <dd className="text-[#0C1E2C] sm:col-span-2">
                          {confirmedOrder.order.alamat}
                        </dd>
                      </div>
                    )}
                    {confirmedOrder.order.catatan && (
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                        <dt className="text-[#5A7282]">Catatan</dt>
                        <dd className="text-[#0C1E2C] sm:col-span-2">
                          {confirmedOrder.order.catatan}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={buildSafeWhatsAppUrl(confirmedOrder.order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0B5D7A] px-5 text-sm font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#08475E]"
                  >
                    Bagikan Ringkasan ke WhatsApp
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={handleStartNewOrder}
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-[#C2D3DF] bg-white px-5 text-sm font-semibold text-[#0C1E2C] whitespace-nowrap hover:border-[#0B5D7A] cursor-pointer"
                  >
                    Buat Pesanan Baru
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {errorResponse && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-lg border border-[#F2B8B5] bg-[#FEF3F2] px-4 py-3.5 text-sm text-[#912018]"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">{errorResponse.message}</p>
                      {errorResponse.missingFields.length > 0 && (
                        <p className="mt-1 text-xs">
                          Kolom wajib yang perlu diisi:{' '}
                          {errorResponse.missingFields
                            .map((field) => FIELD_LABELS[field] ?? field)
                            .join(', ')}
                          .
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="order-nama"
                      className="block text-sm font-semibold text-[#0C1E2C]"
                    >
                      Nama Lengkap <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="order-nama"
                      name="nama"
                      type="text"
                      required
                      autoComplete="name"
                      value={formValues.nama}
                      onChange={(e) => onFormChange('nama', e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      aria-invalid={missingSet.has('nama')}
                      className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-[#0C1E2C] placeholder:text-[#7C93A3] ${
                        missingSet.has('nama')
                          ? 'border-[#D92D20]'
                          : 'border-[#C2D3DF] focus:border-[#0B5D7A]'
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="order-whatsapp"
                      className="block text-sm font-semibold text-[#0C1E2C]"
                    >
                      Nomor WhatsApp <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="order-whatsapp"
                      name="whatsapp"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={formValues.whatsapp}
                      onChange={(e) => onFormChange('whatsapp', e.target.value)}
                      placeholder="Contoh: 0812-3456-7890"
                      aria-invalid={missingSet.has('whatsapp')}
                      className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 font-mono text-sm text-[#0C1E2C] placeholder:font-sans placeholder:text-[#7C93A3] ${
                        missingSet.has('whatsapp')
                          ? 'border-[#D92D20]'
                          : 'border-[#C2D3DF] focus:border-[#0B5D7A]'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
                  <div className="sm:col-span-8">
                    <label
                      htmlFor="order-produk"
                      className="block text-sm font-semibold text-[#0C1E2C]"
                    >
                      Produk Ikan Laut <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="order-produk"
                      name="produk"
                      type="text"
                      required
                      value={formValues.produk}
                      onChange={(e) => onFormChange('produk', e.target.value)}
                      placeholder="Contoh: Fillet Kakap Merah (500g), Tuna Saku"
                      aria-invalid={missingSet.has('produk')}
                      className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-[#0C1E2C] placeholder:text-[#7C93A3] ${
                        missingSet.has('produk')
                          ? 'border-[#D92D20]'
                          : 'border-[#C2D3DF] focus:border-[#0B5D7A]'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="order-jumlah"
                      className="block text-sm font-semibold text-[#0C1E2C]"
                    >
                      Jumlah <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="order-jumlah"
                      name="jumlah"
                      type="text"
                      required
                      value={formValues.jumlah}
                      onChange={(e) => onFormChange('jumlah', e.target.value)}
                      placeholder="Contoh: 2 pack (1 kg)"
                      aria-invalid={missingSet.has('jumlah')}
                      className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-[#0C1E2C] placeholder:text-[#7C93A3] ${
                        missingSet.has('jumlah')
                          ? 'border-[#D92D20]'
                          : 'border-[#C2D3DF] focus:border-[#0B5D7A]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="order-alamat"
                    className="block text-sm font-semibold text-[#0C1E2C]"
                  >
                    Alamat Pengiriman
                  </label>
                  <textarea
                    id="order-alamat"
                    name="alamat"
                    rows={2}
                    autoComplete="street-address"
                    value={formValues.alamat}
                    onChange={(e) => onFormChange('alamat', e.target.value)}
                    placeholder="Nama jalan, nomor rumah/restoran, kecamatan, dan kota"
                    className="mt-1.5 w-full rounded-lg border border-[#C2D3DF] bg-white px-3.5 py-2.5 text-sm text-[#0C1E2C] placeholder:text-[#7C93A3] focus:border-[#0B5D7A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="order-catatan"
                    className="block text-sm font-semibold text-[#0C1E2C]"
                  >
                    Catatan Tambahan
                  </label>
                  <textarea
                    id="order-catatan"
                    name="catatan"
                    rows={2}
                    value={formValues.catatan}
                    onChange={(e) => onFormChange('catatan', e.target.value)}
                    placeholder="Contoh: Kirim sore pukul 16.00, minta kemasan sterofoam ekstra"
                    className="mt-1.5 w-full rounded-lg border border-[#C2D3DF] bg-white px-3.5 py-2.5 text-sm text-[#0C1E2C] placeholder:text-[#7C93A3] focus:border-[#0B5D7A]"
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-[#E4EDF3] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#5A7282]">
                    Tanda <span className="font-semibold text-[#B42318]">*</span> wajib diisi agar
                    tim kami dapat menghubungi Anda.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0B5D7A] px-6 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#08475E] disabled:cursor-not-allowed disabled:opacity-65 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Mengirim Pesanan...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Kirim Pesanan
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
