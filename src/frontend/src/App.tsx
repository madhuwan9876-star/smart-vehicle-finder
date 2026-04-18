import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  ArrowRight,
  ArrowUpDown,
  BarChart3,
  Bike,
  Building2,
  Car,
  ChevronDown,
  Download,
  Fuel,
  Gauge,
  Heart,
  LayoutGrid,
  MapPin,
  Menu,
  Moon,
  Search,
  Settings2,
  Shuffle,
  SlidersHorizontal,
  Star,
  Sun,
  Trophy,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import DealersPage from "./pages/DealersPage";
import VehiclesPage from "./pages/VehiclesPage";
import {
  type FuelType,
  type MileageCategory,
  type UsageType,
  type Vehicle,
  type VehicleType,
  vehicles,
} from "./vehicles";

type Page = "home" | "vehicles" | "dealers";

const formatPrice = (price: number): string => {
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `\u20b9${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`;
  }
  return `\u20b9${(price / 1000).toFixed(0)}K`;
};

const formatPriceRange = (price: number): string => {
  if (price >= 100000) {
    return `\u20b9${(price / 100000).toFixed(1)} Lakh`;
  }
  return `\u20b9${(price / 1000).toFixed(0)} Thousand`;
};

type SortOption = "price-asc" | "price-desc" | "mileage-desc" | "mileage-asc";

interface Filters {
  budget: number;
  vehicleType: VehicleType | "both";
  fuel: FuelType | "Any";
  transmission: "Manual" | "Automatic" | "Any";
  usage: UsageType[];
  mileage: MileageCategory | "Any";
}

const defaultFilters: Filters = {
  budget: 2000000,
  vehicleType: "both",
  fuel: "Any",
  transmission: "Any",
  usage: [],
  mileage: "Any",
};

// ─── VehicleCard ─────────────────────────────────────────────────────────────
function VehicleCard({
  vehicle,
  index,
  isFavorite,
  onFavoriteToggle,
  compareList,
  onCompareToggle,
  onNavigateToDealers,
}: {
  vehicle: Vehicle;
  index: number;
  isFavorite: boolean;
  onFavoriteToggle: (id: number) => void;
  compareList: number[];
  onCompareToggle: (id: number) => void;
  onNavigateToDealers: () => void;
}) {
  const isInCompare = compareList.includes(vehicle.id);

  const handleDownload = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>${vehicle.brand} ${vehicle.name}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; max-width: 400px; background: #0f0f0f; color: #f5f5f5; }
          img { width: 100%; border-radius: 8px; }
          h2 { margin: 12px 0 4px; }
          .spec { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #333; }
        </style></head>
        <body>
          <img src="${vehicle.imageUrl}" alt="${vehicle.name}" />
          <h2>${vehicle.brand} ${vehicle.name}</h2>
          <div class="spec"><span>Price</span><span>${formatPrice(vehicle.price)}</span></div>
          <div class="spec"><span>Engine</span><span>${vehicle.engine}</span></div>
          <div class="spec"><span>Fuel</span><span>${vehicle.fuel.join(", ")}</span></div>
          <div class="spec"><span>Mileage</span><span>${vehicle.mileage} km/l</span></div>
          ${vehicle.type === "car" ? `<div class="spec"><span>Transmission</span><span>${vehicle.transmission.join(", ")}</span></div>` : ""}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <motion.div
      data-ocid={`vehicle.item.${index}`}
      className="group relative glass-card rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-300 hover:shadow-glow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.6) }}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.brand} ${vehicle.name}`}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge
            className={`text-[10px] font-bold px-2 py-0.5 border-0 ${
              vehicle.type === "car"
                ? "bg-blue-600/80 text-white"
                : vehicle.type === "truck"
                  ? "bg-amber-600/80 text-white"
                  : "bg-purple-600/80 text-white"
            }`}
          >
            {vehicle.type === "car" ? (
              <Car className="w-3 h-3 inline mr-1" />
            ) : vehicle.type === "truck" ? (
              <Truck className="w-3 h-3 inline mr-1" />
            ) : (
              <Bike className="w-3 h-3 inline mr-1" />
            )}
            {vehicle.type === "car"
              ? "Car"
              : vehicle.type === "truck"
                ? "Truck"
                : "Bike"}
          </Badge>
          {vehicle.fuel.includes("Electric") && (
            <Badge className="bg-emerald-600/90 text-white text-[10px] border-0 px-2 py-0.5">
              <Zap className="w-3 h-3 mr-0.5" /> EV
            </Badge>
          )}
        </div>

        {/* Price badge bottom-left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-sm font-extrabold text-white drop-shadow-md">
            {formatPrice(vehicle.price)}
          </span>
        </div>

        {/* Favorite */}
        <button
          type="button"
          data-ocid={`vehicle.favorite_toggle.${index}`}
          onClick={() => onFavoriteToggle(vehicle.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center transition-all hover:bg-black/70 hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-primary text-primary" : "text-white/80"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">
            {vehicle.brand}
          </p>
          <h3 className="text-base font-bold text-foreground leading-tight mt-0.5">
            {vehicle.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {vehicle.description}
          </p>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: "Mileage", value: `${vehicle.mileage} km/l` },
            { label: "Engine", value: vehicle.engine },
            { label: "Fuel", value: vehicle.fuel.join("/") },
            ...(vehicle.type === "car"
              ? [{ label: "Trans.", value: vehicle.transmission.join("/") }]
              : [{ label: "Usage", value: vehicle.usage[0] || "—" }]),
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted/30 rounded-lg px-2.5 py-1.5">
              <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                {label}
              </p>
              <p className="text-xs font-semibold text-foreground truncate">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            type="button"
            data-ocid={`vehicle.compare_button.${index}`}
            onClick={() => {
              if (!isInCompare && compareList.length >= 2) {
                toast.error("You can only compare 2 vehicles at a time");
                return;
              }
              onCompareToggle(vehicle.id);
            }}
            className={`flex-none w-9 h-9 rounded-xl border flex items-center justify-center transition-all text-xs ${
              isInCompare
                ? "bg-primary/20 border-primary text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
            }`}
            aria-label="Compare vehicle"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-ocid={`vehicle.buy_button.${index}`}
            onClick={onNavigateToDealers}
            className="flex-1 text-xs font-bold py-2 px-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
          >
            Buy from Dealer
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            type="button"
            data-ocid={`vehicle.download_button.${index}`}
            onClick={handleDownload}
            className="flex-none w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
            aria-label="Download vehicle card"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CompareModal ─────────────────────────────────────────────────────────────
function CompareModal({
  vehicleIds,
  onClose,
}: {
  vehicleIds: number[];
  onClose: () => void;
}) {
  const v1 = vehicles.find((v) => v.id === vehicleIds[0]);
  const v2 = vehicles.find((v) => v.id === vehicleIds[1]);
  if (!v1 || !v2) return null;

  const specs = [
    {
      label: "Price",
      val1: formatPrice(v1.price),
      val2: formatPrice(v2.price),
      highlight: true,
    },
    { label: "Engine", val1: v1.engine, val2: v2.engine },
    { label: "Fuel", val1: v1.fuel.join(", "), val2: v2.fuel.join(", ") },
    {
      label: "Mileage",
      val1: `${v1.mileage} km/l`,
      val2: `${v2.mileage} km/l`,
      highlight: v1.mileage !== v2.mileage,
    },
    {
      label: "Transmission",
      val1: v1.transmission.join(", "),
      val2: v2.transmission.join(", "),
    },
    { label: "Usage", val1: v1.usage.join(", "), val2: v2.usage.join(", ") },
    { label: "Type", val1: v1.type, val2: v2.type },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        data-ocid="compare.modal"
        className="max-w-2xl glass-card border-border/40"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Vehicle Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div />
          {[v1, v2].map((v) => (
            <div key={v.id} className="text-center">
              <img
                src={v.imageUrl}
                alt={v.name}
                className="w-full h-28 object-cover rounded-xl mb-2 border border-border/20"
              />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {v.brand}
              </p>
              <p className="font-bold text-foreground text-sm">{v.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl overflow-hidden border border-border/20">
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              className={`grid grid-cols-3 gap-4 py-2.5 px-4 text-sm ${
                i % 2 === 0 ? "bg-muted/20" : ""
              }`}
            >
              <span className="text-muted-foreground font-medium text-xs">
                {spec.label}
              </span>
              <span
                className={`text-center font-semibold text-xs ${spec.highlight ? "text-primary" : "text-foreground"}`}
              >
                {spec.val1}
              </span>
              <span
                className={`text-center font-semibold text-xs ${spec.highlight ? "text-primary" : "text-foreground"}`}
              >
                {spec.val2}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            data-ocid="compare.close_button"
            variant="outline"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" /> Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── FavoritesModal ───────────────────────────────────────────────────────────
function FavoritesModal({
  favoriteIds,
  onClose,
  onRemove,
}: {
  favoriteIds: number[];
  onClose: () => void;
  onRemove: (id: number) => void;
}) {
  const favVehicles = vehicles.filter((v) => favoriteIds.includes(v.id));
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        data-ocid="favorites.modal"
        className="max-w-lg glass-card border-border/40"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            Saved Vehicles
            <Badge className="bg-primary/15 text-primary border-primary/30 ml-1">
              {favVehicles.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        {favVehicles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border/20 mx-auto flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-semibold mb-1">No favorites yet</p>
            <p className="text-muted-foreground text-sm">
              Tap the heart icon on any vehicle to save it here.
            </p>
          </div>
        ) : (
          <div className="space-y-2 mt-2 max-h-96 overflow-y-auto pr-1">
            {favVehicles.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 bg-muted/20 hover:bg-muted/30 rounded-xl p-3 transition-colors"
              >
                <img
                  src={v.imageUrl}
                  alt={v.name}
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0 border border-border/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {v.brand}
                  </p>
                  <p className="font-semibold text-foreground truncate text-sm">
                    {v.name}
                  </p>
                  <p className="text-xs text-primary font-bold">
                    {formatPrice(v.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(v.id)}
                  className="w-8 h-8 rounded-full hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  aria-label={`Remove ${v.name} from favorites`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-2 px-5 py-4 rounded-2xl bg-card/50 backdrop-blur border border-border/30"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <p className="text-2xl font-extrabold text-foreground leading-none">
        {value}
      </p>
      <p className="text-xs text-muted-foreground font-medium text-center">
        {label}
      </p>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [page, setPage] = useState<Page>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("svf_favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const finderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.className = isDark ? "" : "light";
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("svf_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter((v) => {
      if (
        appliedFilters.vehicleType !== "both" &&
        v.type !== appliedFilters.vehicleType
      )
        return false;
      if (v.price > appliedFilters.budget) return false;
      if (
        appliedFilters.fuel !== "Any" &&
        !v.fuel.includes(appliedFilters.fuel as FuelType)
      )
        return false;
      if (
        appliedFilters.transmission !== "Any" &&
        v.type === "car" &&
        !v.transmission.includes(
          appliedFilters.transmission as "Manual" | "Automatic",
        )
      )
        return false;
      if (
        appliedFilters.usage.length > 0 &&
        !appliedFilters.usage.some((u) => v.usage.includes(u))
      )
        return false;
      if (
        appliedFilters.mileage !== "Any" &&
        v.mileageCategory !== appliedFilters.mileage
      )
        return false;
      if (
        brandSearch &&
        !v.brand.toLowerCase().includes(brandSearch.toLowerCase()) &&
        !v.name.toLowerCase().includes(brandSearch.toLowerCase())
      )
        return false;
      return true;
    });

    result = result.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "mileage-desc") return b.mileage - a.mileage;
      if (sortBy === "mileage-asc") return a.mileage - b.mileage;
      return 0;
    });

    return result;
  }, [appliedFilters, brandSearch, sortBy]);

  const handleFind = () => {
    setAppliedFilters(filters);
    setHasSearched(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setHasSearched(false);
    setBrandSearch("");
    setSortBy("price-asc");
  };

  const handleRandom = () => {
    const random = vehicles[Math.floor(Math.random() * vehicles.length)];
    setAppliedFilters({ ...defaultFilters, budget: random.price });
    setHasSearched(true);
    toast.success(`Random pick: ${random.brand} ${random.name}!`, {
      description: `${formatPrice(random.price)} • ${random.fuel.join("/")} • ${random.mileage} km/l`,
    });
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const toggleCompare = (id: number) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const usageOptions: { value: UsageType; label: string; icon: string }[] = [
    { value: "City", label: "City Driving", icon: "🏙️" },
    { value: "Highway", label: "Highway", icon: "🛣️" },
    { value: "Off-road", label: "Off-road", icon: "⛰️" },
    { value: "Commute", label: "Daily Commute", icon: "🔄" },
  ];

  const navLinks: { label: string; page: Page; icon: React.ReactNode }[] = [
    {
      label: "Home",
      page: "home",
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
    { label: "Vehicles", page: "vehicles", icon: <Car className="w-4 h-4" /> },
    {
      label: "Dealers",
      page: "dealers",
      icon: <Building2 className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${isDark ? "" : "light"}`}
    >
      <Toaster theme={isDark ? "dark" : "light"} richColors />

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <button
            type="button"
            data-ocid="header.link"
            onClick={() => setPage("home")}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-base sm:text-lg font-display tracking-tight">
              Smart<span className="text-primary">Vehicle</span>
              <span className="hidden xs:inline">Finder</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, page: p, icon }) => (
              <button
                key={p}
                type="button"
                data-ocid={`header.${p}.link`}
                onClick={() => setPage(p)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  page === p
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Favorites */}
            <button
              type="button"
              data-ocid="favorites.open_modal_button"
              onClick={() => setShowFavorites(true)}
              className="relative w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center hover:border-primary/50 transition-colors"
              aria-label="View favorites"
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {favorites.length > 9 ? "9+" : favorites.length}
                </span>
              )}
            </button>

            {/* Compare CTA */}
            <AnimatePresence>
              {compareList.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    data-ocid="compare.open_modal_button"
                    size="sm"
                    onClick={() =>
                      compareList.length === 2 && setShowCompare(true)
                    }
                    disabled={compareList.length < 2}
                    className="gap-1.5 text-xs h-9 px-3"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Compare ({compareList.length}/2)
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dark mode */}
            <button
              type="button"
              data-ocid="darkmode.toggle"
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center hover:border-primary/50 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Mobile menu */}
            <button
              type="button"
              data-ocid="header.menu.toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center hover:border-primary/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map(({ label, page: p, icon }) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPage(p);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? "bg-primary/12 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page Content ── */}
      <AnimatePresence mode="wait">
        {page === "vehicles" ? (
          <motion.div
            key="vehicles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <VehiclesPage
              favorites={favorites}
              onFavoriteToggle={toggleFavorite}
              compareList={compareList}
              onCompareToggle={toggleCompare}
              onNavigateToDealers={() => setPage("dealers")}
            />
          </motion.div>
        ) : page === "dealers" ? (
          <motion.div
            key="dealers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DealersPage />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── HERO ── */}
            <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-16">
              {/* Hero background image */}
              <div className="absolute inset-0">
                <img
                  src="/assets/generated/hero-vehicles.dim_1400x560.jpg"
                  alt="Smart Vehicle Finder hero"
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
              </div>

              {/* Animated grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `
                    linear-gradient(oklch(0.65 0.22 25) 1px, transparent 1px),
                    linear-gradient(90deg, oklch(0.65 0.22 25) 1px, transparent 1px)
                  `,
                  backgroundSize: "60px 60px",
                }}
              />

              {/* Glow orbs */}
              <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/6 blur-3xl pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  {/* Pre-badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-primary/12 border border-primary/25 text-primary text-xs font-bold tracking-widest uppercase"
                  >
                    <Star className="w-3 h-3 fill-primary" />
                    India's Smartest Vehicle Finder
                    <Star className="w-3 h-3 fill-primary" />
                  </motion.div>

                  {/* Heading */}
                  <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-[0.92] tracking-tight mb-6 font-display">
                    <span className="block text-foreground">Smart</span>
                    <span
                      className="block"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.65 0.22 25) 0%, oklch(0.75 0.20 45) 50%, oklch(0.65 0.22 25) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Vehicle
                    </span>
                    <span className="block text-foreground">Finder</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Find your perfect{" "}
                    <span className="text-foreground font-semibold">
                      car, bike, or truck
                    </span>{" "}
                    for the Indian market.{" "}
                    <span className="text-foreground font-semibold">
                      Instant recommendations
                    </span>{" "}
                    based on your budget and needs.
                  </p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-10">
                    {[
                      { icon: Car, value: "400+", label: "Vehicles" },
                      { icon: Building2, value: "37", label: "Dealers" },
                      { icon: MapPin, value: "All India", label: "Coverage" },
                    ].map(({ icon: Icon, value, label }, i) => (
                      <StatCard
                        key={label}
                        icon={Icon}
                        value={value}
                        label={label}
                        delay={0.3 + i * 0.1}
                      />
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Button
                      data-ocid="hero.primary_button"
                      size="lg"
                      onClick={() =>
                        finderRef.current?.scrollIntoView({
                          behavior: "smooth",
                        })
                      }
                      className="gap-2 text-base px-8 h-13 rounded-xl font-bold shadow-glow hover:shadow-glow-hover transition-all"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      Start Finding
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      data-ocid="hero.vehicles_button"
                      variant="outline"
                      size="lg"
                      onClick={() => setPage("vehicles")}
                      className="gap-2 text-base px-8 h-13 rounded-xl font-semibold border-border/60 hover:border-primary/50"
                    >
                      <Car className="w-5 h-5" />
                      Browse All Vehicles
                    </Button>
                    <Button
                      data-ocid="hero.dealers_button"
                      variant="ghost"
                      size="lg"
                      onClick={() => setPage("dealers")}
                      className="gap-2 text-base px-8 h-13 rounded-xl font-semibold"
                    >
                      <Building2 className="w-5 h-5" />
                      Find Dealers
                    </Button>
                  </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground"
                >
                  <span className="text-xs font-medium tracking-widest uppercase">
                    Scroll to Find
                  </span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.6,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronDown className="w-5 h-5 text-primary" />
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* ── FINDER FORM ── */}
            <section
              id="finder"
              ref={finderRef}
              className="py-20 px-4 bg-muted/10"
            >
              <div className="max-w-3xl mx-auto">
                {/* Section header */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-12"
                >
                  <Badge className="mb-4 bg-primary/12 text-primary border-primary/25 px-4 py-1 text-xs font-semibold tracking-widest uppercase">
                    <SlidersHorizontal className="w-3 h-3 mr-1.5" />
                    Smart Finder
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 font-display">
                    Find Your{" "}
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.75 0.20 45))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Perfect Match
                    </span>
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Set your preferences below and instantly find vehicles
                    tailored to your exact needs.
                  </p>
                </motion.div>

                {/* Form card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="glass-card rounded-2xl p-6 sm:p-8 space-y-7"
                >
                  {/* ── Budget ── */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                          ₹
                        </span>
                        Budget
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Up to
                        </span>
                        <span className="text-primary font-extrabold text-sm bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                          {formatPriceRange(filters.budget)}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        data-ocid="finder.budget_input"
                        type="range"
                        min={50000}
                        max={2000000}
                        step={50000}
                        value={filters.budget}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            budget: Number(e.target.value),
                          }))
                        }
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>₹50K</span>
                      <span>₹5L</span>
                      <span>₹10L</span>
                      <span>₹15L</span>
                      <span>₹20L</span>
                    </div>
                  </div>

                  {/* ── Vehicle Type ── */}
                  <div>
                    <Label className="text-sm font-bold flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                        <LayoutGrid className="w-3.5 h-3.5" />
                      </span>
                      Vehicle Type
                    </Label>
                    <div
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                      data-ocid="finder.vehicle_type.tab"
                    >
                      {(
                        [
                          { type: "car", label: "Car", icon: Car },
                          { type: "bike", label: "Bike", icon: Bike },
                          { type: "truck", label: "Truck", icon: Truck },
                          {
                            type: "both",
                            label: "All Types",
                            icon: LayoutGrid,
                          },
                        ] as const
                      ).map(({ type, label, icon: Icon }) => (
                        <button
                          type="button"
                          key={type}
                          data-ocid={`finder.type.${type}`}
                          onClick={() =>
                            setFilters((f) => ({ ...f, vehicleType: type }))
                          }
                          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                            filters.vehicleType === type
                              ? "bg-primary text-primary-foreground border-primary shadow-glow"
                              : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/30"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Fuel Type ── */}
                  <div>
                    <Label className="text-sm font-bold flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                        <Fuel className="w-3.5 h-3.5" />
                      </span>
                      Fuel Type
                    </Label>
                    <Select
                      value={filters.fuel}
                      onValueChange={(v) =>
                        setFilters((f) => ({
                          ...f,
                          fuel: v as FuelType | "Any",
                        }))
                      }
                    >
                      <SelectTrigger
                        data-ocid="finder.fuel_select"
                        className="w-full"
                      >
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">⛽ Any Fuel</SelectItem>
                        <SelectItem value="Petrol">🔴 Petrol</SelectItem>
                        <SelectItem value="Diesel">🟡 Diesel</SelectItem>
                        <SelectItem value="Electric">⚡ Electric</SelectItem>
                        <SelectItem value="Hybrid">🌿 Hybrid</SelectItem>
                        <SelectItem value="CNG">🟢 CNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ── Transmission (cars only) ── */}
                  <AnimatePresence>
                    {(filters.vehicleType === "car" ||
                      filters.vehicleType === "both") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <Label className="text-sm font-bold flex items-center gap-2 mb-4">
                          <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                            <Settings2 className="w-3.5 h-3.5" />
                          </span>
                          Transmission
                        </Label>
                        <RadioGroup
                          data-ocid="finder.transmission.radio"
                          value={filters.transmission}
                          onValueChange={(v) =>
                            setFilters((f) => ({
                              ...f,
                              transmission: v as "Manual" | "Automatic" | "Any",
                            }))
                          }
                          className="flex flex-wrap gap-3"
                        >
                          {(["Manual", "Automatic", "Any"] as const).map(
                            (t) => (
                              <div key={t} className="flex items-center gap-2">
                                <RadioGroupItem value={t} id={`trans-${t}`} />
                                <Label
                                  htmlFor={`trans-${t}`}
                                  className="cursor-pointer text-sm font-medium"
                                >
                                  {t === "Any" ? "No Preference" : t}
                                </Label>
                              </div>
                            ),
                          )}
                        </RadioGroup>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Usage Type ── */}
                  <div>
                    <Label className="text-sm font-bold flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                        <Gauge className="w-3.5 h-3.5" />
                      </span>
                      Usage Type
                      <span className="text-xs text-muted-foreground font-normal">
                        (select all that apply)
                      </span>
                    </Label>
                    <div
                      className="grid grid-cols-2 gap-2"
                      data-ocid="finder.usage.checkbox"
                    >
                      {usageOptions.map(({ value, label, icon }) => (
                        <label
                          key={value}
                          htmlFor={`usage-${value}`}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                            filters.usage.includes(value)
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-muted/20"
                          }`}
                        >
                          <Checkbox
                            id={`usage-${value}`}
                            checked={filters.usage.includes(value)}
                            onCheckedChange={() =>
                              setFilters((f) => ({
                                ...f,
                                usage: f.usage.includes(value)
                                  ? f.usage.filter((u) => u !== value)
                                  : [...f.usage, value],
                              }))
                            }
                          />
                          <span className="text-lg leading-none">{icon}</span>
                          <span className="text-sm font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* ── Mileage Preference ── */}
                  <div>
                    <Label className="text-sm font-bold flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                        <Gauge className="w-3.5 h-3.5" />
                      </span>
                      Mileage Preference
                    </Label>
                    <RadioGroup
                      data-ocid="finder.mileage.radio"
                      value={filters.mileage}
                      onValueChange={(v) =>
                        setFilters((f) => ({
                          ...f,
                          mileage: v as MileageCategory | "Any",
                        }))
                      }
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                    >
                      {(
                        [
                          { value: "Any", label: "Any", sub: "No preference" },
                          {
                            value: "high",
                            label: "High Mileage",
                            sub: "Fuel-saver",
                          },
                          {
                            value: "balanced",
                            label: "Balanced",
                            sub: "Best of both",
                          },
                          {
                            value: "performance",
                            label: "Performance",
                            sub: "Power first",
                          },
                        ] as const
                      ).map(({ value, label, sub }) => (
                        <div key={value}>
                          <RadioGroupItem
                            value={value}
                            id={`mil-${value}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`mil-${value}`}
                            className={`flex flex-col items-center text-center py-3 px-2 rounded-xl border cursor-pointer text-sm font-semibold transition-all ${
                              filters.mileage === value
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-muted/20"
                            }`}
                          >
                            <span className="font-bold text-xs">{label}</span>
                            <span className="text-[10px] opacity-70 mt-0.5">
                              {sub}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* ── Actions ── */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/20">
                    <Button
                      data-ocid="finder.submit_button"
                      size="lg"
                      onClick={handleFind}
                      className="flex-1 gap-2 rounded-xl font-bold h-12 shadow-glow hover:shadow-glow-hover"
                    >
                      <Search className="w-4 h-4" />
                      Find My Vehicle
                    </Button>
                    <Button
                      data-ocid="finder.random_button"
                      variant="outline"
                      size="lg"
                      onClick={handleRandom}
                      className="gap-2 rounded-xl h-12 border-border/60 hover:border-primary/50"
                    >
                      <Shuffle className="w-4 h-4" />
                      Random
                    </Button>
                    <Button
                      data-ocid="finder.reset_button"
                      variant="ghost"
                      size="lg"
                      onClick={handleReset}
                      className="gap-2 rounded-xl h-12"
                    >
                      <X className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ── RESULTS ── */}
            <AnimatePresence>
              {hasSearched && (
                <motion.section
                  key="results"
                  id="results"
                  ref={resultsRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="py-16 px-4"
                >
                  <div className="max-w-7xl mx-auto">
                    {/* Results header */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                          <span className="text-primary">
                            {filteredVehicles.length}
                          </span>{" "}
                          Vehicles Found
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                          Budget:{" "}
                          <span className="text-foreground font-semibold">
                            {formatPriceRange(appliedFilters.budget)}
                          </span>
                          {appliedFilters.vehicleType !== "both" && (
                            <>
                              {" · "}
                              <span className="text-foreground font-semibold capitalize">
                                {appliedFilters.vehicleType}s
                              </span>
                            </>
                          )}
                          {appliedFilters.fuel !== "Any" && (
                            <>
                              {" · "}
                              <span className="text-foreground font-semibold">
                                {appliedFilters.fuel}
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      {/* Search + sort */}
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            data-ocid="results.search_input"
                            placeholder="Search brand or model..."
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                            className="pl-9 w-full sm:w-52"
                          />
                        </div>
                        <Select
                          value={sortBy}
                          onValueChange={(v) => setSortBy(v as SortOption)}
                        >
                          <SelectTrigger
                            data-ocid="results.sort_select"
                            className="w-full sm:w-48 gap-2"
                          >
                            <ArrowUpDown className="w-3.5 h-3.5 flex-shrink-0" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="price-asc">
                              Price: Low to High
                            </SelectItem>
                            <SelectItem value="price-desc">
                              Price: High to Low
                            </SelectItem>
                            <SelectItem value="mileage-desc">
                              Mileage: Best First
                            </SelectItem>
                            <SelectItem value="mileage-asc">
                              Mileage: Lowest First
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Compare banner */}
                    <AnimatePresence>
                      {compareList.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="mb-6 p-4 rounded-xl border border-primary/25 bg-primary/5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            <span className="font-medium">
                              {compareList.length === 1
                                ? "Select 1 more vehicle to compare"
                                : "Ready to compare! 2 vehicles selected"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {compareList.length === 2 && (
                              <Button
                                data-ocid="results.compare_button"
                                size="sm"
                                onClick={() => setShowCompare(true)}
                                className="text-xs"
                              >
                                Compare Now
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setCompareList([])}
                              className="text-xs"
                              aria-label="Clear compare list"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Grid or empty state */}
                    <AnimatePresence mode="wait">
                      {filteredVehicles.length === 0 ? (
                        <motion.div
                          key="empty"
                          data-ocid="results.empty_state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center py-24"
                        >
                          <div className="w-20 h-20 rounded-2xl bg-muted/30 border border-border/20 mx-auto flex items-center justify-center mb-6">
                            <Car className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            No vehicles found
                          </h3>
                          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                            Try increasing your budget or changing your filter
                            criteria.
                          </p>
                          <div className="flex gap-3 justify-center">
                            <Button
                              onClick={handleReset}
                              variant="outline"
                              className="gap-2"
                            >
                              <X className="w-4 h-4" />
                              Reset Filters
                            </Button>
                            <Button
                              onClick={() => setPage("vehicles")}
                              className="gap-2"
                            >
                              <Car className="w-4 h-4" />
                              Browse All
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="grid"
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                        >
                          <AnimatePresence>
                            {filteredVehicles.map((vehicle, i) => (
                              <VehicleCard
                                key={vehicle.id}
                                vehicle={vehicle}
                                index={i + 1}
                                isFavorite={favorites.includes(vehicle.id)}
                                onFavoriteToggle={toggleFavorite}
                                compareList={compareList}
                                onCompareToggle={toggleCompare}
                                onNavigateToDealers={() => setPage("dealers")}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Browse all CTA */}
                    {filteredVehicles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center mt-12"
                      >
                        <p className="text-muted-foreground text-sm mb-4">
                          Want to see the full catalog?
                        </p>
                        <Button
                          data-ocid="results.browse_all_button"
                          variant="outline"
                          onClick={() => setPage("vehicles")}
                          className="gap-2"
                        >
                          <Car className="w-4 h-4" />
                          Browse All {vehicles.length}+ Vehicles
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* ── Feature Highlights (shown when no search yet) ── */}
            <AnimatePresence>
              {!hasSearched && (
                <motion.section
                  key="highlights"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 px-4 bg-muted/5"
                >
                  <div className="max-w-5xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center mb-12"
                    >
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-display mb-3">
                        Why Use Smart Vehicle Finder?
                      </h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Everything you need to make the right vehicle choice.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: Trophy,
                          title: "Smart Matching",
                          desc: "Instant AI-powered recommendations based on budget, usage, and preferences.",
                          color: "text-amber-400",
                        },
                        {
                          icon: Car,
                          title: "400+ Vehicles",
                          desc: "Comprehensive catalog of cars, bikes, and trucks across all segments and budgets.",
                          color: "text-blue-400",
                        },
                        {
                          icon: Building2,
                          title: "37 Dealers",
                          desc: "Verified dealers across India — from Delhi to Kochi — ready to assist you.",
                          color: "text-green-400",
                        },
                        {
                          icon: BarChart3,
                          title: "Side-by-Side Compare",
                          desc: "Compare any two vehicles on specs, price, and mileage before you decide.",
                          color: "text-purple-400",
                        },
                      ].map(({ icon: Icon, title, desc, color }, i) => (
                        <motion.div
                          key={title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.4 }}
                          className="glass-card rounded-2xl p-5 hover:border-primary/30 transition-all group"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-base mb-2">{title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {desc}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* ── Footer ── */}
            <footer className="border-t border-border/30 py-10 px-4 bg-card/30">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                      <Car className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-sm font-display">
                      Smart<span className="text-primary">Vehicle</span>Finder
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    © {new Date().getFullYear()}. Built with{" "}
                    <Heart className="w-3 h-3 inline text-primary fill-primary" />{" "}
                    using{" "}
                    <a
                      href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      caffeine.ai
                    </a>
                  </p>

                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <button
                      type="button"
                      data-ocid="footer.vehicles_link"
                      onClick={() => setPage("vehicles")}
                      className="hover:text-foreground transition-colors"
                    >
                      Vehicles
                    </button>
                    <button
                      type="button"
                      data-ocid="footer.dealers_link"
                      onClick={() => setPage("dealers")}
                      className="hover:text-foreground transition-colors"
                    >
                      Dealers
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showCompare && compareList.length === 2 && (
          <CompareModal
            vehicleIds={compareList}
            onClose={() => setShowCompare(false)}
          />
        )}
        {showFavorites && (
          <FavoritesModal
            favoriteIds={favorites}
            onClose={() => setShowFavorites(false)}
            onRemove={toggleFavorite}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
