import React from 'react';
import { MEDIA_ASSETS } from '../data/products';
import { PageRoute } from '../types/jewellery';
import { LuxuryImage } from '../components/LuxuryImage';
import { MagneticButton } from '../components/MagneticButton';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#12060A] min-h-screen text-[#F7F1EB]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 space-y-20">
        {/* Hero Story Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
              Maison Heritage · Founded on Architecture
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F1EB] font-normal leading-[1.08]">
              Beyond the Ordinary. Crafted to Outlast Eras.
            </h1>
            <p className="text-base text-[#C7B6AE] leading-relaxed">
              Born between Place Vendôme’s drafting tables and Geneva’s stone-setting benches,
              ÉLORA was founded on a quiet conviction: fine jewellery should possess the clarity of
              modern sculpture and the warmth of heirloom rose gold.
            </p>
            <p className="text-base text-[#C7B6AE] leading-relaxed">
              Every alloy is mixed in small crucibles to achieve our signature rose-champagne hue,
              and every natural diamond is independently selected for optical symmetry before a
              sketch is ever approved.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <MagneticButton onClick={() => onNavigate('customise')}>
                Enter Customisation Studio
              </MagneticButton>
              <MagneticButton variant="secondary" onClick={() => onNavigate('contact')}>
                Visit a Salon
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[3/4] max-h-[640px] w-full overflow-hidden border border-[#D8A384]/20 bg-[#0B0507]">
              <LuxuryImage
                src={MEDIA_ASSETS.aboutSalon}
                alt="ÉLORA private high jewellery salon interior with burgundy paneling and rose-gold vitrines"
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Provenance & Discipline Strip */}
        <section className="bg-[#17090E] border border-[#D8A384]/18 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <p className="font-serif text-4xl text-[#E8C5B0] tabular-nums">100%</p>
            <h2 className="text-sm uppercase tracking-[0.16em] text-[#F7F1EB]">
              Traceable Provenance
            </h2>
            <p className="text-sm text-[#C7B6AE] leading-relaxed">
              Every stone adheres strictly to Kimberley Process certification and single-mine
              ethical origin auditing.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-serif text-4xl text-[#E8C5B0] tabular-nums">750 / 18k</p>
            <h2 className="text-sm uppercase tracking-[0.16em] text-[#F7F1EB]">
              Recycled Precious Gold
            </h2>
            <p className="text-sm text-[#C7B6AE] leading-relaxed">
              Our rose, yellow, and white gold alloys are refined exclusively from certified
              recycled European bullion.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-serif text-4xl text-[#E8C5B0] tabular-nums">240 hrs</p>
            <h2 className="text-sm uppercase tracking-[0.16em] text-[#F7F1EB]">
              Haute Joaillerie Benchwork
            </h2>
            <p className="text-sm text-[#C7B6AE] leading-relaxed">
              Signature parures undergo weeks of lost-wax carving, micro-pavé alignment, and hand
              buffing with silk threads.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
