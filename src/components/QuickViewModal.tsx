import React, { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { formatCurrency } from '../data/products';
import { MetalFinish } from '../types/jewellery';
import { LuxuryImage } from './LuxuryImage';
import { MagneticButton } from './MagneticButton';

interface QuickViewModalProps {
  onViewFullDetails: (slug: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onViewFullDetails }) => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    isWishlisted,
    toggleWishlist,
  } = useStore();

  const [selectedMetal, setSelectedMetal] = useState<MetalFinish>('18k Rose Gold');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!quickViewProduct) return;
    setSelectedMetal(quickViewProduct.availableMetals[0]);
    setSelectedSize(quickViewProduct.availableSizes?.[0]);
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const saved = isWishlisted(quickViewProduct.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${quickViewProduct.name}`}
    >
      <div
        className="fixed inset-0 bg-black/80"
        onClick={() => setQuickViewProduct(null)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl bg-[#16070C] border border-[#D8A384]/25 grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-20 w-10 h-10 inline-flex items-center justify-center bg-[#12060A]/80 border border-[#D8A384]/25 text-[#F7F1EB] hover:text-[#E8C5B0] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-[4/3] md:aspect-auto bg-[#0B0507]">
          <LuxuryImage
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D8A384]">
              {quickViewProduct.collection} · {quickViewProduct.category}
            </p>
            <h3 className="font-serif text-3xl text-[#F7F1EB] leading-tight">
              {quickViewProduct.name}
            </h3>
            <p className="text-xl text-[#E8C5B0] font-medium tabular-nums">
              {formatCurrency(quickViewProduct.price)}
            </p>
            <p className="text-sm text-[#C7B6AE] leading-relaxed">
              {quickViewProduct.editorialDescription}
            </p>

            {/* Metal selector */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-[#C7B6AE] mb-2">
                Metal Finish: <span className="text-[#F7F1EB]">{selectedMetal}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.availableMetals.map((metal) => (
                  <button
                    key={metal}
                    type="button"
                    onClick={() => setSelectedMetal(metal)}
                    className={`px-3 py-1.5 text-xs border transition-colors cursor-pointer ${
                      selectedMetal === metal
                        ? 'border-[#D8A384] bg-[#D8A384]/15 text-[#F7F1EB]'
                        : 'border-[#D8A384]/20 text-[#C7B6AE] hover:border-[#D8A384]/50'
                    }`}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector if applicable */}
            {quickViewProduct.availableSizes && (
              <div>
                <p className="text-xs uppercase tracking-wider text-[#C7B6AE] mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[40px] h-9 px-2.5 text-xs border tabular-nums transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'border-[#D8A384] bg-[#D8A384] text-[#12060A] font-semibold'
                          : 'border-[#D8A384]/20 text-[#C7B6AE] hover:border-[#D8A384]/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex gap-2.5">
              <MagneticButton
                onClick={() => {
                  addToCart({
                    product: quickViewProduct,
                    metal: selectedMetal,
                    size: selectedSize,
                  });
                  setQuickViewProduct(null);
                }}
                className="flex-1"
              >
                Add to Bag
              </MagneticButton>
              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id, quickViewProduct.name)}
                aria-label="Toggle wishlist"
                className={`w-12 border inline-flex items-center justify-center transition-colors cursor-pointer ${
                  saved
                    ? 'border-[#D8A384] bg-[#D8A384] text-[#12060A]'
                    : 'border-[#D8A384]/30 text-[#F7F1EB] hover:border-[#D8A384]'
                }`}
              >
                <Heart className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                const slug = quickViewProduct.slug;
                setQuickViewProduct(null);
                onViewFullDetails(slug);
              }}
              className="w-full py-2 text-xs uppercase tracking-[0.16em] text-[#E8C5B0] hover:text-[#F7F1EB] underline underline-offset-4 cursor-pointer"
            >
              Inspect Full Specifications & View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
