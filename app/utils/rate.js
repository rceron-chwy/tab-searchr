export const rateTypeDescription = {
  U: 'UNIVERSAL',
  R: 'AGENCY',
  P: 'OPAQUE',
  M: 'MERCHANT',
  D: 'DISCLOSED',
};

export const appCodeDescription = {
  DESKTOP: 'DESKTOP',
  MOBILEWEB: 'MOBILEWEB',
  IPHONENEG: 'IPHONENEG',
  ANDROIDNEG: 'ANDROIDNEG',
};

export const gdsNames = {
  AGODA: 'AGODA',
  BOOKING: 'BOOKING',
  ENET: 'ENET',
  HOTELBEDS: 'HOTELBEDS',
  PEGASUS: 'PEGASUS',
  TOURICO: 'TOURICO',
};

export const gdsDefaultsListings = {
  DEFAULT: {
    minRateOnly: false,
    cugOnly: false,
    checkExpiration: true,
    includeSingleOcc: false,
    multiOccDisplay: false,
    metaClick: false,
    metaRequest: false,
    smartPrime: false,
    multiOccupancy: false
  },
};

export const gdsDefaultsDetails = {
  DEFAULT: {
    checkExpire: true,
    cugRateQuery: false,
    allRates: false,
    includeSingleOcc: false,
    multiOccDisplay: false,
    smartPrime: false,
    peakwork: false,
    metaClick: false,
    content: false,
    minRateOnly: false,
    allInclusivePrice: false,
    multiOccupancy: false,
    skipPropertyValidation: true
  },
  AGODA: {},
  BOOKING: {},
  ENET: {},
  HOTELBEDS: {},
  PEGASUS: {},
  TOURICO: {
    cugRateQuery: true,
  },
};

export const flagLabels = {
  minRateOnly: 'Min Rate Only',
  cugOnly: 'Include CUG Rates',
  checkExpiration: 'Validate Expiration',
  includeSingleOcc: 'Include Single Occ',
  multiOccDisplay: 'Include Multi Occ',
  metaClick: 'Meta Click',
  metaRequest: 'Meta Request',
  smartPrime: 'Smart Prime',
  multiOccupancy: 'Include Multi Occ',
  checkExpire: 'Validate Expiration',
  cugRateQuery: 'CUG Rate Query',
  allRates: 'All Rates',
  peakwork: 'Peak Work',
  content: 'Include Content',
  allInclusivePrice: 'All Inclusive Price',
  skipPropertyValidation: 'Skip Property Validation'
};
