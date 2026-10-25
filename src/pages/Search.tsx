import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Search as SearchIcon, MapPin, Star, Filter, ArrowRight, Sparkles } from "lucide-react";
import { searchArtisans } from "@/services/artisanStore";
import { triggerHaptic } from "@/services/haptics";

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [service, setService] = useState(searchParams.get("service") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [priceRange, setPriceRange] = useState(searchParams.get("priceRange") || "");

  const filteredArtisans = useMemo(() => {
    return searchArtisans({
      service,
      location,
      category,
      minRating,
      priceRange,
    });
  }, [service, location, category, minRating, priceRange]);

  const categories = [
    { id: "", label: "All Disciplines" },
    { id: "makeup", label: "Makeup" },
    { id: "hair-styling", label: "Hair Styling" },
    { id: "nails", label: "Nails & Lashes" },
    { id: "braids", label: "Braids & Locs" },
    { id: "barbering", label: "Barbering" },
    { id: "skincare", label: "Aesthetics" },
  ];

  const handleFilterChange = (key: string, value: string) => {
    triggerHaptic(8);
    const updatedParams = new URLSearchParams(searchParams);
    if (value) {
      updatedParams.set(key, value);
    } else {
      updatedParams.delete(key);
    }
    setSearchParams(updatedParams);
  };

  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white transition-colors duration-300">
      <Header />

      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 border-b border-[#EFBDEB] dark:border-[#3B3237]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] uppercase">
                Curated Directory
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#501854] dark:text-[#D4C7E1] tracking-tight">
              Discover Master <span className="italic font-normal text-[#DB2777]">Artisans</span>
            </h1>
            <p className="text-sm text-[#7E4882] dark:text-[#A695B8] font-light mt-3 max-w-lg mx-auto">
              Find and reserve verified beauty artists across South Africa for private salon visits or home appointments.
            </p>
          </div>

          {/* Search Bar with iOS Liquid Glass Pill */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="glass-search-pill flex flex-col md:flex-row items-center p-2 shadow-[0_12px_36px_-6px_rgba(80,24,84,0.08)] border border-[#EFBDEB] dark:border-[#3B3237]">
              <div className="flex-grow w-full flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-[#EFBDEB]/60 dark:border-[#3B3237]">
                <SearchIcon size={18} className="text-[#8C3B8A] dark:text-[#A695B8] mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Service, stylist or salon..."
                  className="w-full bg-transparent text-sm text-[#501854] dark:text-[#D4C7E1] focus:outline-none placeholder:text-[#8C3B8A]/60 dark:placeholder:text-[#A695B8]/60 border-none p-0 !border-0 !bg-transparent"
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    handleFilterChange("service", e.target.value);
                  }}
                />
              </div>
              <div className="w-full md:w-64 flex items-center px-4 py-2">
                <MapPin size={18} className="text-[#8C3B8A] dark:text-[#A695B8] mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="City / Suburb (e.g. Sandton)"
                  className="w-full bg-transparent text-sm text-[#501854] dark:text-[#D4C7E1] focus:outline-none placeholder:text-[#8C3B8A]/60 dark:placeholder:text-[#A695B8]/60 border-none p-0 !border-0 !bg-transparent"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    handleFilterChange("location", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  handleFilterChange("category", cat.id);
                }}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all ${
                  category === cat.id
                    ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-xs"
                    : "bg-[#FAF2FA] dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filters Bar with Rating & Price */}
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#EFBDEB] dark:border-[#3B3237]">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center text-xs uppercase tracking-widest text-[#7E4882] dark:text-[#A695B8] font-medium mr-1">
                <Filter size={14} className="mr-1.5 text-[#DB2777]" /> Filters:
              </div>
              <select
                className="px-3 py-1.5 rounded-full border border-[#E7C1DC] dark:border-[#3B3237] bg-white dark:bg-[#3E343C] text-xs text-[#501854] dark:text-[#D4C7E1] focus:outline-none shadow-xs"
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  handleFilterChange("minRating", e.target.value);
                }}
              >
                <option value="">All Ratings</option>
                <option value="4.9">4.9+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>

              <select
                className="px-3 py-1.5 rounded-full border border-[#E7C1DC] dark:border-[#3B3237] bg-white dark:bg-[#3E343C] text-xs text-[#501854] dark:text-[#D4C7E1] focus:outline-none shadow-xs"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(e.target.value);
                  handleFilterChange("priceRange", e.target.value);
                }}
              >
                <option value="">Any Rate</option>
                <option value="under-500">&lt; R500</option>
                <option value="500-1000">R500 - R1,000</option>
                <option value="1000-plus">R1,000+</option>
              </select>
            </div>

            <div className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light">
              Showing <span className="font-semibold text-[#501854] dark:text-[#D4C7E1]">{filteredArtisans.length}</span> verified master artisans
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        {filteredArtisans.length === 0 ? (
          <div className="text-center py-20 glass-panel max-w-md mx-auto p-8 rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237]">
            <p className="font-serif text-xl text-[#501854] dark:text-[#D4C7E1] mb-2">No artisans match your criteria</p>
            <p className="text-xs text-[#7E4882] dark:text-[#A695B8] mb-6 font-light">
              Try adjusting your search terms, changing the location, or clearing rating filters.
            </p>
            <button
              onClick={() => {
                setService("");
                setLocation("");
                setCategory("");
                setMinRating("");
                setPriceRange("");
                setSearchParams({});
              }}
              className="bg-[#501854] dark:bg-[#DB2777] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtisans.map((artisan) => (
              <div
                key={artisan.id}
                onClick={() => {
                  triggerHaptic(10);
                  navigate(`/profile/${artisan.id}`);
                }}
                className="artist-card cursor-pointer group bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden bg-[#FAF2FA] dark:bg-[#372E3E]">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#241C2B]/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs">
                    {artisan.tag}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#501854]/90 dark:bg-[#17111D]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium flex items-center gap-1">
                    <Star size={12} className="text-[#DB2777] fill-[#DB2777]" />
                    <span>{artisan.rating}</span>
                    <span className="text-pink-200 text-[10px]">({artisan.reviewsCount})</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-serif text-[#501854] dark:text-[#D4C7E1] mb-1 group-hover:text-[#DB2777] transition-colors">
                    {artisan.name}
                  </h3>
                  <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light mb-3">
                    {artisan.specialty}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-[#7E4882] dark:text-[#A695B8] mb-5">
                    <MapPin size={13} className="text-[#DB2777]" />
                    <span>{artisan.location}</span>
                  </div>

                  <div className="pt-4 border-t border-[#EFBDEB] dark:border-[#3B3237] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8C3B8A] dark:text-[#A695B8] block font-medium">Bespoke Rates</span>
                      <span className="text-sm font-semibold text-[#501854] dark:text-[#D4C7E1]">{artisan.priceRange}</span>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] group-hover:bg-[#501854] dark:group-hover:bg-[#DB2777] group-hover:text-white transition-all duration-300 flex items-center justify-center text-[#501854] dark:text-[#D4C7E1]">
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Search;
