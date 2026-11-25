import React from 'react';
import { Eye, Heart } from 'lucide-react';
import { JewelleryProduct } from '../types/jewellery';
import { formatCurrency } from '../data/products';
import { useStore } from '../hooks/useStore';
import { LuxuryImage } from './LuxuryImage';

interface ProductCardProps {
  product: JewelleryProduct;
  onViewDetails: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { isWishlisted, toggleWishlist, setQuickViewProduct } = useStore();
  const saved = isWishlisted(product.id);

  return (
    <article className="group flex flex-col bg-[#17090E] border border-[#D8A384]/15 hover:border-[#D8A384]/45 transition-all duration-300 hover:-translate-y-0.5">
      {/* 4:3 Studio Photography Surface */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0E0508]">
        <button
          type="button"
          onClick={() => onViewDetails(product.slug)}
          className="block w-full h-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384]"
          aria-label={`View details for ${product.name}`}
        >
          <LuxuryImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </button>

        {/* Wishlist Action */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id, product.name)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384] ${
            saved
              ? 'bg-[#D8A384] text-[#12060A] border-[#D8A384]'
              : 'bg-[#12060A]/75 text-[#F7F1EB] border-[#E8C5B0]/25 hover:border-[#D8A384]'
          }`}
        >
          <Heart className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Hover/Touch Action */}
        <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3.5 sm:bottom-3.5 flex justify-end sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            className="h-8 sm:h-9 px-2.5 sm:px-3.5 inline-flex items-center gap-1.5 bg-[#12060A]/90 border border-[#E8C5B0]/30 text-[#F7F1EB] hover:border-[#D8A384] hover:text-[#E8C5B0] text-[11px] sm:text-xs tracking-wide whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Editorial Product Metadata */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs text-[#C7B6AE] tracking-wide mb-1.5">
          <span className="truncate">{product.category}</span>
          {product.editionNote && (
            <span className="text-[#D8A384] shrink-0 hidden sm:inline">{product.editionNote}</span>
          )}
        </div>

        <h3 className="font-serif text-base sm:text-xl text-[#F7F1EB] font-medium leading-snug line-clamp-2">
          <button
            type="button"
            onClick={() => onViewDetails(product.slug)}
            className="text-left hover:text-[#E8C5B0] transition-colors cursor-pointer"
          >
            {product.name}
          </button>
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-[#C7B6AE] line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        <div className="mt-auto pt-3.5 sm:pt-4 border-t border-[#D8A384]/12 flex items-center justify-between gap-2">
          <span className="text-sm sm:text-base font-medium text-[#F3EAE0] tabular-nums">
            {formatCurrency(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onViewDetails(product.slug)}
            className="text-[11px] sm:text-xs text-[#E8C5B0] hover:text-[#F7F1EB] underline underline-offset-4 decoration-[#D8A384]/50 hover:decoration-[#E8C5B0] whitespace-nowrap cursor-pointer transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
};
