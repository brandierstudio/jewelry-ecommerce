/**
 * IQBAL SONS JEWELLERS — LUXURY E-COMMERCE DATA STORE
 * Complete catalogue, collections, metals, bespoke atelier options & currency rates
 */

const JEWELRY_DATA = {
  brand: {
    name: "Iqbal Sons Jewellers",
    established: "1984",
    tagline: "Form, Meaning, and Metal — United",
    subtitle: "Haute Joaillerie & Bespoke Diamond Atelier",
    description: "We design custom rings with unique geometry and a story behind every piece. No templates. Only your idea and our expertise.",
    currency: "USD",
    rates: {
      USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
      PKR: { symbol: "Rs. ", rate: 278.0, label: "PKR (Rs)" },
      AED: { symbol: "AED ", rate: 3.67, label: "AED (د.إ)" },
      GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
      EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" }
    }
  },

  collections: [
    { id: "all", name: "All Pieces", count: 8 },
    { id: "bespoke-rings", name: "Bespoke Rings", count: 4 },
    { id: "haute-joaillerie", name: "Haute Joaillerie", count: 3 },
    { id: "diamond-solitaires", name: "Solitaire Diamonds", count: 3 },
    { id: "bridal-suites", name: "Bridal Suites", count: 2 },
    { id: "gold-essentials", name: "Gold Essentials", count: 3 }
  ],

  products: [
    {
      id: "prod-01",
      name: "The Duo Contour Band",
      subtitle: "Geometric Precision Wedding Band",
      collection: "bespoke-rings",
      priceUSD: 1850,
      featured: true,
      image: "assets/product-duo-band.jpg",
      hoverImage: "assets/product-solitaire.jpg",
      description: "Cast in solid platinum PT950 with an architectural recessed center groove. Hand-brushed satin face with mirror-polished interior edges for effortless everyday comfort.",
      category: "Bespoke Rings",
      metalOptions: [
        { name: "Platinum 950", code: "PT950", hex: "#E5E4E2", priceDelta: 0 },
        { name: "18K Yellow Gold", code: "18K-YG", hex: "#D4AF37", priceDelta: -150 },
        { name: "18K Rose Gold", code: "18K-RG", hex: "#B76E79", priceDelta: -150 }
      ],
      details: {
        width: "5.5mm",
        fit: "Comfort Fit Ergonomic",
        origin: "Handcrafted in Atelier",
        certification: "Hallmarked & Certified"
      },
      tag: "Signature Piece",
      rating: 4.9,
      reviewCount: 38
    },
    {
      id: "prod-02",
      name: "The Dune Solitaire Ring",
      subtitle: "Six-Prong Round Brilliant Diamond",
      collection: "diamond-solitaires",
      priceUSD: 6400,
      featured: true,
      image: "assets/product-solitaire.jpg",
      hoverImage: "assets/product-emerald-ring.jpg",
      description: "A breathtaking 2.05-carat round brilliant certified diamond set in a sculptural six-prong tapered platinum cradle. Designed to float effortlessly above warm golden tones.",
      category: "Solitaire Diamonds",
      metalOptions: [
        { name: "Platinum 950", code: "PT950", hex: "#E5E4E2", priceDelta: 0 },
        { name: "18K Yellow Gold", code: "18K-YG", hex: "#D4AF37", priceDelta: -250 },
        { name: "18K White Gold", code: "18K-WG", hex: "#F0EFEF", priceDelta: -200 }
      ],
      details: {
        carat: "2.05 ct",
        clarity: "VVS1 • Color E",
        cut: "Excellent Ideal Cut",
        certification: "GIA Certified Laser Inscribed"
      },
      tag: "Best Seller",
      rating: 5.0,
      reviewCount: 64
    },
    {
      id: "prod-03",
      name: "The Sahara Emerald Cut Ring",
      subtitle: "18K Yellow Gold Architectural Setting",
      collection: "haute-joaillerie",
      priceUSD: 8900,
      featured: true,
      image: "assets/product-emerald-ring.jpg",
      hoverImage: "assets/product-duo-band.jpg",
      description: "An exceptional 3.10-carat step-cut emerald diamond held in double talon claws forged from solid 18K royal yellow gold. Hallmarked with clean modern symmetry.",
      category: "Haute Joaillerie",
      metalOptions: [
        { name: "18K Yellow Gold", code: "18K-YG", hex: "#D4AF37", priceDelta: 0 },
        { name: "Platinum 950", code: "PT950", hex: "#E5E4E2", priceDelta: 300 },
        { name: "18K Rose Gold", code: "18K-RG", hex: "#B76E79", priceDelta: 0 }
      ],
      details: {
        carat: "3.10 ct",
        clarity: "VVS2 • Color D (Colorless)",
        cut: "Emerald Step Cut",
        certification: "IGI & GIA Verified"
      },
      tag: "Haute Joaillerie",
      rating: 4.95,
      reviewCount: 42
    },
    {
      id: "prod-04",
      name: "The Lumina Bezel Pendant",
      subtitle: "18K Gold Solitaire Medallion",
      collection: "gold-essentials",
      priceUSD: 2450,
      featured: true,
      image: "assets/product-pendant.jpg",
      hoverImage: "assets/product-solitaire.jpg",
      description: "A flush-set round brilliant diamond framed within an ultra-sleek bevelled gold coin halo on an adjustable 18-inch delicate wheat chain.",
      category: "Gold Essentials",
      metalOptions: [
        { name: "18K Yellow Gold", code: "18K-YG", hex: "#D4AF37", priceDelta: 0 },
        { name: "18K White Gold", code: "18K-WG", hex: "#F0EFEF", priceDelta: 0 },
        { name: "18K Rose Gold", code: "18K-RG", hex: "#B76E79", priceDelta: 0 }
      ],
      details: {
        carat: "0.85 ct Diamond",
        chain: "18K Solid Gold Adjustable 16-18\"",
        clasp: "Secure Lobster Clasp with Crest Tag",
        finish: "High-Polish Mirror"
      },
      tag: "Timeless Icon",
      rating: 4.88,
      reviewCount: 29
    },
    {
      id: "prod-05",
      name: "The Celestial Oval Halo",
      subtitle: "Micro-Pavé Hidden Bridge Setting",
      collection: "bridal-suites",
      priceUSD: 5200,
      featured: false,
      image: "assets/product-solitaire.jpg",
      hoverImage: "assets/product-emerald-ring.jpg",
      description: "An elongated oval diamond suspended above a whisper-thin micro-pavé band with a hidden diamond collar visible only from the profile view.",
      category: "Bridal Suites",
      metalOptions: [
        { name: "Platinum 950", code: "PT950", hex: "#E5E4E2", priceDelta: 0 },
        { name: "18K Yellow Gold", code: "18K-YG", hex: "#D4AF37", priceDelta: -200 }
      ],
      details: {
        carat: "1.75 ct Center + 0.35 ct Pavé",
        clarity: "VS1 • Color F",
        bandWidth: "1.6mm Delicate Pavé",
        certification: "GIA Certified"
      },
      tag: "Bridal Heirloom",
      rating: 4.92,
      reviewCount: 51
    },
    {
      id: "prod-06",
      name: "The Mirage Tennis Bracelet",
      subtitle: "Four-Prong Articulated Line Bracelet",
      collection: "haute-joaillerie",
      priceUSD: 9800,
      featured: false,
      image: "assets/product-pendant.jpg",
      hoverImage: "assets/product-duo-band.jpg",
      description: "A continuous ribbon of 55 brilliant-cut lab-certified diamonds set in flexible low-profile four-prong links with double safety closure.",
      category: "Haute Joaillerie",
      metalOptions: [
        { name: "18K White Gold", code: "18K-WG", hex: "#F0EFEF", priceDelta: 0 },
        { name: "18K Yellow Gold", code: "18K-YG", hex: "#D4AF37", priceDelta: 0 },
        { name: "Platinum 950", code: "PT950", hex: "#E5E4E2", priceDelta: 450 }
      ],
      details: {
        carat: "5.50 ctw Total Diamonds",
        length: "7.0 inches (Custom sizing available)",
        closure: "Hidden Box Clasp with Dual Safety Catches"
      },
      tag: "High Jewelry",
      rating: 5.0,
      reviewCount: 33
    },
    {
      id: "prod-07",
      name: "The Sculptural Signet",
      subtitle: "Brushed 18K Heavy Gold Band",
      collection: "gold-essentials",
      priceUSD: 2150,
      featured: false,
      image: "assets/product-duo-band.jpg",
      hoverImage: "assets/product-solitaire.jpg",
      description: "Substantial solid gold signet ring balancing bold masculine proportions with smooth rounded bevels and bespoke monogram engraving options.",
      category: "Gold Essentials",
      metalOptions: [
        { name: "18K Yellow Gold", code: "18K-YG", hex: "#D4AF37", priceDelta: 0 },
        { name: "18K Rose Gold", code: "18K-RG", hex: "#B76E79", priceDelta: 0 },
        { name: "Platinum 950", code: "PT950", hex: "#E5E4E2", priceDelta: 250 }
      ],
      details: {
        weight: "14.2 grams Solid Gold",
        engraving: "Complimentary Roman/Calligraphy Monogram",
        hallmark: "Laser-inscribed Atelier Stamp"
      },
      tag: "Modern Heirloom",
      rating: 4.86,
      reviewCount: 22
    },
    {
      id: "prod-08",
      name: "The Radiance Bridal Band Suite",
      subtitle: "Interlocking Curved Diamond Jacket",
      collection: "bridal-suites",
      priceUSD: 3600,
      featured: false,
      image: "assets/product-emerald-ring.jpg",
      hoverImage: "assets/product-pendant.jpg",
      description: "A pair of hand-matched nesting chevron bands with marquise and round diamonds designed to frame any solitaire ring with crown-like glory.",
      category: "Bridal Suites",
      metalOptions: [
        { name: "18K Yellow Gold", code: "18K-YG", hex: "#D4AF37", priceDelta: 0 },
        { name: "Platinum 950", code: "PT950", hex: "#E5E4E2", priceDelta: 200 }
      ],
      details: {
        carat: "1.10 ctw Marquise & Round Diamonds",
        fit: "Custom Flush Fit to any Engagement Ring",
        certification: "Certified Conflict-Free"
      },
      tag: "Bridal Suite",
      rating: 4.94,
      reviewCount: 47
    }
  ],

  // Bespoke Atelier Configurator Options
  atelierConfig: {
    settings: [
      { id: "solitaire", name: "Classic Solitaire", baseMultiplier: 1.0, desc: "Pure focus on the central stone with elegant minimal prongs." },
      { id: "duo-contour", name: "Duo Contour Groove", baseMultiplier: 1.15, desc: "Architectural satin finish with polished recessed channel." },
      { id: "halo-pavé", name: "Hidden Halo Pavé", baseMultiplier: 1.25, desc: "Under-gallery pavé diamonds illuminating the stone from below." },
      { id: "three-stone", name: "Trilogy Three-Stone", baseMultiplier: 1.4, desc: "Past, present, and future flanked by tapered baguette diamonds." }
    ],
    metals: [
      { id: "platinum", name: "Platinum 950", hex: "#E5E4E2", purity: "95% Pure", priceBase: 1200 },
      { id: "yellow-gold", name: "18K Yellow Gold", hex: "#D4AF37", purity: "750 Solid Gold", priceBase: 950 },
      { id: "rose-gold", name: "18K Rose Gold", hex: "#B76E79", purity: "Warm Copper Alloy", priceBase: 950 },
      { id: "white-gold", name: "18K White Gold", hex: "#F0EFEF", purity: "Rhodium Finished", priceBase: 1000 }
    ],
    diamonds: [
      { id: "round", name: "Round Brilliant", multiplier: 1.0, icon: "◆" },
      { id: "oval", name: "Elongated Oval", multiplier: 1.08, icon: "⬭" },
      { id: "emerald", name: "Emerald Step Cut", multiplier: 1.12, icon: "▭" },
      { id: "cushion", name: "Cushion Brilliant", multiplier: 1.05, icon: "▢" },
      { id: "radiant", name: "Radiant Cut", multiplier: 1.1, icon: "⬡" }
    ],
    carats: [
      { value: "1.00", label: "1.00 ct", price: 2800 },
      { value: "1.50", label: "1.50 ct", price: 4600 },
      { value: "2.00", label: "2.00 ct", price: 7200 },
      { value: "2.50", label: "2.50 ct", price: 10500 },
      { value: "3.00", label: "3.00 ct", price: 14800 }
    ]
  },

  heritage: {
    pillars: [
      {
        number: "01",
        title: "Master Goldsmithing",
        description: "Four decades of uncompromising hand-forging in our private atelier. Every bezel, prong, and inner curvature is finished by master craftsmen."
      },
      {
        number: "02",
        title: "Ethically Sourced Diamonds",
        description: "100% Kimberly Process compliant and conflict-free natural and certified diamonds with GIA and IGI individual laser inscriptions."
      },
      {
        number: "03",
        title: "No Templates. Pure Vision.",
        description: "We refuse mass-produced castings. Each commission begins with 3D CAD sculpting, wax carving, and custom metal alloy mixing."
      },
      {
        number: "04",
        title: "Lifetime Guarantee & Care",
        description: "Complimentary biannual prong inspection, ultrasonic cleansing, rhodium refinishing, and worldwide insured secure courier shipping."
      }
    ]
  }
};
