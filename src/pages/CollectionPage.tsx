import React, { useMemo, useState } from 'react';
import { JewelleryCategory, MetalFinish, PageRoute } from '../types/jewellery';
import { MEDIA_ASSETS, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { CinematicVideoFrame } from '../components/CinematicVideoFrame';

interface CollectionPageProps {
  initialCategory?: JewelleryCategory | 'All';
  title: string;
  subtitle: string;
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  initialCategory = 'All',
  title,
  subtitle,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<JewelleryCategory | 'All'>(
    initialCategory
  );
  const [selectedMetal, setSelectedMetal] = useState<MetalFinish | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: (JewelleryCategory | 'All')[] = [
    'All',
    'Rings',
    'Necklaces',
    'Earrings',
    'Bracelets',
    'Signature',
  ];

  const metals: (MetalFinish | 'All')[] = [
    'All',
    '18k Rose Gold',
    '18k Yellow Gold',
    '18k White Gold',
  ];

  const filteredProducts = useMemo(() => {
    const list = PRODUCTS.filter((product) => {
      const catMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const metalMatch =
        selectedMetal === 'All' || product.availableMetals.includes(selectedMetal);
      return catMatch && metalMatch;
    });

    if (sortOrder === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedCategory, selectedMetal, sortOrder]);

  const showEarringsVideo = selectedCategory === 'Earrings';
  const showRoseGoldVideo = !showEarringsVideo && selectedMetal === '18k Rose Gold';

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#12060A] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        {/* Editorial Page Header */}
        <header className="pb-10 border-b border-[#D8A384]/15 space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
            Maison ÉLORA Archive
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F1EB] font-normal">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[#C7B6AE] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </header>

        {/* Contextual Collection Film Spotlight */}
        {(showEarringsVideo || showRoseGoldVideo) && (
          <div className="mt-8 mb-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#17090E] border border-[#D8A384]/18 p-5 sm:p-7">
            <div className="lg:col-span-4">
              <CinematicVideoFrame
                videoSrc={
                  showEarringsVideo
                    ? '/videos/earrings-editorial.mp4'
                    : '/videos/rosegold-editorial.mp4'
                }
                posterSrc={
                  showEarringsVideo ? MEDIA_ASSETS.earringsDrop : MEDIA_ASSETS.ringSolitaire
                }
                posterAlt={
                  showEarringsVideo
                    ? 'ÉLORA Earrings Collection film'
                    : 'ÉLORA 18k Rose Gold Collection film'
                }
                aspectClassName="aspect-[4/5] max-h-[340px] w-full max-w-[280px] mx-auto lg:mx-0"
                className="border border-[#D8A384]/20"
              />
            </div>
            <div className="lg:col-span-8 space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-[#D8A384]">
                {showEarringsVideo ? 'Earrings Collection Film' : '18k Rose Gold Atelier'}
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#F7F1EB] font-normal">
                {showEarringsVideo
                  ? 'Sculpted to Catch Light in Motion'
                  : 'Warmth Alloyed in Small European Crucibles'}
              </h2>
              <p className="text-sm text-[#C7B6AE] max-w-xl leading-relaxed">
                {showEarringsVideo
                  ? 'Matched pear-cut diamonds and French-cut pavé silhouettes balanced for effortless radiance.'
                  : 'Every 18k rose gold creation is hand-burnished to reveal our signature sunset champagne lustre.'}
              </p>
            </div>
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D8A384]/12 mb-10">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] border transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D8A384] text-[#12060A] border-[#D8A384] font-semibold'
                    : 'bg-transparent text-[#C7B6AE] border-[#D8A384]/20 hover:border-[#D8A384]/55 hover:text-[#F7F1EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Metal Filter & Price Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="metal-filter">
              Filter by metal
            </label>
            <select
              id="metal-filter"
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value as MetalFinish | 'All')}
              className="px-3.5 py-2 bg-[#17090E] border border-[#D8A384]/25 text-xs text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
            >
              {metals.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Precious Metals' : m}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="sort-order">
              Sort products
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as 'featured' | 'price-asc' | 'price-desc')
              }
              className="px-3.5 py-2 bg-[#17090E] border border-[#D8A384]/25 text-xs text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
            >
              <option value="featured">Curated Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid: Strictly 2 columns on mobile, 3 on desktop */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3 border border-[#D8A384]/15 bg-[#17090E]">
            <p className="font-serif text-2xl text-[#E8C5B0]">No matching creations</p>
            <p className="text-sm text-[#C7B6AE]">
              Adjust your category or metal selection to view available pieces.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedMetal('All');
              }}
              className="mt-2 px-5 py-2.5 border border-[#D8A384]/40 text-xs uppercase tracking-[0.16em] text-[#E8C5B0] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(slug) => onNavigate('product', slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
