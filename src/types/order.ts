export type ProductCategory = 'Semua' | 'Fillet & Loin' | 'Ikan Utuh' | 'Seafood Pilihan';

export interface Product {
  id: string;
  name: string;
  shortName: string;
  category: Exclude<ProductCategory, 'Semua'>;
  price: number;
  unitLabel: string;
  packWeightKg: number;
  origin: string;
  stockNote: string;
  cutStyle: string;
  description: string;
  storageTip: string;
  image: string;
  imageAlt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderFormValues {
  nama: string;
  whatsapp: string;
  produk: string;
  jumlah: string;
  alamat: string;
  catatan: string;
}

export interface OrderApiResponse {
  success: boolean;
  brand: string;
  status: 'pesanan_diterima' | 'data_belum_lengkap' | string;
  message: string;
  missingFields: string[];
  order: OrderFormValues;
  receivedAt: string;
  forwardedToN8n?: boolean;
}

export interface ServerWebhookConfig {
  serverWebhookConfigured: boolean;
  localEndpoint: string;
  webhookPath: string;
}
