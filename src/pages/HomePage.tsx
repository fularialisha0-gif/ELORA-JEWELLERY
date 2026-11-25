import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PageRoute } from '../types/jewellery';
import { MEDIA_ASSETS, PRODUCTS } from '../data/products';
import { CinematicVideoFrame } from '../components/CinematicVideoFrame';
import { LuxuryImage } from '../components/LuxuryImage';
import { ProductCard } from '../components/ProductCard';
import { MagneticButton } from '../components/MagneticButton';
import { EloraEmblem } from '../components/EloraEmblem';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.elora-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const signatureProducts = PRODUCTS.filter((p) => p.featured).slice(0, 6);

  return (
    <div ref={containerRef} className="bg-[#12060A] text-[#F7F1EB]">
      {/* 1. CINEMATIC FULL-SCREEN JEWELLERY VIDEO HERO */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#12060A]">
        {/* Full-screen cinematic jewellery video background */}
        <div className="absolute inset-0 z-0">
          <CinematicVideoFrame
            videoSrc="/videos/hero-jewellery.mp4"
            posterSrc={MEDIA_ASSETS.heroBackdrop}
            posterAlt="Maison ÉLORA diamond necklace luxury showcase film"
            showControls={true}
            allowSound={false}
            priority={true}
            aspectClassName="w-full h-full"
            videoClassName="object-center brightness-[0.94] contrast-[1.04]"
            scrimClassName="bg-gradient-to-r from-[#12060A]/88 via-[#12060A]/38 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#12060A] to-transparent pointer-events-none" />
        </div>

        {/* Hero Editorial Foreground */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-5 sm:px-8 pt-28 pb-24 lg:py-28 pointer-events-none">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-6 pointer-events-auto"
          >
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-[#D8A384]">
                Haute Joaillerie · Paris &amp; Geneva
              </p>
              <div className="pt-1">
                <EloraEmblem size="lg" />
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-normal text-[#F7F1EB] leading-[1.06] tracking-tight">
                Beyond the Ordinary.
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#E8C5B0]/90 max-w-lg leading-relaxed">
              Architectural diamonds and hand-forged 18k rose gold, sculpted to capture light as an
              intimate sculpture rather than mere ornament.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton onClick={() => onNavigate('collections')}>
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <button
                type="button"
                onClick={() => onNavigate('customise')}
                className="px-5 py-3 text-xs sm:text-sm uppercase tracking-[0.14em] text-[#E8C5B0] hover:text-[#F7F1EB] bg-[#12060A]/55 border border-[#E8C5B0]/35 hover:border-[#D8A384] transition-colors whitespace-nowrap cursor-pointer"
              >
                Customisation Studio
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE SIGNATURE COLLECTION */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 max-w-[1440px] mx-auto">
        <div className="elora-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14 pb-6 border-b border-[#D8A384]/15">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
              01 · The Signature Collection
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F1EB] font-normal">
              Sculpted in Light &amp; Rose Gold
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.16em]">
            {(['rings', 'necklaces', 'earrings', 'bracelets'] as PageRoute[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onNavigate(cat)}
                className="text-[#C7B6AE] hover:text-[#E8C5B0] transition-colors whitespace-nowrap cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile strictly 2 cards per row; Desktop spacious 3-column luxury grid */}
        <div className="elora-reveal grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {signatureProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(slug) => onNavigate('product', slug)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <MagneticButton variant="secondary" onClick={() => onNavigate('collections')}>
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </section>

      {/* 3. A. THE ART OF BRILLIANCE (CINEMATIC VIDEO SECTION) */}
      <section className="py-16 sm:py-24 bg-[#17090E] border-y border-[#D8A384]/15">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="elora-reveal lg:col-span-6 flex justify-center lg:justify-start">
            <CinematicVideoFrame
              videoSrc="/videos/jewellery-editorial.mp4"
              posterSrc={MEDIA_ASSETS.craftsmanshipFilm}
              posterAlt="Master goldsmith hand-setting a brilliant diamond into 18k rose gold"
              captionSubtitle="Atelier Film · Place Vendôme"
              captionTitle="Two hundred hours of quiet handwork."
              aspectClassName="aspect-[4/5] w-full max-w-[460px] lg:max-w-[500px]"
              className="border border-[#D8A384]/20"
            />
          </div>

          <div className="elora-reveal lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
              02 · The Art of Brilliance
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F1EB] font-normal leading-tight">
              Forged by Hand, Measured in Light.
            </h2>
            <p className="text-sm sm:text-base text-[#C7B6AE] leading-relaxed">
              Every ÉLORA mount begins as raw 18-karat rose gold alloyed with refined copper and
              silver for an unmistakable sunset warmth. Our master setters carve each claw beneath
              40x magnification so metal vanishes behind pure optical fire.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#D8A384]/15">
              <div>
                <p className="font-serif text-3xl text-[#E8C5B0] tabular-nums">57</p>
                <p className="text-xs text-[#C7B6AE] mt-1">Hand-aligned optical facets per stone</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[#E8C5B0] tabular-nums">100%</p>
                <p className="text-xs text-[#C7B6AE] mt-1">Traceable conflict-free natural gems</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. B. DIAMOND STORIES (MACRO CINEMATIC VIDEO SECTION) */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 max-w-[1440px] mx-auto">
        <div className="elora-reveal max-w-2xl mb-10 space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
            03 · Diamond Stories
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F1EB] font-normal">
            Architecture Inside a Single Stone.
          </h2>
          <p className="text-sm sm:text-base text-[#C7B6AE] leading-relaxed">
            Selected from the top one percent of natural D–F clarity stones, each diamond is
            chosen for balanced dispersion—returning warm champagne reflections alongside razor-sharp
            white brilliance.
          </p>
        </div>

        <div className="elora-reveal">
          <CinematicVideoFrame
            videoSrc="/videos/diamond-closeup.mp4"
            posterSrc={MEDIA_ASSETS.diamondCloseup}
            posterAlt="Macro study of a brilliant-cut diamond refracting warm champagne light"
            captionSubtitle="Macro Study · Natural Dispersion"
            captionTitle="Refraction without compromise."
            className="border border-[#D8A384]/20"
            aspectClassName="aspect-square sm:aspect-[16/10] max-h-[640px] w-full"
          />
        </div>
      </section>

      {/* 4B. ROSE GOLD & EARRINGS EDITORIAL COLLECTIONS */}
      <section className="py-20 sm:py-24 bg-[#17090E] border-y border-[#D8A384]/15">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Rose Gold Collection Video */}
          <div className="elora-reveal flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
                04A · Rose Gold Collection
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F1EB] font-normal">
                Warmth Forged in 18k Rose Gold.
              </h2>
              <p className="text-sm text-[#C7B6AE] leading-relaxed">
                Our signature rose-champagne alloy pairs sunset copper warmth with hand-burnished
                cathedral silhouettes and satin-brushed cuffs.
              </p>
            </div>
            <CinematicVideoFrame
              videoSrc="/videos/rosegold-editorial.mp4"
              posterSrc={MEDIA_ASSETS.ringSolitaire}
              posterAlt="18k rose gold fine jewellery editorial film"
              captionSubtitle="18k Rose Gold Atelier"
              captionTitle="Luminous copper-gold warmth."
              aspectClassName="aspect-[4/5] max-h-[540px] w-full"
              className="border border-[#D8A384]/20"
            />
            <div>
              <MagneticButton variant="secondary" onClick={() => onNavigate('rings')}>
                <span>Explore Rose Gold Pieces</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          {/* Earrings Collection Video */}
          <div className="elora-reveal flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
                04B · Earrings Collection
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F1EB] font-normal">
                Poised Radiance in Motion.
              </h2>
              <p className="text-sm text-[#C7B6AE] leading-relaxed">
                Matched pear diamond drops and French-cut pavé hoops engineered for weightless
                movement that catches every turn of the light.
              </p>
            </div>
            <CinematicVideoFrame
              videoSrc="/videos/earrings-editorial.mp4"
              posterSrc={MEDIA_ASSETS.earringsDrop}
              posterAlt="ÉLORA diamond drop earrings editorial film"
              captionSubtitle="Earrings Collection"
              captionTitle="Sculpted for effortless motion."
              aspectClassName="aspect-[4/5] max-h-[540px] w-full"
              className="border border-[#D8A384]/20"
            />
            <div>
              <MagneticButton variant="secondary" onClick={() => onNavigate('earrings')}>
                <span>Explore Earrings Collection</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* 5. D. OUR PHILOSOPHY (CHAMPAGNE CONTRAST EDITORIAL BAND) */}
      <section className="py-20 sm:py-28 bg-[#F3EAE0] text-[#1C090F]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="elora-reveal lg:col-span-6 space-y-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#6E263D]">
              04 · Our Philosophy
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1C090F] font-normal leading-tight">
              Luxury Is Never Loud. It Endures in Silhouette and Weight.
            </h2>
          </div>

          <div className="elora-reveal lg:col-span-6 space-y-6">
            <p className="text-base text-[#3E1623] leading-relaxed">
              ÉLORA rejects fleeting ornament. Every collar, cuff, and cathedral ring is balanced
              for effortless tactile poise—designed to warm against skin and carry private memory
              across generations.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="px-6 py-3 bg-[#1C090F] text-[#F7F1EB] hover:bg-[#3E1623] text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                Read Maison Heritage
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 border border-[#1C090F]/35 text-[#1C090F] hover:border-[#1C090F] text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                Book Private Viewing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. E. THE ÉLORA EXPERIENCE — GATEWAY TO CUSTOMISATION STUDIO */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 max-w-[1440px] mx-auto">
        <div className="elora-reveal bg-[#17090E] border border-[#D8A384]/22 p-7 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
              05 · The ÉLORA Experience
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F1EB] font-normal leading-tight">
              Compose Your Own Creation in Real-Time 3D.
            </h2>
            <p className="text-sm sm:text-base text-[#C7B6AE] leading-relaxed max-w-xl">
              Step inside the ÉLORA Customisation Studio. Select your architectural setting, diamond
              cut, precious metal alloy, and gemstone hue—inspect every prong and facet in 360°
              before commissioning your piece.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <MagneticButton onClick={() => onNavigate('customise')}>
                <Sparkles className="w-4 h-4" />
                <span>Launch Customisation Studio</span>
              </MagneticButton>
              <MagneticButton variant="secondary" onClick={() => onNavigate('collections')}>
                <Compass className="w-4 h-4" />
                <span>Browse Ready-to-Wear</span>
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-5 h-[300px] sm:h-[360px] bg-[#12060A] border border-[#D8A384]/20 relative overflow-hidden">
            <LuxuryImage
              src={MEDIA_ASSETS.ringEmerald}
              alt="Architectural 18k rose gold emerald-cut diamond ring with pavé shoulders"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12060A]/75 via-transparent to-transparent pointer-events-none" />
            <p className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.2em] text-[#E8C5B0]">
              Bespoke Atelier · 18k Rose Gold
            </p>
          </div>
        </div>
      </section>

      {/* 7. LUXURY PACKAGING & PRESENTATION */}
      <section className="py-16 sm:py-24 bg-[#17090E] border-t border-[#D8A384]/15">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="elora-reveal lg:col-span-5 space-y-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
              06 · Luxury Packaging
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F1EB] font-normal leading-tight">
              An Unboxing Ceremony Worthy of the Stone.
            </h2>
            <p className="text-sm sm:text-base text-[#C7B6AE] leading-relaxed">
              Every ÉLORA creation arrives nestled inside a hand-lacquered deep burgundy coffret,
              sealed with satin champagne ribbon, GIA provenance archive, and complimentary
              insured armored courier delivery.
            </p>
            <div className="pt-2">
              <MagneticButton variant="secondary" onClick={() => onNavigate('collections')}>
                <span>Discover the Maison</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          <div className="elora-reveal lg:col-span-7">
            <CinematicVideoFrame
              videoSrc="/videos/luxury-unboxing.mp4"
              posterSrc={MEDIA_ASSETS.aboutSalon}
              posterAlt="Maison ÉLORA luxury burgundy coffret unboxing presentation"
              captionSubtitle="Signature Presentation"
              captionTitle="Burgundy lacquer & rose-gold seal."
              aspectClassName="aspect-[16/9]"
              className="border border-[#D8A384]/20"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
