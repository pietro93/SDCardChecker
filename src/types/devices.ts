export interface SDCardSpecs {
  type: string;
  minSpeed: string;
  minWriteSpeed: string;
  recommendedCapacity: string[];
  maxCapacity: string;
}

export interface RecommendedBrand {
  id: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Device {
  id: string;
  name: string;
  category: string;
  slug: string;
  searchTerms: string[];
  imageUrl: string;
  sdCard: SDCardSpecs;
  whySpecs: string;
  recommendedBrands: RecommendedBrand[];
  faq?: FAQ[];
  relatedDevices: string[];
  notes: string;
}

export interface DevicesData {
  devices: Device[];
}
