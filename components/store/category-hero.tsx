type CategoryHeroProps = {
  name: string;
  description: string | null;
  image: string | null;
};

export default function CategoryHero({
  name,
  description,
  image,
}: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden bg-stone-950">
      <div className="absolute inset-0">
        <img
          src={image ?? ""}
          alt={name}
          className="h-full w-full object-cover opacity-35"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 text-white md:px-6 md:py-24">
        <p className="text-sm uppercase tracking-[0.25em] text-white/70">
          Category Collection
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {name}
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
          {description ?? "Browse products in this category."}
        </p>
      </div>
    </section>
  );
}
