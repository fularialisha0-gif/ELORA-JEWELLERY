import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, CustomRingConfig, JewelleryProduct, MetalFinish } from '../types/jewellery';

const CART_STORAGE_KEY = 'elora_maison_cart_v1';
const WISHLIST_STORAGE_KEY = 'elora_maison_wishlist_v1';

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: JewelleryProduct | null;
  toastMessage: string | null;
  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setQuickViewProduct: (product: JewelleryProduct | null) => void;
  addToCart: (params: {
    product?: JewelleryProduct;
    metal: MetalFinish;
    size?: string;
    customConfig?: CustomRingConfig;
    customPrice?: number;
    customImage?: string;
  }) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, productName?: string) => void;
  isWishlisted: (productId: string) => boolean;
  showToast: (message: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function safeReadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => safeReadStorage<CartItem[]>(CART_STORAGE_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() =>
    safeReadStorage<string[]>(WISHLIST_STORAGE_KEY, [])
  );
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<JewelleryProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Ignore quota errors
    }
  }, [wishlist]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const addToCart: StoreContextValue['addToCart'] = useCallback(
    ({ product, metal, size, customConfig, customPrice, customImage }) => {
      if (customConfig) {
        const customKey = `custom-${customConfig.design}-${customConfig.shape}-${customConfig.metal}-${customConfig.gemstone}-${customConfig.carat}-${customConfig.ringSize}-${customConfig.engraving}`;
        setCart((prev) => {
          const existing = prev.find((i) => i.cartItemId === customKey);
          if (existing) {
            return prev.map((i) =>
              i.cartItemId === customKey ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [
            ...prev,
            {
              cartItemId: customKey,
              productId: 'elora-bespoke-studio',
              name: `Bespoke ${customConfig.design} (${customConfig.shape} ${customConfig.gemstone})`,
              category: 'ÉLORA Customisation Studio',
              image: customImage || '/src/assets/images/ring_solitaire_rose_1795589222708.jpg',
              metal: customConfig.metal,
              size: customConfig.ringSize,
              unitPrice: customPrice || 11500,
              quantity: 1,
              customConfig,
            },
          ];
        });
        showToast('Bespoke creation added to your bag');
        setCartOpen(true);
        return;
      }

      if (!product) return;
      const itemKey = `${product.id}-${metal}-${size || 'std'}`;
      setCart((prev) => {
        const existing = prev.find((item) => item.cartItemId === itemKey);
        if (existing) {
          return prev.map((item) =>
            item.cartItemId === itemKey ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prev,
          {
            cartItemId: itemKey,
            productId: product.id,
            name: product.name,
            category: product.category,
            image: product.images[0],
            metal,
            size,
            unitPrice: product.price,
            quantity: 1,
          },
        ];
      });
      showToast(`${product.name} added to your bag`);
      setCartOpen(true);
    },
    [showToast]
  );

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string, productName?: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast(productName ? `Removed ${productName} from Wishlist` : 'Removed from Wishlist');
          return prev.filter((id) => id !== productId);
        }
        showToast(productName ? `Saved ${productName} to Wishlist` : 'Saved to Wishlist');
        return [...prev, productId];
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        cartSubtotal,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        quickViewProduct,
        toastMessage,
        setCartOpen,
        setWishlistOpen,
        setSearchOpen,
        setQuickViewProduct,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
