"use client";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid items-center gap-8 rounded-2xl bg-[#f5f5f5] p-8 md:grid-cols-2">
        
        {/* LEFT */}
        <div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Glow Naturally with{" "}
            <span className="text-[#c59d5f]">Ajike Essentials</span>
          </h1>

          <p className="mt-4 text-gray-600">
            Discover premium skincare made with natural ingredients designed
            to give your skin the glow it deserves.
          </p>

          <div className="mt-6">
            <Button className="bg-black text-white hover:bg-gray-800">
              Shop Now
            </Button>
          </div>

          {/* PROMO CARDS */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#e7d7c1] p-4">
              <p className="text-sm font-semibold">Back to Glow</p>
              <p className="text-xs text-gray-600">
                Get skincare essentials at discount
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm font-semibold text-[#c59d5f]">
                20% OFF
              </p>
              <p className="text-xs text-gray-600">
                On all skincare products
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
            alt="Skincare model"
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}