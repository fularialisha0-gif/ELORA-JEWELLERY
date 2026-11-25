import React from 'react';
import { PageRoute } from '../types/jewellery';
import { EloraEmblem } from './EloraEmblem';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B0507] border-t border-[#D8A384]/15 text-[#C7B6AE]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Maison Identity */}
          <div className="md:col-span-4 space-y-4">
            <EloraEmblem size="md" />
            <p className="font-serif italic text-xl text-[#E8C5B0]">Beyond the Ordinary.</p>
            <p className="text-sm leading-relaxed max-w-sm text-[#C7B6AE]/90">
              High jewellery conceived in Paris and hand-set in Geneva. Responsibly sourced natural
              diamonds and solid 18k alloys forged for generations.
            </p>
          </div>

          {/* Collections */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#E8C5B0]">Collections</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'All Creations', route: 'collections' as PageRoute },
                { label: 'Rings', route: 'rings' as PageRoute },
                { label: 'Necklaces', route: 'necklaces' as PageRoute },
                { label: 'Earrings', route: 'earrings' as PageRoute },
                { label: 'Bracelets', route: 'bracelets' as PageRoute },
              ].map((link) => (
                <li key={link.route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.route)}
                    className="hover:text-[#F7F1EB] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* The Maison */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#E8C5B0]">The Maison</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('customise')}
                  className="hover:text-[#F7F1EB] transition-colors cursor-pointer"
                >
                  ÉLORA Customisation Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#F7F1EB] transition-colors cursor-pointer"
                >
                  Heritage & Craftsmanship
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#F7F1EB] transition-colors cursor-pointer"
                >
                  Private Salon Appointments
                </button>
              </li>
            </ul>
          </div>

          {/* Flagship Salons */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#E8C5B0]">Flagship Salons</h4>
            <div className="space-y-2.5 text-sm">
              <p>
                <span className="text-[#F7F1EB]">Paris:</span> 14 Place Vendôme, 75001
              </p>
              <p>
                <span className="text-[#F7F1EB]">Geneva:</span> 38 Rue du Rhône, 1204
              </p>
              <p>
                <span className="text-[#F7F1EB]">London:</span> 22 Mount Street, Mayfair
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#D8A384]/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#C7B6AE]/75">
          <p>© {new Date().getFullYear()} Maison ÉLORA Haute Joaillerie. All rights reserved.</p>
          <p>Kimberley Process Certified · Insured Global Courier · Private Concierge</p>
        </div>
      </div>
    </footer>
  );
};
