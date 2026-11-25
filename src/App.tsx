import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PageRoute } from './types/jewellery';
import { StoreProvider } from './hooks/useStore';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OpeningCurtain } from './components/OpeningCurtain';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastNotification } from './components/ToastNotification';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomisationStudioPage } from './pages/CustomisationStudioPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

function parseHashRoute(): { route: PageRoute; slug?: string } {
  if (typeof window === 'undefined') return { route: 'home' };
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw) return { route: 'home' };
  const [first, second] = raw.split('/');
  const valid: PageRoute[] = [
    'home',
    'collections',
    'rings',
    'necklaces',
    'earrings',
    'bracelets',
    'product',
    'customise',
    'about',
    'contact',
  ];
  if (valid.includes(first as PageRoute)) {
    return { route: first as PageRoute, slug: second };
  }
  return { route: 'home' };
}

const AppShell: React.FC = () => {
  const [navState, setNavState] = useState<{ route: PageRoute; slug?: string }>(() =>
    parseHashRoute()
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onHashChange = () => setNavState(parseHashRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((route: PageRoute, slug?: string) => {
    const nextHash = slug ? `#/${route}/${slug}` : route === 'home' ? '#/' : `#/${route}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    setNavState({ route, slug });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const renderPage = () => {
    switch (navState.route) {
      case 'collections':
        return (
          <CollectionPage
            key="collections"
            initialCategory="All"
            title="All Collections"
            subtitle="Explore every ring, necklace, earring, bracelet, and numbered high jewellery piece crafted in our Paris and Geneva ateliers."
            onNavigate={navigate}
          />
        );
      case 'rings':
        return (
          <CollectionPage
            key="rings"
            initialCategory="Rings"
            title="Rings"
            subtitle="Cathedral solitaires, architectural emerald cuts, and sculpted split-shank silhouettes forged in 18k rose, yellow, and white gold."
            onNavigate={navigate}
          />
        );
      case 'necklaces':
        return (
          <CollectionPage
            key="necklaces"
            initialCategory="Necklaces"
            title="Necklaces"
            subtitle="Floating solitaire pendants and articulated diamond rivières engineered for fluid luminescence."
            onNavigate={navigate}
          />
        );
      case 'earrings':
        return (
          <CollectionPage
            key="earrings"
            initialCategory="Earrings"
            title="Earrings"
            subtitle="Matched pear diamond drops and French-cut pavé huggies crafted for poised, weightless radiance."
            onNavigate={navigate}
          />
        );
      case 'bracelets':
        return (
          <CollectionPage
            key="bracelets"
            initialCategory="Bracelets"
            title="Bracelets"
            subtitle="Satin-brushed rose gold cuffs and perpetual diamond tennis lines balanced for effortless daily wear."
            onNavigate={navigate}
          />
        );
      case 'product':
        return (
          <ProductDetailPage
            key={`product-${navState.slug || 'default'}`}
            slug={navState.slug || 'lumiere-solitaire-ring'}
            onNavigate={navigate}
          />
        );
      case 'customise':
        return <CustomisationStudioPage key="customise" />;
      case 'about':
        return <AboutPage key="about" onNavigate={navigate} />;
      case 'contact':
        return <ContactPage key="contact" />;
      case 'home':
      default:
        return <HomePage key="home" onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#12060A] text-[#F7F1EB]">
      <OpeningCurtain />
      <Navbar currentRoute={navState.route} onNavigate={navigate} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${navState.route}-${navState.slug || ''}`}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigate} />

      {/* E-Commerce Modals & Slide-Over Drawers */}
      <CartDrawer />
      <WishlistDrawer onViewProduct={(slug) => navigate('product', slug)} />
      <SearchOverlay onViewProduct={(slug) => navigate('product', slug)} />
      <QuickViewModal onViewFullDetails={(slug) => navigate('product', slug)} />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
