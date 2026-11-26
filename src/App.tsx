import { useMemo, useState } from 'react';
import { ColdChainStory } from './components/ColdChainStory';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OrderFormSection } from './components/OrderFormSection';
import { ProductCatalog } from './components/ProductCatalog';
import { PRODUCTS } from './data/products';
import type { CartItem, OrderFormValues, Product } from './types/order';

const INITIAL_FORM_VALUES: OrderFormValues = {
  nama: '',
  whatsapp: '',
  produk: '',
  jumlah: '',
  alamat: '',
  catatan: '',
};

function formatCartForWebhook(items: CartItem[]): { produk: string; jumlah: string } {
  if (items.length === 0) {
    return { produk: '', jumlah: '' };
  }

  const produk = items.map((item) => `${item.product.shortName} x${item.quantity}`).join(', ');
  const totalPacks = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeightKg = items.reduce(
    (sum, item) => sum + item.product.packWeightKg * item.quantity,
    0,
  );
  const formattedWeight = Number.isInteger(totalWeightKg)
    ? `${totalWeightKg} kg`
    : `${totalWeightKg.toLocaleString('id-ID')} kg`;

  return {
    produk,
    jumlah: `${totalPacks} pack (${formattedWeight})`,
  };
}

export default function App() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [formValues, setFormValues] = useState<OrderFormValues>(INITIAL_FORM_VALUES);
  const [isCatalogSynced, setIsCatalogSynced] = useState(true);

  const cartItems = useMemo<CartItem[]>(() => {
    return PRODUCTS.filter((product) => (quantities[product.id] ?? 0) > 0).map((product) => ({
      product,
      quantity: quantities[product.id],
    }));
  }, [quantities]);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  function syncFormFromQuantities(nextQuantities: Record<string, number>) {
    const nextItems: CartItem[] = PRODUCTS.filter(
      (product) => (nextQuantities[product.id] ?? 0) > 0,
    ).map((product) => ({
      product,
      quantity: nextQuantities[product.id],
    }));

    const formatted = formatCartForWebhook(nextItems);
    setFormValues((prev) => ({
      ...prev,
      produk: formatted.produk,
      jumlah: formatted.jumlah,
    }));
    setIsCatalogSynced(true);
  }

  function handleIncrement(product: Product) {
    setQuantities((prev) => {
      const next = { ...prev, [product.id]: (prev[product.id] ?? 0) + 1 };
      syncFormFromQuantities(next);
      return next;
    });
  }

  function handleDecrement(productId: string) {
    setQuantities((prev) => {
      const current = prev[productId] ?? 0;
      const next = { ...prev };
      if (current <= 1) {
        delete next[productId];
      } else {
        next[productId] = current - 1;
      }
      syncFormFromQuantities(next);
      return next;
    });
  }

  function handleClearCart() {
    setQuantities({});
    syncFormFromQuantities({});
  }

  function handleFormChange(field: keyof OrderFormValues, value: string) {
    if (field === 'produk' || field === 'jumlah') {
      setIsCatalogSynced(false);
    }
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleResetOrder() {
    setQuantities({});
    setFormValues(INITIAL_FORM_VALUES);
    setIsCatalogSynced(true);
  }

  function scrollToSection(id: string) {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleOrderProductNow(product: Product) {
    if ((quantities[product.id] ?? 0) === 0) {
      handleIncrement(product);
    }
    scrollToSection('form-pesanan');
  }

  return (
    <div className="min-h-screen bg-[#F6F9FB] text-[#0C1E2C]">
      <Header
        totalItems={totalItems}
        onOrderClick={() => scrollToSection('form-pesanan')}
      />

      <main>
        <Hero
          onBrowseCatalog={() => scrollToSection('katalog')}
          onStartOrder={() => scrollToSection('form-pesanan')}
        />

        <ProductCatalog
          products={PRODUCTS}
          quantities={quantities}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onOrderProductNow={handleOrderProductNow}
        />

        <ColdChainStory />

        <OrderFormSection
          cartItems={cartItems}
          formValues={formValues}
          isCatalogSynced={isCatalogSynced}
          onFormChange={handleFormChange}
          onIncrementCart={handleIncrement}
          onDecrementCart={handleDecrement}
          onClearCart={handleClearCart}
          onResetOrder={handleResetOrder}
        />
      </main>

      <Footer />
    </div>
  );
}
