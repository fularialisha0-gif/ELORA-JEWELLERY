import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, RotateCw } from 'lucide-react';
import {
  CustomRingConfig,
  DiamondShape,
  GemstoneOption,
  MetalFinish,
  RingDesignStyle,
} from '../types/jewellery';
import { formatCurrency, MEDIA_ASSETS } from '../data/products';
import { CameraPreset, JewelleryCanvas3D } from '../components/JewelleryCanvas3D';
import { MagneticButton } from '../components/MagneticButton';
import { useStore } from '../hooks/useStore';

const INITIAL_CONFIG: CustomRingConfig = {
  design: 'Solitaire Cathedral',
  shape: 'Round',
  metal: '18k Rose Gold',
  gemstone: 'White Diamond',
  carat: 2.0,
  ringSize: '52',
  engraving: '',
};

const DESIGN_STYLES: RingDesignStyle[] = [
  'Solitaire Cathedral',
  'Halo Pavé',
  'Architectural Bezel',
  'Split-Shank Ribbon',
];

const DIAMOND_SHAPES: DiamondShape[] = ['Round', 'Oval', 'Princess', 'Emerald'];

const METAL_FINISHES: { name: MetalFinish; swatch: string }[] = [
  { name: '18k Rose Gold', swatch: '#E3A688' },
  { name: '18k Yellow Gold', swatch: '#E8C268' },
  { name: '18k White Gold', swatch: '#E5E8EE' },
];

const GEMSTONES: { name: GemstoneOption; swatch: string; note: string }[] = [
  { name: 'White Diamond', swatch: '#F5F7FA', note: 'D-VVS1 Natural' },
  { name: 'Champagne Diamond', swatch: '#DFB68A', note: 'Fancy Warm' },
  { name: 'Burgundy Ruby', swatch: '#9E1432', note: 'Unheated Pigeon-Blood' },
  { name: 'Ceylon Sapphire', swatch: '#224BAE', note: 'Royal Cornflower' },
];

const RING_SIZES = ['48', '50', '52', '54', '56', '58'];

export const CustomisationStudioPage: React.FC = () => {
  const { addToCart } = useStore();
  const [config, setConfig] = useState<CustomRingConfig>(INITIAL_CONFIG);
  const [autoRotate, setAutoRotate] = useState(true);
  const [explode, setExplode] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('front');
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const estimatedPrice = useMemo(() => {
    const designBase: Record<RingDesignStyle, number> = {
      'Solitaire Cathedral': 4200,
      'Halo Pavé': 5900,
      'Architectural Bezel': 4800,
      'Split-Shank Ribbon': 5400,
    };
    const shapeAdd: Record<DiamondShape, number> = {
      Round: 800,
      Oval: 950,
      Princess: 700,
      Emerald: 1150,
    };
    const gemFactor: Record<GemstoneOption, number> = {
      'White Diamond': 4600,
      'Champagne Diamond': 4100,
      'Burgundy Ruby': 5400,
      'Ceylon Sapphire': 3900,
    };
    const metalAdd = config.metal === '18k White Gold' ? 350 : 0;
    return Math.round(
      designBase[config.design] +
        shapeAdd[config.shape] +
        gemFactor[config.gemstone] * Math.pow(config.carat, 1.38) +
        metalAdd
    );
  }, [config]);

  const handleReset = () => {
    setConfig(INITIAL_CONFIG);
    setExplode(0);
    setCameraPreset('front');
    setAutoRotate(true);
  };

  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-[#12060A] min-h-screen text-[#F7F1EB]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Studio Header */}
        <header className="pb-6 border-b border-[#D8A384]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D8A384]">
              Bespoke Interactive Atelier
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F1EB] font-normal mt-1">
              The ÉLORA Customisation Studio
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#C7B6AE]">
                Bespoke Valuation
              </p>
              <p className="font-serif text-2xl sm:text-3xl text-[#E8C5B0] tabular-nums">
                {formatCurrency(estimatedPrice)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="h-10 px-3.5 border border-[#D8A384]/30 text-xs uppercase tracking-[0.14em] text-[#C7B6AE] hover:text-[#F7F1EB] hover:border-[#D8A384] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </header>

        {/* Main Studio Grid: Unobstructed 3D Viewport + Configurator Controls */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Interactive 3D Viewport with Collapsible Bottom Dock */}
          <div className="lg:col-span-7 relative h-[430px] sm:h-[540px] lg:h-[640px] bg-gradient-to-b from-[#1A090F] via-[#12060A] to-[#0B0507] border border-[#D8A384]/20 overflow-hidden">
            {/* Minimal Top Spec Bar */}
            <div className="pointer-events-none absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2 text-xs text-[#E8C5B0]">
              <span className="bg-[#12060A]/80 border border-[#D8A384]/20 px-3 py-1.5">
                {config.design} · {config.carat.toFixed(2)} ct {config.shape}
              </span>
              <span className="hidden sm:inline bg-[#12060A]/80 border border-[#D8A384]/20 px-3 py-1.5 text-[#C7B6AE]">
                Drag to orbit · Scroll to inspect facets
              </span>
            </div>

            {/* Dedicated 3D Canvas Container */}
            <JewelleryCanvas3D
              mode="studio"
              design={config.design}
              shape={config.shape}
              metal={config.metal}
              gemstone={config.gemstone}
              carat={config.carat}
              autoRotate={autoRotate}
              explode={explode}
              cameraPreset={cameraPreset}
              fallbackImage={MEDIA_ASSETS.ringSolitaire}
            />

            {/* Collapsible Bottom Inspection Dock (zero center viewport occlusion, no backdrop-filter over WebGL) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[660px] flex flex-col items-center">
              <button
                type="button"
                onClick={() => setDockCollapsed((c) => !c)}
                className="px-3.5 py-1 bg-[#16070C] border border-b-0 border-[#D8A384]/30 text-[11px] uppercase tracking-[0.16em] text-[#E8C5B0] inline-flex items-center gap-1.5 cursor-pointer"
              >
                {dockCollapsed ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Show Controls</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Hide Controls</span>
                  </>
                )}
              </button>

              {!dockCollapsed && (
                <div className="w-full bg-[#16070C]/95 border border-[#D8A384]/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                  {/* Camera Angle Presets */}
                  <div className="flex items-center gap-1.5">
                    {(['front', 'crown', 'profile', 'detail'] as CameraPreset[]).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCameraPreset(preset)}
                        className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
                          cameraPreset === preset
                            ? 'bg-[#D8A384] text-[#12060A] border-[#D8A384] font-semibold'
                            : 'border-[#D8A384]/20 text-[#C7B6AE] hover:text-[#F7F1EB]'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Exploded Setting Architecture Slider */}
                  <label className="flex items-center gap-2.5 text-[11px] uppercase tracking-wider text-[#C7B6AE]">
                    <span>Explode</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={explode}
                      onChange={(e) => setExplode(parseFloat(e.target.value))}
                      className="w-20 sm:w-24 accent-[#D8A384] cursor-pointer"
                    />
                  </label>

                  {/* Auto-Rotate Toggle */}
                  <button
                    type="button"
                    onClick={() => setAutoRotate((r) => !r)}
                    className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border inline-flex items-center gap-1 cursor-pointer ${
                      autoRotate
                        ? 'border-[#D8A384] text-[#E8C5B0]'
                        : 'border-[#D8A384]/20 text-[#C7B6AE]'
                    }`}
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Orbit</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Configuration Panel */}
          <div className="lg:col-span-5 bg-[#17090E] border border-[#D8A384]/18 p-5 sm:p-7 space-y-6">
            {/* 1. Ring Architecture */}
            <div className="space-y-2.5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#D8A384]">
                01. Ring Architecture
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DESIGN_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, design: style }))}
                    className={`px-3 py-2.5 text-left text-xs border transition-colors cursor-pointer ${
                      config.design === style
                        ? 'border-[#D8A384] bg-[#D8A384]/15 text-[#F7F1EB]'
                        : 'border-[#D8A384]/18 text-[#C7B6AE] hover:border-[#D8A384]/45'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Diamond Cut Shape */}
            <div className="space-y-2.5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#D8A384]">
                02. Diamond Cut Shape
              </p>
              <div className="grid grid-cols-4 gap-2">
                {DIAMOND_SHAPES.map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, shape }))}
                    className={`py-2.5 px-2 text-center text-xs border transition-colors cursor-pointer ${
                      config.shape === shape
                        ? 'border-[#D8A384] bg-[#D8A384] text-[#12060A] font-semibold'
                        : 'border-[#D8A384]/18 text-[#C7B6AE] hover:border-[#D8A384]/45'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Precious Metal Finish */}
            <div className="space-y-2.5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#D8A384]">
                03. Precious Metal: <span className="text-[#F7F1EB]">{config.metal}</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {METAL_FINISHES.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, metal: m.name }))}
                    className={`p-2.5 flex items-center gap-2 text-xs border transition-colors cursor-pointer ${
                      config.metal === m.name
                        ? 'border-[#D8A384] bg-[#D8A384]/15 text-[#F7F1EB]'
                        : 'border-[#D8A384]/18 text-[#C7B6AE] hover:border-[#D8A384]/45'
                    }`}
                  >
                    <span
                      className="w-4 h-4 shrink-0 border border-white/25"
                      style={{ backgroundColor: m.swatch }}
                    />
                    <span className="truncate">{m.name.replace('18k ', '')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Gemstone Selection */}
            <div className="space-y-2.5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#D8A384]">
                04. Center Gemstone
              </p>
              <div className="grid grid-cols-2 gap-2">
                {GEMSTONES.map((g) => (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, gemstone: g.name }))}
                    className={`p-2.5 flex items-center gap-2.5 text-left border transition-colors cursor-pointer ${
                      config.gemstone === g.name
                        ? 'border-[#D8A384] bg-[#D8A384]/15 text-[#F7F1EB]'
                        : 'border-[#D8A384]/18 text-[#C7B6AE] hover:border-[#D8A384]/45'
                    }`}
                  >
                    <span
                      className="w-4 h-4 shrink-0 border border-white/25"
                      style={{ backgroundColor: g.swatch }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs truncate">{g.name}</p>
                      <p className="text-[10px] text-[#C7B6AE]/80 truncate">{g.note}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Carat Weight & Ring Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="uppercase tracking-[0.16em] text-[#D8A384]">05. Carat</span>
                  <span className="text-[#F7F1EB] tabular-nums">{config.carat.toFixed(2)} ct</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={3.0}
                  step={0.1}
                  value={config.carat}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, carat: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-[#D8A384] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <span className="block text-xs uppercase tracking-[0.16em] text-[#D8A384]">
                  06. Ring Size (EU)
                </span>
                <div className="flex gap-1.5">
                  {RING_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, ringSize: s }))}
                      className={`flex-1 h-8 text-xs border tabular-nums cursor-pointer ${
                        config.ringSize === s
                          ? 'border-[#D8A384] bg-[#D8A384] text-[#12060A] font-semibold'
                          : 'border-[#D8A384]/20 text-[#C7B6AE]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Private Engraving */}
            <div className="space-y-1.5">
              <label
                htmlFor="bespoke-engraving"
                className="block text-xs uppercase tracking-[0.16em] text-[#D8A384]"
              >
                07. Inner Band Engraving (Optional)
              </label>
              <input
                id="bespoke-engraving"
                type="text"
                maxLength={18}
                value={config.engraving}
                onChange={(e) => setConfig((prev) => ({ ...prev, engraving: e.target.value }))}
                placeholder="Initials or date (max 18 chars)"
                className="w-full px-3.5 py-2.5 bg-[#12060A] border border-[#D8A384]/25 text-sm text-[#F7F1EB] placeholder-[#C7B6AE]/50 focus:outline-none focus:border-[#D8A384]"
              />
            </div>

            {/* Selected Configuration Summary & Commission Action */}
            <div className="p-4 bg-[#12060A] border border-[#D8A384]/20 text-xs text-[#C7B6AE] space-y-1">
              <p className="text-[#E8C5B0] uppercase tracking-wider mb-1">
                Selected Bespoke Specification
              </p>
              <p>
                {config.design} · {config.shape} {config.gemstone} ({config.carat.toFixed(2)} ct)
              </p>
              <p>
                {config.metal} · EU Size {config.ringSize}
                {config.engraving ? ` · Engraved "${config.engraving}"` : ''}
              </p>
            </div>

            <MagneticButton
              onClick={() =>
                addToCart({
                  metal: config.metal,
                  size: config.ringSize,
                  customConfig: config,
                  customPrice: estimatedPrice,
                  customImage: MEDIA_ASSETS.ringSolitaire,
                })
              }
              className="w-full"
            >
              Add Bespoke Creation to Bag · {formatCurrency(estimatedPrice)}
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};
