"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const categories = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Grocery",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "School",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80",
  },
];

export default function CategorySlider() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const el = trackRef.current;
    if (!el) return;

    gsap.to(el, {
      x: "-50%",
      duration: 18,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-black md:text-3xl">
          Shop by categories
        </h2>

        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
          →
        </button>
      </div>

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex w-max gap-6">
          {[...categories, ...categories].map((category, index) => (
            <div
              key={`${category.name}-${index}`}
              className="flex min-w-[120px] flex-col items-center gap-3"
            >
              <div className="h-28 w-28 overflow-hidden rounded-full border-[4px] border-[#d8c28a] md:h-32 md:w-32">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm font-medium text-black">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}