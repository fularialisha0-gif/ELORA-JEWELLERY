import React, { useState } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [salon, setSalon] = useState('Paris · 14 Place Vendôme');
  const [topic, setTopic] = useState('Private High Jewellery Viewing');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#12060A] min-h-screen text-[#F7F1EB]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        <header className="pb-10 border-b border-[#D8A384]/15 space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
            Private Client Concierge
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F1EB] font-normal">
            Salons &amp; Private Appointments
          </h1>
          <p className="text-sm sm:text-base text-[#C7B6AE] max-w-2xl leading-relaxed">
            Arrange a discreet consultation in our Paris, Geneva, or London salons—or request a
            private gemologist video briefing from anywhere in the world.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Appointment Form */}
          <div className="lg:col-span-7 bg-[#17090E] border border-[#D8A384]/18 p-6 sm:p-10">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto border border-[#D8A384]/40 bg-[#280E16] flex items-center justify-center text-[#E8C5B0]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h2 className="font-serif text-3xl text-[#F7F1EB]">
                  Concierge Request Recorded
                </h2>
                <p className="text-sm text-[#C7B6AE] max-w-md mx-auto leading-relaxed">
                  Thank you, {name}. Your consultation request for {salon} ({topic}) has been
                  captured in this boutique preview.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-5 py-2.5 border border-[#D8A384]/35 text-xs uppercase tracking-[0.16em] text-[#E8C5B0] cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-serif text-3xl text-[#F7F1EB] pb-2">
                  Request a Private Consultation
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Claire de Vries"
                      className="w-full px-4 py-3 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="claire@domain.com"
                      className="w-full px-4 py-3 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                      Preferred Salon
                    </label>
                    <select
                      value={salon}
                      onChange={(e) => setSalon(e.target.value)}
                      className="w-full px-4 py-3 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
                    >
                      <option>Paris · 14 Place Vendôme</option>
                      <option>Geneva · 38 Rue du Rhône</option>
                      <option>London · 22 Mount Street</option>
                      <option>Private Virtual Atelier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                      Consultation Subject
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-4 py-3 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
                    >
                      <option>Private High Jewellery Viewing</option>
                      <option>Bespoke Studio Commission</option>
                      <option>Bridal &amp; Solitaire Fitting</option>
                      <option>Aftercare &amp; Appraisal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C7B6AE] mb-1.5">
                    Notes or Desired Creations
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share preferred dates, diamond shapes, or pieces you wish to inspect..."
                    className="w-full px-4 py-3 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] focus:outline-none focus:border-[#D8A384]"
                  />
                </div>

                <MagneticButton type="submit">Send Concierge Request</MagneticButton>
              </form>
            )}
          </div>

          {/* Flagship Salon Directory */}
          <div className="lg:col-span-5 space-y-5">
            {[
              {
                city: 'Paris Flagship',
                address: '14 Place Vendôme, 75001 Paris',
                phone: '+33 1 42 68 55 00',
                hours: 'Mon – Sat · 10:30 – 19:00',
              },
              {
                city: 'Geneva Atelier & Salon',
                address: '38 Rue du Rhône, 1204 Genève',
                phone: '+41 22 819 44 00',
                hours: 'Mon – Sat · 10:00 – 18:30',
              },
              {
                city: 'London Mayfair Salon',
                address: '22 Mount Street, Mayfair, London W1K 2TH',
                phone: '+44 20 7493 8820',
                hours: 'Mon – Sat · 10:00 – 18:30',
              },
            ].map((s) => (
              <div
                key={s.city}
                className="p-6 bg-[#17090E] border border-[#D8A384]/18 space-y-2.5"
              >
                <h3 className="font-serif text-2xl text-[#E8C5B0]">{s.city}</h3>
                <p className="text-sm text-[#F7F1EB] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D8A384] shrink-0" />
                  <span>{s.address}</span>
                </p>
                <p className="text-sm text-[#C7B6AE] flex items-center gap-2 tabular-nums">
                  <Phone className="w-4 h-4 text-[#D8A384] shrink-0" />
                  <span>{s.phone}</span>
                </p>
                <p className="text-xs text-[#C7B6AE] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D8A384] shrink-0" />
                  <span>{s.hours}</span>
                </p>
              </div>
            ))}

            <div className="p-6 bg-[#12060A] border border-[#D8A384]/18 flex items-center gap-3 text-sm text-[#C7B6AE]">
              <Mail className="w-4 h-4 text-[#D8A384] shrink-0" />
              <span>concierge@elora-maison.example</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
