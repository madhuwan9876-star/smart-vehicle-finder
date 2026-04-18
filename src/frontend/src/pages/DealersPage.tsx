import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bike,
  Building2,
  Car,
  ExternalLink,
  MapPin,
  Phone,
  Search,
  Star,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useMemo, useState } from "react";
import { dealers } from "../dealers";

type DealerTypeFilter = "all" | "car" | "bike" | "truck";

const TYPE_TABS: {
  value: DealerTypeFilter;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all", label: "All", icon: <Building2 className="w-3.5 h-3.5" /> },
  { value: "car", label: "Cars", icon: <Car className="w-3.5 h-3.5" /> },
  { value: "bike", label: "Bikes", icon: <Bike className="w-3.5 h-3.5" /> },
  { value: "truck", label: "Trucks", icon: <Truck className="w-3.5 h-3.5" /> },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const full = star <= Math.floor(rating);
        const half = !full && star === Math.ceil(rating) && rating % 1 >= 0.3;
        return (
          <Star
            key={star}
            className={`w-3.5 h-3.5 transition-colors ${
              full
                ? "fill-amber-400 text-amber-400"
                : half
                  ? "fill-amber-400/50 text-amber-400"
                  : "text-muted-foreground/40"
            }`}
          />
        );
      })}
    </div>
  );
}

export default function DealersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DealerTypeFilter>("all");
  const [stateFilter, setStateFilter] = useState("all");

  const states = useMemo(
    () => Array.from(new Set(dealers.map((d) => d.state))).sort(),
    [],
  );

  const filtered = useMemo(
    () =>
      dealers.filter((d) => {
        if (
          typeFilter !== "all" &&
          !d.vehicleTypes.includes(typeFilter as "car" | "bike" | "truck")
        )
          return false;
        if (stateFilter !== "all" && d.state !== stateFilter) return false;
        if (
          search &&
          !d.name.toLowerCase().includes(search.toLowerCase()) &&
          !d.brand.toLowerCase().includes(search.toLowerCase()) &&
          !d.city.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [search, typeFilter, stateFilter],
  );

  const handleClearSearch = () => setSearch("");

  return (
    <div className="min-h-screen pt-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card/40 border-b border-border/50">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 70% 50%, oklch(0.63 0.24 50 / 0.3) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 px-3 py-1 text-xs font-semibold tracking-widest uppercase">
                  <MapPin className="w-3 h-3 mr-1.5" />
                  Across India
                </Badge>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Authorized <span className="text-primary">Dealers</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                  Connect with certified dealerships for the best purchase
                  experience — test drives, financing, and after-sales support.
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 shrink-0">
                <div className="glass-card rounded-2xl px-5 py-4 text-center min-w-[90px]">
                  <p className="text-3xl font-extrabold text-primary leading-none">
                    {dealers.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    Dealers
                  </p>
                </div>
                <div className="glass-card rounded-2xl px-5 py-4 text-center min-w-[90px]">
                  <p className="text-3xl font-extrabold text-primary leading-none">
                    {states.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    States
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="dealers.search_input"
                placeholder="Search by dealer, brand, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type Tabs */}
            <div className="flex gap-2 flex-wrap" data-ocid="dealers.type.tab">
              {TYPE_TABS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTypeFilter(value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
                    typeFilter === value
                      ? "bg-primary text-primary-foreground border-primary shadow-glow"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {/* State Filter */}
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger
                data-ocid="dealers.state_select"
                className="w-full sm:w-44"
              >
                <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Count line */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-foreground font-semibold">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-semibold">
              {dealers.length}
            </span>{" "}
            dealers
          </p>
          {(search || typeFilter !== "all" || stateFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setStateFilter("all");
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              data-ocid="dealers.empty_state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-28"
            >
              <div className="w-20 h-20 rounded-3xl bg-muted/40 border border-border mx-auto flex items-center justify-center mb-6">
                <MapPin className="w-9 h-9 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                No dealers found
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Try adjusting your search or filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setStateFilter("all");
                }}
                className="gap-2"
              >
                <X className="w-4 h-4" /> Reset Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {filtered.map((dealer, i) => (
                  <motion.div
                    key={dealer.id}
                    data-ocid={`dealer.item.${i + 1}`}
                    className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(i * 0.05, 0.4),
                    }}
                    whileHover={{ y: -4 }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={dealer.imageUrl}
                        alt={dealer.name}
                        className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Vehicle type badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {dealer.vehicleTypes.map((t) => (
                          <Badge
                            key={t}
                            className="bg-background/80 text-foreground text-xs backdrop-blur border-border/50 shadow-sm"
                          >
                            {t === "car" ? (
                              <Car className="w-3 h-3 mr-1" />
                            ) : t === "truck" ? (
                              <Truck className="w-3 h-3 mr-1" />
                            ) : (
                              <Bike className="w-3 h-3 mr-1" />
                            )}
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </Badge>
                        ))}
                      </div>
                      {/* Rating badge */}
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 bg-amber-500/90 backdrop-blur rounded-lg px-2 py-1 shadow-md">
                          <Star className="w-3 h-3 fill-white text-white" />
                          <span className="text-white text-xs font-bold">
                            {dealer.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Name & Brand */}
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
                          {dealer.brand}
                        </p>
                        <h3 className="text-lg font-bold text-foreground mt-0.5 leading-tight">
                          {dealer.name}
                        </h3>

                        {/* Star row + review count */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <StarRating rating={dealer.rating} />
                          <span className="text-xs text-muted-foreground">
                            ({dealer.reviewCount.toLocaleString()} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground leading-snug">
                          {dealer.address}
                        </p>
                      </div>

                      {/* Speciality */}
                      <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-2 mb-3">
                        <p className="text-xs text-primary font-medium uppercase tracking-wider mb-0.5">
                          Speciality
                        </p>
                        <p className="text-sm text-foreground font-medium leading-snug">
                          {dealer.speciality}
                        </p>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-muted/40 rounded-lg px-3 py-2">
                          <p className="text-xs text-muted-foreground">Est.</p>
                          <p className="text-sm font-bold text-foreground">
                            {dealer.established}
                          </p>
                        </div>
                        <div className="bg-muted/40 rounded-lg px-3 py-2">
                          <p className="text-xs text-muted-foreground">City</p>
                          <p className="text-sm font-bold text-foreground truncate">
                            {dealer.city}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-auto flex gap-2">
                        <a
                          href={`tel:${dealer.phone}`}
                          data-ocid={`dealer.call_button.${i + 1}`}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm font-semibold shadow-glow hover:shadow-glow-hover"
                        >
                          <Phone className="w-4 h-4 shrink-0" />
                          <span className="truncate">{dealer.phone}</span>
                        </a>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(dealer.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid={`dealer.location_button.${i + 1}`}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all text-sm font-semibold shrink-0"
                          aria-label={`View ${dealer.name} on map`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="hidden sm:inline text-xs">Map</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
