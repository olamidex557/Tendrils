"use client";

type ProductsFiltersProps = {
  selectedCategory: string;
  selectedAvailability: string;
  maxPrice: number;
  onCategoryChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  onReset: () => void;
};

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Grocery",
  "Sports",
  "Home Essentials",
  "Beauty",
];

export default function ProductsFilters({
  selectedCategory,
  selectedAvailability,
  maxPrice,
  onCategoryChange,
  onAvailabilityChange,
  onPriceChange,
  onReset,
}: ProductsFiltersProps) {
  return (
    <aside className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filter Options</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-stone-500 transition hover:text-black"
        >
          Reset
        </button>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-stone-700">By Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-black text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-black"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-stone-700">Price</h4>
        <input
          type="range"
          min={0}
          max={500000}
          step={5000}
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full"
        />
        <p className="mt-2 text-sm text-stone-500">
          Up to ₦{maxPrice.toLocaleString()}
        </p>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-stone-700">Availability</h4>
        <div className="flex flex-wrap gap-2">
          {["All", "In Stock", "Out of Stock"].map((option) => {
            const active = selectedAvailability === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onAvailabilityChange(option)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-black text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-black"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
