export type JewelleryCategory =
  | 'Rings'
  | 'Necklaces'
  | 'Earrings'
  | 'Bracelets'
  | 'Signature';

export type MetalFinish = '18k Rose Gold' | '18k Yellow Gold' | '18k White Gold';

export type DiamondShape = 'Round' | 'Oval' | 'Princess' | 'Emerald';

export type RingDesignStyle =
  | 'Solitaire Cathedral'
  | 'Halo Pavé'
  | 'Architectural Bezel'
  | 'Split-Shank Ribbon';

export type GemstoneOption =
  | 'White Diamond'
  | 'Champagne Diamond'
  | 'Burgundy Ruby'
  | 'Ceylon Sapphire';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface JewelleryProduct {
  id: string;
  slug: string;
  name: string;
  collection: string;
  category: JewelleryCategory;
  price: number;
  shortDescription: string;
  editorialDescription: string;
  images: string[];
  availableMetals: MetalFinish[];
  availableSizes?: string[];
  supports3D: boolean;
  default3DConfig?: {
    design: RingDesignStyle;
    shape: DiamondShape;
    metal: MetalFinish;
    gemstone: GemstoneOption;
  };
  specifications: ProductSpecification[];
  featured?: boolean;
  editionNote?: string;
}

export interface CustomRingConfig {
  design: RingDesignStyle;
  shape: DiamondShape;
  metal: MetalFinish;
  gemstone: GemstoneOption;
  carat: number;
  ringSize: string;
  engraving: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  category: string;
  image: string;
  metal: MetalFinish;
  size?: string;
  unitPrice: number;
  quantity: number;
  customConfig?: CustomRingConfig;
}

export type PageRoute =
  | 'home'
  | 'collections'
  | 'rings'
  | 'necklaces'
  | 'earrings'
  | 'bracelets'
  | 'product'
  | 'customise'
  | 'about'
  | 'contact';
