/**
 * Copy and figures for the auction page, transcribed from the Figma comp
 * (F8MOAGWXseU0ZudUHndgdR, node 2:5207). Kept apart from the views so the
 * screen can be pointed at a real listings API without touching layout.
 */

export const auction = {
  title: '1985 Porsche 911 Carrera 930 3.2',
  currentBid: '£35,250',
  currentBidLabel: 'Current Bid',
  photoCount: 34,
  videoCount: 1,
  saveCount: 42,
  countdown: '2d : 2h : 34m',
  reserveStatus: 'Reserve nearly met',
  stats: [
    { icon: 'Gavel', label: '13 Bids' },
    { icon: 'Comments', label: '6 Comments' },
    { icon: 'Eye', label: '320 watching' },
  ],
  latestActivity: {
    heading: 'Live auction activities',
    bidderInitials: 'UN',
    bidder: 'RickyBobby',
    tag: 'Bid',
    amount: '£32,000',
  },
  primaryAction: 'Place a bid',
  /**
   * Two columns of five, exactly as the comp splits them. `badge` rows render
   * an image asset instead of a vector glyph.
   */
  specs: [
    [
      { badge: 'aa', label: 'Inspected', underline: true },
      { icon: 'SteeringWheel', label: 'Left hand drive' },
      { icon: 'Gearbox', label: 'Manual, 4 speed' },
      { icon: 'Calendar', label: '1985' },
      { icon: 'Seller', label: 'Private seller' },
    ],
    [
      { badge: 'flag', label: 'London, UK' },
      { icon: 'Odometer', label: '8,765 miles' },
      { icon: 'Engine', label: '3200cc' },
      { icon: 'FuelPump', label: 'Petrol' },
      { icon: 'PaintDrip', label: 'Red' },
    ],
  ],
  highlights: {
    heading: 'Highlights',
    bullets: [
      'One registered Californian keeper from new',
      'Highly original and wonderfully preserved state',
      'Runs well after partial engine restoration',
      '140bhp fuel injected car with desirable five-speed transmission',
    ],
    readMore: 'Read more',
    readLess: 'Read less',
    /**
     * Revealed by "Read more" (Figma 235:2187). The comp leaves the history
     * body hidden even when expanded, which would strand its heading with
     * nothing under it — so the paragraphs from the file are shown here.
     */
    expanded: {
      description: [
        'Here is a real find. It is a one keeper, early 911 that has never been restored and oozes originality. That it is a 911E with the fuel injected, 140bhp Type 901 2litre engine adds to the appeal. Just 858 911E Targas like this one were ever built.',
        'Recently arrived in Czechia, it presents beautifully in Burgundrot red metallic, 14in Fuchs and a highly preserved black interior. There is even an optional 5spd gearbox and exceptionally rare Coolair air conditioning.',
        'It is unlikely you\u2019ll easily find another 911E quite like this one. From specification to provenance, this is one not to miss.',
      ],
      historyHeading: 'History and paperwork',
      history: [
        'Sold new in California, USA',
        'Only one owner in the USA before export to the Czech Republic',
        'Not registered in the Czech Republic yet',
        'Complete documentation including the original service book',
        'Factory handbooks in good condition',
        'VIN confirms this is a factory 911E built in 1969 as a Targa',
        'Only 2,826 Type 901 2litre 911Es were built during its single production year of 1969',
        'Just 858 were Targas of which this car is number 524',
      ],
    },
  },
  interest: {
    heading: 'Interest in this vehicle?',
    description: '350 viewers watching this vehicle.',
    location: 'Boroughbridge, United Kingdom',
    specialistInitials: 'IT',
    specialistName: 'Lewis Hamilton',
    specialistRole: 'Consignment specialist',
    contactAction: 'Contact me',
    viewingAction: 'Request a viewing',
  },
  report: {
    heading: 'AA inspection report',
    description:
      'Bid with confidence knowing this vehicle has been independently inspected by the AA.',
    action: 'Read full report',
  },
  insurance: {
    heading: 'We make buying easier',
    // The creative is a fixed 361x310 export; the CTA sits in its lower 48px.
    ctaLabel: 'Get a quote in minutes',
  },
  gallery: {
    heading: 'Gallery',
    // Each thumbnail names the sheet category it opens on.
    thumbnails: [
      { label: 'Exterior', category: 'exterior' },
      { label: 'Interior', category: 'interior' },
      { label: 'Engine', category: 'engine' },
      { label: 'Interior', category: 'interior' },
    ],
  },
  /**
   * The gallery sheet (Figma 2:7881 video / 2:8090 photos). Both badges on the
   * hero open the same sheet — they differ only in which tab starts selected.
   * Every row points at the one committed listing photo; a real listing would
   * carry its own per-image URLs here.
   */
  gallerySheet: {
    heading: 'Gallery',
    tabs: [
      { key: 'video', glyph: 'HeroVideos', label: 'Video' },
      { key: 'photos', glyph: 'HeroImages', label: 'Photos' },
    ],
    categories: [
      { key: 'exterior', label: 'Exterior', count: 14 },
      { key: 'interior', label: 'Interior', count: 12 },
      { key: 'engine', label: 'Engine', count: 8 },
    ],
  },
  buyerGuide: {
    heading: 'Buying with Car & Classic',
    cards: [
      {
        icon: 'GuideGavel',
        heading: 'How bidding works',
        description: 'All you need to know about the bidding process on Car & Classic',
      },
      {
        icon: 'GuideFiveSteps',
        heading: 'Five steps to buying',
        description: 'We make it simple and safe to get the classic of your dreams',
      },
      {
        icon: 'GuideTruck',
        heading: 'Shipping & transport',
        description: 'Useful information on collecting your new vehicle',
      },
      {
        icon: 'GuideLock',
        heading: 'Secure payments',
        description: 'How we protect you and your money, to make C&C the safest place to transact.',
      },
    ],
  },
};
