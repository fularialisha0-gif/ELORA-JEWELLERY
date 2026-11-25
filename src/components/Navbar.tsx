import React, { useEffect, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { PageRoute } from '../types/jewellery';
import { useStore } from '../hooks/useStore';
import { EloraEmblem } from './EloraEmblem';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { cartCount, wishlist, setCartOpen, setWishlistOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLink = (route: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  const navItems: { label: string; route: PageRoute; activeMatch: PageRoute[] }[] = [
    { label: 'Home', route: 'home', activeMatch: ['home'] },
    {
      label: 'Collections',
      route: 'collections',
      activeMatch: ['collections', 'rings', 'necklaces', 'earrings', 'bracelets', 'product'],
    },
    { label: 'Customise', route: 'customise', activeMatch: ['customise'] },
    { label: 'Our Story', route: 'about', activeMatch: ['about'] },
    { label: 'Contact', route: 'contact', activeMatch: ['contact'] },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
          scrolled || currentRoute !== 'home'
            ? 'bg-[#12060A]/92 border-b border-[#D8A384]/18 backdrop-blur-md'
            : 'bg-gradient-to-b from-[#12060A]/80 to-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden w-10 h-10 -ml-2 inline-flex items-center justify-center text-[#F7F1EB] hover:text-[#E8C5B0] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleLink('home')}
              aria-label="ÉLORA Home"
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384]"
            >
              <EloraEmblem size="md" />
            </button>
          </div>

          {/* Zone 2: Primary Text Navigation */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = item.activeMatch.includes(currentRoute);
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleLink(item.route)}
                  className={`relative py-1 text-xs lg:text-sm tracking-[0.14em] uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384] ${
                    active ? 'text-[#E8C5B0]' : 'text-[#F7F1EB]/85 hover:text-[#E8C5B0]'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 right-0 -bottom-0.5 h-px bg-[#D8A384] transition-transform duration-200 origin-left ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Utility Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search collections"
              className="w-10 h-10 inline-flex items-center justify-center text-[#F7F1EB]/90 hover:text-[#E8C5B0] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384]"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => setWishlistOpen(true)}
              aria-label={`Wishlist (${wishlist.length} items)`}
              className="relative w-10 h-10 inline-flex items-center justify-center text-[#F7F1EB]/90 hover:text-[#E8C5B0] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384]"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1 min-w-[16px] h-4 px-1 bg-[#D8A384] text-[#12060A] text-[10px] font-semibold leading-4 text-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping bag (${cartCount} items)`}
              className="relative w-10 h-10 inline-flex items-center justify-center text-[#F7F1EB]/90 hover:text-[#E8C5B0] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384]"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1 min-w-[16px] h-4 px-1 bg-[#D8A384] text-[#12060A] text-[10px] font-semibold leading-4 text-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[84vw] max-w-sm bg-[#16070C] border-r border-[#D8A384]/20 flex flex-col h-full p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-[#D8A384]/15">
              <EloraEmblem size="sm" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="w-10 h-10 inline-flex items-center justify-center text-[#F7F1EB] hover:text-[#E8C5B0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#D8A384] mb-3">
                Maison Navigation
              </p>
              {[
                { label: 'Home', route: 'home' as PageRoute },
                { label: 'All Collections', route: 'collections' as PageRoute },
                { label: 'Rings', route: 'rings' as PageRoute },
                { label: 'Necklaces', route: 'necklaces' as PageRoute },
                { label: 'Earrings', route: 'earrings' as PageRoute },
                { label: 'Bracelets', route: 'bracelets' as PageRoute },
                { label: 'Customisation Studio', route: 'customise' as PageRoute },
                { label: 'Our Story', route: 'about' as PageRoute },
                { label: 'Contact & Salons', route: 'contact' as PageRoute },
              ].map((item) => (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleLink(item.route)}
                  className={`w-full text-left py-3 px-2 font-serif text-2xl transition-colors cursor-pointer ${
                    currentRoute === item.route
                      ? 'text-[#E8C5B0]'
                      : 'text-[#F7F1EB]/90 hover:text-[#E8C5B0]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-[#D8A384]/15 text-xs text-[#C7B6AE] space-y-2">
              <p className="text-[#E8C5B0] font-serif text-base">Beyond the Ordinary.</p>
              <p>Place Vendôme · Rue du Rhône · Mayfair</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
