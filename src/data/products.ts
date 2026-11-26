import type { Product } from '../types/order';

export const HERO_IMAGE_PATH = '/src/assets/images/hero_ikan_laut_frozen_1795664860240.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'kakap-merah-fillet',
    name: 'Fillet Ikan Kakap Merah',
    shortName: 'Fillet Kakap Merah (500g)',
    category: 'Fillet & Loin',
    price: 78000,
    unitLabel: '500g / pack',
    packWeightKg: 0.5,
    origin: 'Perairan Laut Jawa',
    stockNote: 'Stok Tersedia',
    cutStyle: 'Skin-on · Tanpa duri',
    description:
      'Potongan fillet kakap merah segar dengan tekstur daging tebal, manis alami, dan sudah dibersihkan dari duri halus. Cocok untuk pan-seared, tim kecap, hingga sup ikan.',
    storageTip: 'Simpan beku pada suhu -18°C hingga 6 bulan; cairkan perlahan di chiller sebelum dimasak.',
    image: '/src/assets/images/produk_kakap_merah_1795664860236.jpg',
    imageAlt: 'Fillet Ikan Kakap Merah segar beku di atas es serut',
  },
  {
    id: 'tuna-saku-sashimi',
    name: 'Tuna Saku Yellowfin Loin',
    shortName: 'Tuna Saku Yellowfin (500g)',
    category: 'Fillet & Loin',
    price: 85000,
    unitLabel: '500g / pack',
    packWeightKg: 0.5,
    origin: 'Laut Banda & Sulawesi',
    stockNote: 'Stok Tersedia',
    cutStyle: 'Balok saku padat · Tanpa kulit',
    description:
      'Loin tuna sirip kuning pilihan berwarna merah cerah dengan serat padat. Dibekukan cepat sesaat setelah pemotongan untuk menjaga kualitas sashimi dan steak tuna.',
    storageTip: 'Jaga tetap tersegel dalam kemasan vakum pada suhu -18°C untuk mempertahankan warna alami.',
    image: '/src/assets/images/produk_tuna_saku_1795664861612.jpg',
    imageAlt: 'Potongan Tuna Saku Yellowfin merah segar di atas es',
  },
  {
    id: 'kembung-banjar-utuh',
    name: 'Ikan Kembung Banjar Utuh',
    shortName: 'Kembung Banjar Utuh (1kg)',
    category: 'Ikan Utuh',
    price: 54000,
    unitLabel: '1 kg (6–8 ekor)',
    packWeightKg: 1,
    origin: 'Perairan Utara Jawa',
    stockNote: 'Stok Tersedia',
    cutStyle: 'Utuh bersih insang & isi perut',
    description:
      'Ikan kembung banjar berkulit perak cerah dengan rasa gurih khas laut dan kaya omega-3. Sudah dibersihkan secara higienis sehingga praktis untuk digoreng, bakar, atau pesmol.',
    storageTip: 'Cuci singkat setelah pencairan di chiller, lalu bumbui langsung sebelum diolah.',
    image: '/src/assets/images/produk_kembung_banjar_1795664862264.jpg',
    imageAlt: 'Tiga ekor Ikan Kembung Banjar utuh segar di atas es serut',
  },
  {
    id: 'tenggiri-papan-fillet',
    name: 'Ikan Tenggiri Papan & Steak',
    shortName: 'Ikan Tenggiri Steak (500g)',
    category: 'Fillet & Loin',
    price: 72000,
    unitLabel: '500g / pack',
    packWeightKg: 0.5,
    origin: 'Perairan Bangka Belitung',
    stockNote: 'Stok Tersedia',
    cutStyle: 'Potongan steak & fillet tebal',
    description:
      'Tenggiri laut pilihan berdaging putih lembut dan aroma segar tidak amis. Ideal untuk bahan pempek, siomay, otak-otak, maupun gulai dan asam padeh rumahan.',
    storageTip: 'Simpan pada suhu beku -18°C; hindari membekukan ulang setelah dicairkan penuh.',
    image: '/src/assets/images/produk_tenggiri_fillet_1795664862932.jpg',
    imageAlt: 'Potongan steak dan fillet Ikan Tenggiri segar di atas es',
  },
  {
    id: 'cumi-tube-ring',
    name: 'Cumi Tube & Ring Bersih',
    shortName: 'Cumi Tube & Ring (500g)',
    category: 'Seafood Pilihan',
    price: 68000,
    unitLabel: '500g / pack',
    packWeightKg: 0.5,
    origin: 'Laut Flores',
    stockNote: 'Stok Tersedia',
    cutStyle: 'Kupas kulit · Tanpa tinta',
    description:
      'Cumi laut putih bersih yang sudah dikupas kulit arinya dan dibuang tintanya. Tekstur kenyal alami tanpa bahan pengenyal, siap dimasak saus Padang, calamari, atau tumis mentega.',
    storageTip: 'Masak dengan api besar dalam waktu singkat (2–3 menit) agar tekstur tetap lembut.',
    image: '/src/assets/images/produk_cumi_tube_1795664863457.jpg',
    imageAlt: 'Cumi tube dan ring putih bersih di atas es serut',
  },
  {
    id: 'udang-vaname-kupas',
    name: 'Udang Vaname Kupas (PTO)',
    shortName: 'Udang Vaname Kupas (500g)',
    category: 'Seafood Pilihan',
    price: 82000,
    unitLabel: '500g (size 31–40)',
    packWeightKg: 0.5,
    origin: 'Tambak Pesisir Lampung',
    stockNote: 'Stok Tersedia',
    cutStyle: 'Kupas punggung · Ekor utuh',
    description:
      'Udang vaname ukuran besar yang sudah dikupas bersih dan dibelah punggungnya dengan ekor tetap utuh. Renyah dan manis alami untuk tempura, tumisan, hingga ebi furai.',
    storageTip: 'Cairkan dengan merendam kemasan tersegel dalam air dingin selama 10–15 menit.',
    image: '/src/assets/images/produk_udang_vaname_1795664865081.jpg',
    imageAlt: 'Udang Vaname kupas segar beku dengan ekor utuh di atas es',
  },
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const N8N_WORKFLOW_TEMPLATE = {
  name: 'Ikan Laut Frozen - Form Pesanan Website',
  nodes: [
    {
      parameters: {
        httpMethod: 'POST',
        path: 'ikan-laut-frozen-order',
        responseMode: 'responseNode',
        options: {},
      },
      id: '7a1d4b90-2c63-4e18-9f21-5d8b3c6a1e40',
      name: 'Terima Pesanan Website',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [240, 300],
      webhookId: 'ikan-laut-frozen-order-webhook',
    },
    {
      parameters: {
        jsCode:
          "const input = $json.body ?? $json;\nconst text = (v) => String(v ?? '').trim();\nconst order = {\n  nama: text(input.nama ?? input.name),\n  whatsapp: text(input.whatsapp ?? input.phone),\n  produk: text(input.produk ?? input.product),\n  jumlah: text(input.jumlah ?? input.quantity),\n  alamat: text(input.alamat ?? input.address),\n  catatan: text(input.catatan ?? input.note)\n};\nconst missing = ['nama', 'whatsapp', 'produk', 'jumlah'].filter((key) => !order[key]);\nreturn [{ json: { success: missing.length === 0, brand: 'Ikan Laut Frozen', status: missing.length ? 'data_belum_lengkap' : 'pesanan_diterima', message: missing.length ? 'Mohon lengkapi nama, WhatsApp, produk, dan jumlah pesanan.' : 'Terima kasih! Pesanan Anda diterima. Kami akan menghubungi Anda untuk konfirmasi stok, harga, dan pengiriman.', missingFields: missing, order, receivedAt: new Date().toISOString() } }];",
      },
      id: '7a1d4b90-2c63-4e18-9f21-5d8b3c6a1e41',
      name: 'Validasi dan Format Pesanan',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [500, 300],
    },
    {
      parameters: {
        respondWith: 'json',
        responseBody: '={{ $json }}',
        options: {
          responseCode: '={{ $json.success ? 200 : 400 }}',
          responseHeaders: {
            entries: [
              { name: 'Access-Control-Allow-Origin', value: '*' },
              { name: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
              { name: 'Access-Control-Allow-Headers', value: 'Content-Type' },
            ],
          },
        },
      },
      id: '7a1d4b90-2c63-4e18-9f21-5d8b3c6a1e42',
      name: 'Kirim Konfirmasi ke Website',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.1,
      position: [760, 300],
    },
  ],
  connections: {
    'Terima Pesanan Website': {
      main: [[{ node: 'Validasi dan Format Pesanan', type: 'main', index: 0 }]],
    },
    'Validasi dan Format Pesanan': {
      main: [[{ node: 'Kirim Konfirmasi ke Website', type: 'main', index: 0 }]],
    },
  },
  active: false,
  settings: { executionOrder: 'v1' },
  versionId: '7a1d4b90-2c63-4e18-9f21-5d8b3c6a1e43',
  meta: { templateCredsSetupCompleted: true },
  tags: [],
};
