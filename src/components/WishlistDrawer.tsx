import React from 'react';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { formatCurrency, PRODUCTS } from '../data/products';
import { LuxuryImage } from './LuxuryImage';

interface WishlistDrawerProps {
  onViewProduct: (slug: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onViewProduct }) => {
  const { wishlist, isWishlistOpen, setWishlistOpen, toggleWishlist, addToCart } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Wishlist">
      <div
        className="fixed inset-0 bg-black/75"
        onClick={() => setWishlistOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-[#16070C] border-l border-[#D8A384]/25 flex flex-col h-full text-[#F7F1EB]">
        <div className="px-6 py-5 border-b border-[#D8A384]/15 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-[#F7F1EB]">Curated Wishlist</h2>
            <p className="text-xs text-[#C7B6AE] mt-0.5 tabular-nums">
              {savedProducts.length} {savedProducts.length === 1 ? 'creation' : 'creations'} saved
            </p>
          </div>
          <button
            type="button"
            onClick={() => setWishlistOpen(false)}
            aria-label="Close wishlist"
            className="w-10 h-10 inline-flex items-center justify-center text-[#C7B6AE] hover:text-[#F7F1EB] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {savedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-serif text-2xl text-[#E8C5B0]">Your wishlist awaits</p>
              <p className="text-sm text-[#C7B6AE]">
                Select the heart on any creation to curate your private collection.
              </p>
            </div>
          ) : (
            <ul className="space-y-5">
              {savedProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex gap-4 pb-5 border-b border-[#D8A384]/15"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setWishlistOpen(false);
                      onViewProduct(product.slug);
                    }}
                    className="w-20 h-20 shrink-0 bg-[#0B0507] border border-[#D8A384]/15 overflow-hidden cursor-pointer"
                  >
                    <LuxuryImage
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWishlistOpen(false);
                          onViewProduct(product.slug);
                        }}
                        className="font-serif text-lg text-[#F7F1EB] hover:text-[#E8C5B0] text-left leading-snug cursor-pointer"
                      >
                        {product.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id, product.name)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="text-[#C7B6AE] hover:text-[#E8C5B0] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#C7B6AE] mt-1 tabular-nums">
                      {product.category} · {formatCurrency(product.price)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart({
                          product,
                          metal: product.availableMetals[0],
                          size: product.availableSizes?.[0],
                        });
                        setWishlistOpen(false);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[#E8C5B0] hover:text-[#F7F1EB] cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
