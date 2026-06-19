const ITEMS = [
  "Custom Cakes",
  "Wedding Cakes",
  "Celebration Cakes",
  "Artisan Brownies",
  "Cupcakes",
  "Dessert Boxes",
  "Seasonal Collections",
];

export default function Marquee() {
  return (
    <div className="bg-champagne py-3.5 overflow-hidden whitespace-nowrap relative z-10">
      <div className="inline-flex animate-marquee">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-xs uppercase tracking-[0.25em] text-dark font-medium px-12">
              {item}
            </span>
            <span className="text-dark/35">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
