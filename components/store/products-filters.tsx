export default function ProductsFilters() {
  return (
    <aside className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Filter Options</h3>
      </div>

      {/* Categories */}
      <div>
        <h4 className="mb-3 font-medium text-stone-700">
          By Categories
        </h4>
        <ul className="space-y-2 text-sm text-stone-600">
          <li>Electronics</li>
          <li>Fashion</li>
          <li>Grocery</li>
          <li>Sports</li>
          <li>Home Essentials</li>
        </ul>
      </div>

      {/* Price */}
      <div>
        <h4 className="mb-3 font-medium text-stone-700">
          Price
        </h4>
        <input type="range" className="w-full" />
        <p className="mt-2 text-sm text-stone-500">
          ₦10,000 — ₦500,000
        </p>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-3 font-medium text-stone-700">
          Rating
        </h4>
        <ul className="space-y-2 text-sm">
          <li>⭐⭐⭐⭐⭐</li>
          <li>⭐⭐⭐⭐</li>
          <li>⭐⭐⭐</li>
        </ul>
      </div>

      {/* Availability */}
      <div>
        <h4 className="mb-3 font-medium text-stone-700">
          Availability
        </h4>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" /> In Stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" /> Out of Stock
        </label>
      </div>
    </aside>
  );
}