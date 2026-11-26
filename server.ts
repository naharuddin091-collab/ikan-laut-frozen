import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const REQUIRED_FIELDS = ['nama', 'whatsapp', 'produk', 'jumlah'] as const;

interface FormattedOrder {
  nama: string;
  whatsapp: string;
  produk: string;
  jumlah: string;
  alamat: string;
  catatan: string;
}

interface OrderResponsePayload {
  success: boolean;
  brand: string;
  status: 'pesanan_diterima' | 'data_belum_lengkap';
  message: string;
  missingFields: string[];
  order: FormattedOrder;
  receivedAt: string;
  forwardedToN8n?: boolean;
}

function sanitizeField(value: unknown, maxLength: number): string {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return '';
  }
  return String(value).trim().slice(0, maxLength);
}

function isSafeWebhookUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    // Block cloud metadata and private/loopback ranges for server-side forwarding
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      hostname === '169.254.169.254' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '16kb' }));

  app.get('/api/webhook-config', (_req: Request, res: Response) => {
    const configuredUrl = (process.env.N8N_WEBHOOK_URL ?? '').trim();
    res.json({
      serverWebhookConfigured: configuredUrl.length > 0 && isSafeWebhookUrl(configuredUrl),
      localEndpoint: '/api/ikan-laut-frozen-order',
      webhookPath: 'ikan-laut-frozen-order',
    });
  });

  app.post('/api/ikan-laut-frozen-order', async (req: Request, res: Response) => {
    const rawBody =
      req.body && typeof req.body === 'object' && !Array.isArray(req.body)
        ? (req.body as Record<string, unknown>)
        : {};

    // Mirror exact n8n "Validasi dan Format Pesanan" Code node contract
    const order: FormattedOrder = {
      nama: sanitizeField(rawBody.nama ?? rawBody.name, 120),
      whatsapp: sanitizeField(rawBody.whatsapp ?? rawBody.phone, 32),
      produk: sanitizeField(rawBody.produk ?? rawBody.product, 500),
      jumlah: sanitizeField(rawBody.jumlah ?? rawBody.quantity, 120),
      alamat: sanitizeField(rawBody.alamat ?? rawBody.address, 400),
      catatan: sanitizeField(rawBody.catatan ?? rawBody.note, 500),
    };

    const missingFields = REQUIRED_FIELDS.filter((key) => !order[key]);
    const receivedAt = new Date().toISOString();

    if (missingFields.length > 0) {
      const invalidPayload: OrderResponsePayload = {
        success: false,
        brand: 'Ikan Laut Frozen',
        status: 'data_belum_lengkap',
        message: 'Mohon lengkapi nama, WhatsApp, produk, dan jumlah pesanan.',
        missingFields,
        order,
        receivedAt,
      };
      res.status(400).json(invalidPayload);
      return;
    }

    // If a live server-side N8N_WEBHOOK_URL is configured, forward the validated payload to n8n
    const configuredN8nUrl = (process.env.N8N_WEBHOOK_URL ?? '').trim();
    if (configuredN8nUrl && isSafeWebhookUrl(configuredN8nUrl)) {
      try {
        const upstream = await fetch(configuredN8nUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(order),
          signal: AbortSignal.timeout(10000),
        });

        const upstreamJson = (await upstream.json().catch(() => null)) as
          | Partial<OrderResponsePayload>
          | null;

        if (upstreamJson && typeof upstreamJson.success === 'boolean') {
          res.status(upstream.ok ? 200 : upstream.status).json({
            ...upstreamJson,
            forwardedToN8n: true,
          });
          return;
        }

        if (!upstream.ok) {
          res.status(502).json({
            success: false,
            brand: 'Ikan Laut Frozen',
            status: 'data_belum_lengkap',
            message: 'Webhook n8n sedang tidak dapat dihubungi. Silakan coba beberapa saat lagi.',
            missingFields: [],
            order,
            receivedAt,
          });
          return;
        }
      } catch {
        res.status(502).json({
          success: false,
          brand: 'Ikan Laut Frozen',
          status: 'data_belum_lengkap',
          message: 'Gagal meneruskan pesanan ke server webhook n8n. Periksa koneksi workflow Anda.',
          missingFields: [],
          order,
          receivedAt,
        });
        return;
      }
    }

    const confirmedPayload: OrderResponsePayload = {
      success: true,
      brand: 'Ikan Laut Frozen',
      status: 'pesanan_diterima',
      message:
        'Terima kasih! Pesanan Anda diterima. Kami akan menghubungi Anda untuk konfirmasi stok, harga, dan pengiriman.',
      missingFields: [],
      order,
      receivedAt,
      forwardedToN8n: false,
    };

    res.status(200).json(confirmedPayload);
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ikan Laut Frozen server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
