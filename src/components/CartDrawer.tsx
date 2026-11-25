import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { formatCurrency } from '../data/products';
import { LuxuryImage } from './LuxuryImage';
import { MagneticButton } from './MagneticButton';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderRef, setOrderRef] = useState('');

  if (!isCartOpen) return null;

  const handleClose = () => {
    setCartOpen(false);
    if (step === 'confirmed') setStep('bag');
  };

  const handlePlaceDemoOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = `ELR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(randomCode);
    clearCart();
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      <div className="fixed inset-0 bg-black/75" onClick={handleClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md bg-[#16070C] border-l border-[#D8A384]/25 flex flex-col h-full text-[#F7F1EB]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#D8A384]/15 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-[#F7F1EB]">
              {step === 'bag'
                ? 'Your Selection'
                : step === 'checkout'
                  ? 'Atelier Checkout'
                  : 'Reservation Confirmed'}
            </h2>
            <p className="text-xs text-[#C7B6AE] mt-0.5">
              Complimentary armored courier delivery included
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close shopping bag"
            className="w-10 h-10 inline-flex items-center justify-center text-[#C7B6AE] hover:text-[#F7F1EB] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'confirmed' ? (
            <div className="py-10 text-center space-y-5">
              <div className="w-14 h-14 mx-auto border border-[#D8A384]/40 bg-[#280E16] flex items-center justify-center text-[#E8C5B0]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D8A384]">
                  Demonstration Receipt · {orderRef}
                </p>
                <h3 className="font-serif text-3xl text-[#F7F1EB]">
                  Thank you, {customerName || 'Valued Client'}
                </h3>
                <p className="text-sm text-[#C7B6AE] leading-relaxed">
                  Your bespoke atelier reservation has been recorded locally for demonstration.
                  No real payment or external order transmission was processed.
                </p>
              </div>
              <div className="p-4 border border-[#D8A384]/20 bg-[#12060A] text-left text-xs text-[#C7B6AE] space-y-1.5">
                <p>
                  <span className="text-[#E8C5B0]">Dispatch Destination:</span>{' '}
                  {shippingAddress || 'Private Residence'}, {shippingCity || 'Geneva'}
                </p>
                <p>
                  <span className="text-[#E8C5B0]">Confirmation Copy:</span>{' '}
                  {customerEmail || 'concierge@elora-maison.example'}
                </p>
              </div>
              <MagneticButton onClick={handleClose} className="w-full">
                Return to Maison
              </MagneticButton>
            </div>
          ) : step === 'checkout' ? (
            <form id="elora-demo-checkout" onSubmit={handlePlaceDemoOrder} className="space-y-4">
              <div className="p-3.5 border border-[#D8A384]/25 bg-[#1C090F] text-xs text-[#E8C5B0] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Boutique Demonstration Mode: This interactive checkout previews the client order
                  experience without charging a payment method.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Camille Laurent"
                  className="w-full px-3.5 py-2.5 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                  Private Email
                </label>
                <input
                  required
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="camille@domain.com"
                  className="w-full px-3.5 py-2.5 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="Paris"
                    className="w-full px-3.5 py-2.5 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                    Delivery Method
                  </label>
                  <div className="px-3.5 py-2.5 bg-[#12060A] border border-[#D8A384]/20 text-xs text-[#E8C5B0] leading-tight">
                    Insured Courier
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                  Delivery Address
                </label>
                <input
                  required
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="14 Rue Saint-Honoré"
                  className="w-full px-3.5 py-2.5 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
                />
              </div>

              <div className="pt-3 border-t border-[#D8A384]/15 space-y-2 text-sm">
                <div className="flex justify-between text-[#C7B6AE]">
                  <span>Creations ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span className="tabular-nums">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#C7B6AE]">
                  <span>Insured Armored Delivery</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between text-[#F7F1EB] font-medium pt-2 border-t border-[#D8A384]/15">
                  <span>Estimated Total</span>
                  <span className="tabular-nums text-[#E8C5B0]">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
              </div>
            </form>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-serif text-2xl text-[#E8C5B0]">Your bag is empty</p>
              <p className="text-sm text-[#C7B6AE]">
                Explore our signature collections or compose a ring in the ÉLORA Customisation
                Studio.
              </p>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.map((item) => (
                <li
                  key={item.cartItemId}
                  className="flex gap-4 pb-5 border-b border-[#D8A384]/15"
                >
                  <div className="w-20 h-20 shrink-0 bg-[#0B0507] border border-[#D8A384]/15 overflow-hidden">
                    <LuxuryImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg text-[#F7F1EB] leading-snug">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#C7B6AE] hover:text-[#E8C5B0] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#C7B6AE] mt-1">
                      {item.metal}
                      {item.size ? ` · Size ${item.size}` : ''}
                    </p>
                    {item.customConfig && (
                      <p className="text-[11px] text-[#D8A384] mt-1">
                        {item.customConfig.carat.toFixed(2)} ct · {item.customConfig.shape}
                        {item.customConfig.engraving
                          ? ` · Engraved "${item.customConfig.engraving}"`
                          : ''}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#D8A384]/25">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 inline-flex items-center justify-center hover:bg-[#280E16] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 inline-flex items-center justify-center hover:bg-[#280E16] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-[#F3EAE0] tabular-nums">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'bag' && cart.length > 0 && (
          <div className="p-6 border-t border-[#D8A384]/15 bg-[#12060A] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-[#C7B6AE]">Subtotal</span>
              <span className="font-serif text-2xl text-[#E8C5B0] tabular-nums">
                {formatCurrency(cartSubtotal)}
              </span>
            </div>
            <MagneticButton onClick={() => setStep('checkout')} className="w-full">
              Proceed to Checkout Demo
            </MagneticButton>
          </div>
        )}

        {step === 'checkout' && (
          <div className="p-6 border-t border-[#D8A384]/15 bg-[#12060A] flex gap-3">
            <MagneticButton variant="secondary" onClick={() => setStep('bag')} className="flex-1">
              Back
            </MagneticButton>
            <MagneticButton type="submit" form="elora-demo-checkout" className="flex-[1.6]">
              Complete Reservation
            </MagneticButton>
          </div>
        )}
      </div>
    </div>
  );
};
