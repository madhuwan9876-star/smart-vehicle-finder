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
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BarChart3,
  Bike,
  Car,
  Download,
  Fuel,
  Heart,
  Search,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { type Vehicle, vehicles } from "../vehicles";

const formatPrice = (price: number): string => {
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`;
  }
  return `₹${(price / 1000).toFixed(0)}K`;
};

type SortOption =
  | "price-asc"
  | "price-desc"
  | "mileage-desc"
  | "mileage-asc"
  | "name-asc";
type TypeFilter = "all" | "car" | "bike" | "truck";
type FuelFilter = "all" | "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG";

const PAGE_SIZE = 24;

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
      <html><head><title>${vehicle.brand} ${vehicle.name}</title>
      <style>body{font-family:sans-serif;padding:20px;max-width:400px}img{width:100%;border-radius:8px}h2{margin:12px 0 4px}.spec{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee}</style></head>
      <body><img src="${vehicle.imageUrl}" alt="${vehicle.name}" />
      <h2>${vehicle.brand} ${vehicle.name}</h2>
      <div class="spec"><span>Price</span><span>${formatPrice(vehicle.price)}</span></div>
      <div class="spec"><span>Engine</span><span>${vehicle.engine}</span></div>
      <div class="spec"><span>Fuel</span><span>${vehicle.fuel.join(", ")}</span></div>
      <div class="spec"><span>Mileage</span><span>${vehicle.mileage > 0 ? `${vehicle.mileage} km/l` : "Electric"}</span></div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <motion.div
      data-ocid={`vehicles.item.${index}`}
      className="vehicle-card glass-card rounded-2xl overflow-hidden flex flex-col group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.36) }}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.brand} ${vehicle.name}`}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/80 to-transparent" />

        {/* Type + EV Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2 py-0.5 flex items-center gap-1">
            {vehicle.type === "car" ? (
              <Car className="w-3 h-3" />
            ) : vehicle.type === "truck" ? (
              <Truck className="w-3 h-3" />
            ) : (
              <Bike className="w-3 h-3" />
            )}
            {vehicle.type === "car"
              ? "Car"
              : vehicle.type === "truck"
                ? "Truck"
                : "Bike"}
          </Badge>
          {vehicle.fuel.includes("Electric") && (
            <Badge className="bg-emerald-600/90 text-white text-xs px-2 py-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3" /> EV
            </Badge>
          )}
        </div>

        {/* Favorite */}
        <button
          type="button"
          data-ocid={`vehicles.favorite_toggle.${index}`}
          onClick={() => onFavoriteToggle(vehicle.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/70 backdrop-blur flex items-center justify-center transition-all hover:bg-background/90 hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2.5">
          <p className="text-xs text-muted-foreground font-semibold tracking-widest uppercase">
            {vehicle.brand}
          </p>
          <h3 className="text-base font-bold text-foreground mt-0.5 leading-tight">
            {vehicle.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {vehicle.description}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-1.5 my-2.5">
          <div className="bg-muted/40 rounded-lg px-2.5 py-1.5">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-sm font-bold text-primary leading-tight">
              {formatPrice(vehicle.price)}
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg px-2.5 py-1.5">
            <p className="text-xs text-muted-foreground">Mileage</p>
            <p className="text-sm font-bold text-foreground leading-tight">
              {vehicle.mileage > 0 ? `${vehicle.mileage} km/l` : "EV"}
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg px-2.5 py-1.5">
            <p className="text-xs text-muted-foreground">Fuel</p>
            <p className="text-xs font-semibold text-foreground truncate">
              {vehicle.fuel.join("/")}
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg px-2.5 py-1.5">
            <p className="text-xs text-muted-foreground">Engine</p>
            <p className="text-xs font-semibold text-foreground truncate">
              {vehicle.engine}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 mt-auto pt-2">
          <button
            type="button"
            data-ocid={`vehicles.compare_button.${index}`}
            onClick={() => {
              if (!isInCompare && compareList.length >= 2) {
                toast.error("You can compare at most 2 vehicles");
                return;
              }
              onCompareToggle(vehicle.id);
            }}
            className={`flex-1 text-xs font-semibold py-2 px-2.5 rounded-lg border transition-all flex items-center justify-center gap-1 ${
              isInCompare
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <BarChart3 className="w-3 h-3 flex-shrink-0" />
            {isInCompare ? "In Compare" : "Compare"}
          </button>
          <button
            type="button"
            data-ocid={`vehicles.buy_button.${index}`}
            onClick={onNavigateToDealers}
            className="flex-1 text-xs font-semibold py-2 px-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            Buy from Dealer
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all flex-shrink-0"
            aria-label="Download vehicle card"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function VehiclesPage({
  favorites,
  onFavoriteToggle,
  compareList,
  onCompareToggle,
  onNavigateToDealers,
}: {
  favorites: number[];
  onFavoriteToggle: (id: number) => void;
  compareList: number[];
  onCompareToggle: (id: number) => void;
  onNavigateToDealers: () => void;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [fuelFilter, setFuelFilter] = useState<FuelFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [page, setPage] = useState(1);

  const counts = useMemo(
    () => ({
      all: vehicles.length,
      car: vehicles.filter((v) => v.type === "car").length,
      bike: vehicles.filter((v) => v.type === "bike").length,
      truck: vehicles.filter((v) => v.type === "truck").length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    let result = vehicles.filter((v) => {
      if (typeFilter !== "all" && v.type !== typeFilter) return false;
      if (fuelFilter !== "all" && !v.fuel.includes(fuelFilter as never))
        return false;
      if (
        search &&
        !v.brand.toLowerCase().includes(search.toLowerCase()) &&
        !v.name.toLowerCase().includes(search.toLowerCase()) &&
        !v.type.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
    result = result.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "mileage-desc") return b.mileage - a.mileage;
      if (sortBy === "mileage-asc") return a.mileage - b.mileage;
      if (sortBy === "name-asc")
        return `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`);
      return 0;
    });
    return result;
  }, [search, typeFilter, fuelFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setFuelFilter("all");
    setSortBy("price-asc");
    setPage(1);
  };

  // Reset to page 1 whenever filters change
  const handleTypeChange = (v: TypeFilter) => {
    setTypeFilter(v);
    setPage(1);
  };
  const handleFuelChange = (v: FuelFilter) => {
    setFuelFilter(v);
    setPage(1);
  };
  const handleSortChange = (v: SortOption) => {
    setSortBy(v);
    setPage(1);
  };
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const fuelFilters: { value: FuelFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "CNG", label: "CNG" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1
                className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                All <span className="text-primary">Vehicles</span>
              </h1>
              <p className="text-muted-foreground text-base">
                Browse our complete collection of{" "}
                <span className="text-foreground font-semibold">
                  {counts.all}
                </span>{" "}
                vehicles — cars, bikes &amp; trucks.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 w-fit">
              <span className="text-primary font-bold text-base">
                {filtered.length}
              </span>
              <span>/ {counts.all} showing</span>
            </div>
          </div>
        </motion.div>

        {/* Type Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-5"
          data-ocid="vehicles.type.tab"
        >
          {(
            [
              { value: "all", label: "All Vehicles", icon: null },
              {
                value: "car",
                label: "Cars",
                icon: <Car className="w-4 h-4" />,
              },
              {
                value: "bike",
                label: "Bikes",
                icon: <Bike className="w-4 h-4" />,
              },
              {
                value: "truck",
                label: "Trucks",
                icon: <Truck className="w-4 h-4" />,
              },
            ] as const
          ).map(({ value, label, icon }) => {
            const count =
              value === "all"
                ? counts.all
                : counts[value as keyof typeof counts];
            const isActive = typeFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleTypeChange(value as TypeFilter)}
                data-ocid={`vehicles.type_tab.${value}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {icon}
                {label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Fuel Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-5"
          data-ocid="vehicles.fuel.tab"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <Fuel className="w-3.5 h-3.5" />
            <span className="font-medium">Fuel:</span>
          </div>
          {fuelFilters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleFuelChange(value)}
              data-ocid={`vehicles.fuel_filter.${value}`}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                fuelFilter === value
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* Search + Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="vehicles.search_input"
              placeholder="Search brand, model, or type…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Select
            value={sortBy}
            onValueChange={(v) => handleSortChange(v as SortOption)}
          >
            <SelectTrigger
              data-ocid="vehicles.sort_select"
              className="w-full sm:w-52 gap-2"
            >
              <ArrowUpDown className="w-3.5 h-3.5 flex-shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="mileage-desc">Mileage: Best First</SelectItem>
              <SelectItem value="mileage-asc">Mileage: Lowest First</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results + Compare Banner */}
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">
                {compareList.length === 1
                  ? "Select 1 more vehicle to compare"
                  : "2 vehicles ready to compare"}
              </span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {compareList.length === 2 && (
                <Button
                  size="sm"
                  className="text-xs h-7 px-3"
                  onClick={() =>
                    toast.info("Use the Compare button in the header")
                  }
                >
                  Compare Now
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-7 w-7 p-0"
                onClick={() => {
                  for (const id of [...compareList]) onCompareToggle(id);
                }}
                aria-label="Clear compare list"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Vehicle Grid */}
        <AnimatePresence mode="wait">
          {paginated.length === 0 ? (
            <motion.div
              key="empty"
              data-ocid="vehicles.empty_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-2xl bg-muted/40 border border-border mx-auto flex items-center justify-center mb-6">
                <Car className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                No vehicles found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                Try a different search term or adjust your filters.
              </p>
              <Button
                data-ocid="vehicles.clear_filters_button"
                onClick={resetFilters}
                variant="outline"
                className="gap-2"
              >
                <X className="w-4 h-4" /> Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`page-${currentPage}-${typeFilter}-${fuelFilter}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((vehicle, i) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    index={i + 1}
                    isFavorite={favorites.includes(vehicle.id)}
                    onFavoriteToggle={onFavoriteToggle}
                    compareList={compareList}
                    onCompareToggle={onCompareToggle}
                    onNavigateToDealers={onNavigateToDealers}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between mt-10 gap-4"
                >
                  <Button
                    data-ocid="vehicles.pagination_prev"
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setPage((p) => p - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div
                    className="flex items-center gap-1.5"
                    data-ocid="vehicles.pagination"
                  >
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let p: number;
                      if (totalPages <= 7) {
                        p = i + 1;
                      } else if (currentPage <= 4) {
                        p = i < 6 ? i + 1 : totalPages;
                      } else if (currentPage >= totalPages - 3) {
                        p = i === 0 ? 1 : totalPages - 6 + i;
                      } else {
                        const mid = [
                          1,
                          currentPage - 1,
                          currentPage,
                          currentPage + 1,
                          totalPages,
                        ];
                        p = mid[i] ?? mid[mid.length - 1];
                      }
                      return (
                        <button
                          key={`page-btn-${p}`}
                          type="button"
                          onClick={() => {
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                            currentPage === p
                              ? "bg-primary text-primary-foreground"
                              : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    data-ocid="vehicles.pagination_next"
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setPage((p) => p + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* Page Info */}
              <p className="text-center text-xs text-muted-foreground mt-4">
                Showing{" "}
                <span className="text-foreground font-semibold">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-semibold">
                  {filtered.length}
                </span>{" "}
                vehicles
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
