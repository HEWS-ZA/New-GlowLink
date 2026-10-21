export interface ArtisanServiceItem {
  id: number;
  name: string;
  price: string;
  duration: string;
  desc: string;
}

export interface ClientReviewItem {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Artisan {
  id: string;
  name: string;
  specialty: string;
  category: "makeup" | "hair-styling" | "nails" | "braids" | "barbering" | "skincare";
  location: string;
  city: string;
  rating: number;
  reviewsCount: number;
  tag: string;
  priceRange: string;
  minPrice: number;
  image: string;
  bio: string;
  experience: string;
  services: ArtisanServiceItem[];
  reviews: ClientReviewItem[];
  portfolio: string[];
  socials: { instagram?: string; facebook?: string; twitter?: string };
}

const DEFAULT_ARTISANS: Artisan[] = [
  {
    id: "1",
    name: "Thandi Mthembu",
    specialty: "Bridal & Editorial Makeup",
    category: "makeup",
    location: "Sandton, Johannesburg",
    city: "Johannesburg",
    rating: 4.9,
    reviewsCount: 124,
    tag: "Master Artisan",
    priceRange: "R500 - R2,000",
    minPrice: 500,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
    bio: "Certified master makeup artist specializing in bridal couture, fashion editorial commissions, and red-carpet appearances across Gauteng. Dedicated to elevating natural beauty through bespoke skincare preparation.",
    experience: "8+ Years Experience",
    services: [
      { id: 1, name: "Haute Bridal Atelier", price: "R2,000", duration: "2 hours", desc: "Full trial consultation, luxury skin preparation, and master bridal styling." },
      { id: 2, name: "Editorial Glam Session", price: "R850", duration: "1 hour", desc: "High-definition camera-ready makeup with lash customization." },
      { id: 3, name: "Minimalist Signature Glow", price: "R550", duration: "45 mins", desc: "Radiant, skin-first aesthetic enhancing natural facial features." },
      { id: 4, name: "Gala & Special Occasion", price: "R1,200", duration: "1.5 hours", desc: "Long-wear red-carpet styling with contour sculpting." },
    ],
    reviews: [
      {
        id: "r1",
        name: "Sarah M.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolutely extraordinary! Thandi handled my wedding look with unmatched poise and precision. I felt timeless.",
      },
      {
        id: "r2",
        name: "Jessica K.",
        rating: 5,
        date: "1 month ago",
        comment: "Professional, punctual, and deeply talented. The application lasted throughout the entire evening seamlessly.",
      },
      {
        id: "r3",
        name: "Linda T.",
        rating: 5,
        date: "2 months ago",
        comment: "A true master of the craft. Listened attentively to my aesthetic preferences and exceeded expectations.",
      },
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595475038607-33cf50fa5c8c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560869713-571ebd71be4e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop",
    ],
    socials: { instagram: "@thandi_atelier", facebook: "ThandiMthembuMakeup", twitter: "@thandim_art" },
  },
  {
    id: "2",
    name: "Lerato Ndlovu",
    specialty: "Couture Hair Stylist",
    category: "hair-styling",
    location: "Camps Bay, Cape Town",
    city: "Cape Town",
    rating: 5.0,
    reviewsCount: 89,
    tag: "Celebrity Stylist",
    priceRange: "R400 - R1,800",
    minPrice: 400,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    bio: "Haute coiffure specialist trained in Paris and Cape Town. Expert in textured volume, bespoke coloring, and architectural event updos.",
    experience: "10+ Years Experience",
    services: [
      { id: 1, name: "Bespoke Balayage & Glaze", price: "R1,800", duration: "3 hours", desc: "Hand-painted multi-dimensional color with bonding treatment." },
      { id: 2, name: "Signature Blowout & Sculpt", price: "R650", duration: "1 hour", desc: "Long-lasting weightless volume with organic serum infusion." },
      { id: 3, name: "Red Carpet Updo", price: "R1,200", duration: "1.5 hours", desc: "Architectural bridal or gala hair styling with pinning." },
    ],
    reviews: [
      { id: "r4", name: "Zoe B.", rating: 5, date: "3 weeks ago", comment: "The best hair artist in Cape Town without question. My hair felt so healthy." },
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1560869713-571ebd71be4e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=600&fit=crop",
    ],
    socials: { instagram: "@leratohair", facebook: "LeratoNdlovuHair" },
  },
  {
    id: "3",
    name: "Sipho Khumalo",
    specialty: "Master Barber",
    category: "barbering",
    location: "Umhlanga, Durban",
    city: "Durban",
    rating: 4.8,
    reviewsCount: 156,
    tag: "Precision Grooming",
    priceRange: "R250 - R900",
    minPrice: 250,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    bio: "Artisan barber specializing in high-precision fades, hot-towel straight-razor treatments, and beard architecture.",
    experience: "7+ Years Experience",
    services: [
      { id: 1, name: "Master Cut & Hot Towel Shave", price: "R450", duration: "45 mins", desc: "Precision scissor and clipper blend with aromatic botanical shave." },
      { id: 2, name: "Beard Sculpt & Treatment", price: "R300", duration: "30 mins", desc: "Edge defining, hot oil massage, and conditioning." },
    ],
    reviews: [
      { id: "r5", name: "David M.", rating: 5, date: "1 week ago", comment: "Unmatched attention to detail. Always on time, spotless atelier." },
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop",
    ],
    socials: { instagram: "@sipho_barber" },
  },
  {
    id: "4",
    name: "Nomsa Dlamini",
    specialty: "Nail Aesthetician",
    category: "nails",
    location: "Pretoria East",
    city: "Pretoria",
    rating: 4.9,
    reviewsCount: 98,
    tag: "Haute Nails",
    priceRange: "R300 - R1,200",
    minPrice: 300,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    bio: "Luxury hand & foot aesthetician specializing in Russian manicure technique, gel-x extensions, and minimalist fine-line art.",
    experience: "6+ Years Experience",
    services: [
      { id: 1, name: "Bespoke Haute Gel-X Set", price: "R850", duration: "1.5 hours", desc: "Custom shape, cuticle rejuvenation, and minimalist nail art." },
      { id: 2, name: "Signature Russian Manicure", price: "R650", duration: "1 hour", desc: "Dry mechanical cuticle care and flawless high-gloss gel finish." },
    ],
    reviews: [
      { id: "r6", name: "Kgomotso P.", rating: 5, date: "4 days ago", comment: "My nails lasted 5 weeks without a chip! Nomsa is an artisan." },
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop",
    ],
    socials: { instagram: "@nomsanails" },
  },
  {
    id: "5",
    name: "Zanele Sithole",
    specialty: "Artisan Braids & Natural Hair",
    category: "braids",
    location: "Rosebank, Johannesburg",
    city: "Johannesburg",
    rating: 4.95,
    reviewsCount: 142,
    tag: "Texture Specialist",
    priceRange: "R600 - R2,500",
    minPrice: 600,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    bio: "Natural haircare authority dedicated to protective plaits, knotless braids, bohemian goddess styles, and loc maintenance with zero scalp tension.",
    experience: "9+ Years Experience",
    services: [
      { id: 1, name: "Bespoke Bohemian Knotless Braids", price: "R1,800", duration: "4 hours", desc: "Tension-free parting with premium human hair curls woven throughout." },
      { id: 2, name: "Loc Detox & Retwist", price: "R750", duration: "2 hours", desc: "Apple cider vinegar wash, herbal steam, and palm-roll retwist." },
    ],
    reviews: [
      { id: "r7", name: "Busi N.", rating: 5, date: "1 week ago", comment: "No headaches at all, neatest parts I have ever had. Truly exceptional." },
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=600&fit=crop",
    ],
    socials: { instagram: "@zan_braids" },
  },
  {
    id: "6",
    name: "Chloe Van Der Merwe",
    specialty: "Dermal Aesthetics & Glow Facial",
    category: "skincare",
    location: "Constantia, Cape Town",
    city: "Cape Town",
    rating: 5.0,
    reviewsCount: 76,
    tag: "Clinical Aesthetics",
    priceRange: "R800 - R3,200",
    minPrice: 800,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    bio: "Medical aesthetician specializing in clinical skin health, gentle chemical peel resurfacing, microcurrent toning, and holistic dermal oxygenation.",
    experience: "11+ Years Experience",
    services: [
      { id: 1, name: "GlowLink Signature Cellular Facial", price: "R1,400", duration: "1.5 hours", desc: "Deep ultrasonic cleanse, peptide infusion, LED therapy, and collagen mask." },
      { id: 2, name: "Bio-Active Dermal Peel", price: "R950", duration: "45 mins", desc: "Targeted lactic & mandelic acid brightening with zero downtime." },
    ],
    reviews: [
      { id: "r8", name: "Anika V.", rating: 5, date: "2 weeks ago", comment: "My skin is glowing days later. Chloe is vastly knowledgeable." },
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1512290900672-1f02a7b8e5c8?w=600&h=600&fit=crop",
    ],
    socials: { instagram: "@chloe_dermal" },
  },
];

const STORAGE_KEY = "glowlink_artisans";

export function getStoredArtisans(): Artisan[] {
  if (typeof window === "undefined") return DEFAULT_ARTISANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTISANS));
      return DEFAULT_ARTISANS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ARTISANS;
  }
}

export function saveArtisans(artisans: Artisan[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(artisans));
  }
}

export function getArtisanById(id: string): Artisan | undefined {
  const artisans = getStoredArtisans();
  return artisans.find((a) => a.id === id) || artisans[0];
}

export function searchArtisans(params: {
  service?: string;
  location?: string;
  category?: string;
  minRating?: string;
  priceRange?: string;
}): Artisan[] {
  const artisans = getStoredArtisans();
  return artisans.filter((artisan) => {
    if (params.service) {
      const q = params.service.toLowerCase();
      const matchName = artisan.name.toLowerCase().includes(q);
      const matchSpecialty = artisan.specialty.toLowerCase().includes(q);
      const matchServices = artisan.services.some(
        (s) => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
      );
      if (!matchName && !matchSpecialty && !matchServices) return false;
    }

    if (params.location) {
      const locQ = params.location.toLowerCase();
      const matchLoc = artisan.location.toLowerCase().includes(locQ);
      const matchCity = artisan.city.toLowerCase().includes(locQ);
      if (!matchLoc && !matchCity) return false;
    }

    if (params.category && params.category !== "all") {
      if (artisan.category !== params.category) return false;
    }

    if (params.minRating) {
      const min = parseFloat(params.minRating);
      if (!isNaN(min) && artisan.rating < min) return false;
    }

    if (params.priceRange) {
      if (params.priceRange === "under-500" && artisan.minPrice > 500) return false;
      if (params.priceRange === "500-1000" && (artisan.minPrice < 500 || artisan.minPrice > 1000)) return false;
      if (params.priceRange === "1000-plus" && artisan.minPrice < 1000) return false;
    }

    return true;
  });
}

export function addArtisanReview(artisanId: string, review: { name: string; rating: number; comment: string }) {
  const artisans = getStoredArtisans();
  const index = artisans.findIndex((a) => a.id === artisanId);
  if (index === -1) return;

  const artisan = artisans[index];
  const newReview: ClientReviewItem = {
    id: "r_" + Date.now(),
    name: review.name,
    rating: review.rating,
    date: "Just now",
    comment: review.comment,
  };

  const newReviews = [newReview, ...artisan.reviews];
  const totalScore = newReviews.reduce((acc, r) => acc + r.rating, 0);
  const updatedRating = parseFloat((totalScore / newReviews.length).toFixed(1));

  artisans[index] = {
    ...artisan,
    reviews: newReviews,
    reviewsCount: artisan.reviewsCount + 1,
    rating: updatedRating,
  };

  saveArtisans(artisans);
}

export function registerNewArtisan(data: Partial<Artisan>): Artisan {
  const artisans = getStoredArtisans();
  const newArtisan: Artisan = {
    id: String(Date.now()),
    name: data.name || "Artisan",
    specialty: data.specialty || "Beauty Stylist",
    category: (data.category as Artisan["category"]) || "makeup",
    location: data.location || "Sandton, Johannesburg",
    city: data.city || "Johannesburg",
    rating: 5.0,
    reviewsCount: 1,
    tag: "New Atelier Artisan",
    priceRange: "From R 650",
    minPrice: 650,
    image: data.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    bio: data.bio || "Dedicated beauty artisan offering private studio appointments and bespoke styling.",
    experience: data.experience || "1+ Year",
    services: [
      { id: 1, name: "Signature Atelier Consultation", price: "R650", duration: "1 hour", desc: "Personal consultation and tailored beauty application." },
    ],
    reviews: [
      { id: "r_init", name: "GlowLink Verified", rating: 5, date: "Recent", comment: "Verified portfolio and certified hygiene protocol." },
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=600&fit=crop",
    ],
    socials: { instagram: data.socials?.instagram || "@glowlink_artisan" },
  };

  const updated = [newArtisan, ...artisans];
  saveArtisans(updated);
  return newArtisan;
}
