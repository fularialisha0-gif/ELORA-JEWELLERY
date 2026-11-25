import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Box, Camera, Heart, RotateCw, ShieldCheck } from 'lucide-react';
import { MetalFinish, PageRoute } from '../types/jewellery';
import { formatCurrency, PRODUCTS } from '../data/products';
import { useStore } from '../hooks/useStore';
import { LuxuryImage } from '../components/LuxuryImage';
import { MagneticButton } from '../components/MagneticButton';
import { JewelleryCanvas3D } from '../components/JewelleryCanvas3D';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const product = useMemo(
    () => PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0],
    [slug]
  );

  const { addToCart, isWishlisted, toggleWishlist } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');
  const [selectedMetal, setSelectedMetal] = useState<MetalFinish>(product.availableMetals[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.availableSizes?.[0]
  );

  useEffect(() => {
    setActiveImageIdx(0);
    setViewMode('gallery');
    setSelectedMetal(product.availableMetals[0]);
    setSelectedSize(product.availableSizes?.[0]);
  }, [product]);

  const saved = isWishlisted(product.id);

  const relatedProducts = useMemo(
    () =>
      PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
        .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category))
        .slice(0, 4),
    [product]
  );

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#12060A] min-h-screen text-[#F7F1EB]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        {/* Breadcrumb / Back */}
        <div className="pb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('collections')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C7B6AE] hover:text-[#E8C5B0] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collections</span>
          </button>
          <span className="text-xs text-[#C7B6AE]">
            {product.collection} · {product.category}
          </span>
        </div>

        {/* Contiguous PDP Split: Sticky Gallery Left / Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Gallery + 3D Inspector */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] bg-[#0B0507] border border-[#D8A384]/20 overflow-hidden">
              {viewMode === '3d' && product.supports3D && product.default3DConfig ? (
                <div className="w-full h-full relative">
                  <JewelleryCanvas3D
                    mode="studio"
                    design={product.default3DConfig.design}
                    shape={product.default3DConfig.shape}
                    metal={selectedMetal}
                    gemstone={product.default3DConfig.gemstone}
                    carat={2.1}
                    autoRotate
                    fallbackImage={product.images[0]}
                  />
                  <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#E8C5B0]/85 bg-[#12060A]/75 px-3 py-1.5 border border-[#D8A384]/20">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Drag to rotate · Scroll to zoom</span>
                  </div>
                </div>
              ) : (
                <LuxuryImage
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={`${product.name} angle ${activeImageIdx + 1}`}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              )}

              {/* View Mode Switcher (Photography vs Live 3D) */}
              {product.supports3D && (
                <div className="absolute top-3.5 right-3.5 z-10 flex bg-[#12060A]/90 border border-[#D8A384]/30 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('gallery')}
                    className={`px-3 py-1.5 text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                      viewMode === 'gallery'
                        ? 'bg-[#D8A384] text-[#12060A] font-semibold'
                        : 'text-[#F7F1EB] hover:text-[#E8C5B0]'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`px-3 py-1.5 text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                      viewMode === '3d'
                        ? 'bg-[#D8A384] text-[#12060A] font-semibold'
                        : 'text-[#F7F1EB] hover:text-[#E8C5B0]'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D View</span>
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Angles */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={`${product.id}-thumb-${idx}`}
                  type="button"
                  onClick={() => {
                    setViewMode('gallery');
                    setActiveImageIdx(idx);
                  }}
                  className={`aspect-[4/3] overflow-hidden border transition-all cursor-pointer ${
                    viewMode === 'gallery' && activeImageIdx === idx
                      ? 'border-[#D8A384]'
                      : 'border-[#D8A384]/18 opacity-75 hover:opacity-100'
                  }`}
                >
                  <LuxuryImage
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="lg:col-span-5 space-y-6 bg-[#17090E] border border-[#D8A384]/18 p-6 sm:p-8">
            <div className="space-y-2 pb-5 border-b border-[#D8A384]/15">
              <p className="text-xs uppercase tracking-[0.22em] text-[#D8A384]">
                {product.collection}
                {product.editionNote ? ` · ${product.editionNote}` : ''}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#F7F1EB] font-normal leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl text-[#E8C5B0] font-medium tabular-nums pt-1">
                {formatCurrency(product.price)}
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#C7B6AE] leading-relaxed">
              {product.editorialDescription}
            </p>

            {/* Metal Finish Selector */}
            <div className="space-y-2.5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#C7B6AE]">
                Precious Metal: <span className="text-[#F7F1EB]">{selectedMetal}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.availableMetals.map((metal) => (
                  <button
                    key={metal}
                    type="button"
                    onClick={() => setSelectedMetal(metal)}
                    className={`px-3.5 py-2 text-xs border transition-colors cursor-pointer ${
                      selectedMetal === metal
                        ? 'border-[#D8A384] bg-[#D8A384]/15 text-[#F7F1EB]'
                        : 'border-[#D8A384]/20 text-[#C7B6AE] hover:border-[#D8A384]/55'
                    }`}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            {product.availableSizes && (
              <div className="space-y-2.5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#C7B6AE]">
                  Select Size: <span className="text-[#F7F1EB] tabular-nums">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-10 px-3 text-xs border tabular-nums transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'border-[#D8A384] bg-[#D8A384] text-[#12060A] font-semibold'
                          : 'border-[#D8A384]/20 text-[#C7B6AE] hover:border-[#D8A384]/55'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Purchase Actions */}
            <div className="flex gap-3 pt-2">
              <MagneticButton
                onClick={() =>
                  addToCart({
                    product,
                    metal: selectedMetal,
                    size: selectedSize,
                  })
                }
                className="flex-1"
              >
                Add to Shopping Bag
              </MagneticButton>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id, product.name)}
                aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-12 border inline-flex items-center justify-center transition-colors cursor-pointer ${
                  saved
                    ? 'border-[#D8A384] bg-[#D8A384] text-[#12060A]'
                    : 'border-[#D8A384]/35 text-[#F7F1EB] hover:border-[#D8A384]'
                }`}
              >
                <Heart className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>

            {product.supports3D && (
              <button
                type="button"
                onClick={() => onNavigate('customise')}
                className="w-full py-2.5 border border-[#D8A384]/25 text-xs uppercase tracking-[0.16em] text-[#E8C5B0] hover:border-[#D8A384] transition-colors cursor-pointer"
              >
                Bespoke Customisation in Studio
              </button>
            )}

            {/* Specifications Table */}
            <div className="pt-4 border-t border-[#D8A384]/15 space-y-3">
              <h2 className="text-xs uppercase tracking-[0.2em] text-[#D8A384]">
                Specifications &amp; Provenance
              </h2>
              <dl className="divide-y divide-[#D8A384]/12 text-xs sm:text-sm">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="py-2.5 flex justify-between gap-4">
                    <dt className="text-[#C7B6AE]">{spec.label}</dt>
                    <dd className="text-[#F7F1EB] text-right tabular-nums">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex items-start gap-2.5 pt-2 text-xs text-[#C7B6AE]">
              <ShieldCheck className="w-4 h-4 text-[#D8A384] shrink-0 mt-0.5" />
              <span>
                Accompanied by GIA dossier, Maison ÉLORA lifetime ultrasonic care, and insured
                armored courier delivery.
              </span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-20 sm:mt-28 pt-12 border-t border-[#D8A384]/15">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#D8A384]">
                Curated Pairings
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F1EB] mt-1">
                Companion Creations
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onViewDetails={(s) => onNavigate('product', s)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
