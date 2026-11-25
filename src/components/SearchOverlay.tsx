import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { formatCurrency, PRODUCTS } from '../data/products';
import { LuxuryImage } from './LuxuryImage';

interface SearchOverlayProps {
  onViewProduct: (slug: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ onViewProduct }) => {
  const { isSearchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search Maison ÉLORA"
    >
      <div
        className="fixed inset-0 bg-black/80"
        onClick={() => setSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl bg-[#16070C] border border-[#D8A384]/25 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#D8A384]/15">
          <Search className="w-5 h-5 text-[#D8A384] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rings, emerald cuts, rose gold cuffs, rivière..."
            className="w-full bg-transparent text-[#F7F1EB] placeholder-[#C7B6AE]/60 text-base focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="w-9 h-9 inline-flex items-center justify-center text-[#C7B6AE] hover:text-[#F7F1EB] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#D8A384] mb-4">
            {query ? `Matching Creations (${results.length})` : 'Curated Highlights'}
          </p>

          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#C7B6AE]">
              No pieces matched "{query}". Try searching for diamond, solitaire, cuff, or ruby.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    onViewProduct(product.slug);
                  }}
                  className="flex items-center gap-3.5 p-2.5 text-left bg-[#12060A] border border-[#D8A384]/15 hover:border-[#D8A384]/50 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 shrink-0 bg-[#0B0507] overflow-hidden">
                    <LuxuryImage
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#C7B6AE] uppercase tracking-wider">
                      {product.category}
                    </p>
                    <p className="font-serif text-lg text-[#F7F1EB] truncate">{product.name}</p>
                    <p className="text-xs text-[#E8C5B0] tabular-nums mt-0.5">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
