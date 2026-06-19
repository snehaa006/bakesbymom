export default function Footer() {
  return (
    <footer className="relative px-6 md:px-16 pt-20 pb-10 bg-choco/40">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-champagne/10">
        <div>
          <a href="#" className="font-serif text-2xl text-cream block mb-4">
            Velvet <span className="text-champagne">Crumb</span>
          </a>
          <p className="text-sm leading-relaxed text-cream/40 mb-6 max-w-xs">
            Handcrafted luxury cakes and desserts made with love, seasonal
            ingredients, and obsessive attention to beauty — based in
            Panipat, Haryana.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/5 border border-champagne/20 border-r-0 px-4 py-2.5 text-sm text-cream outline-none"
            />
            <button
              data-cursor-hover
              className="bg-champagne text-dark px-5 text-xs uppercase tracking-[0.15em] font-medium hover:bg-gold transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>

        <FooterCol
          title="Menu"
          links={["Collections", "Our Story", "Gallery", "Process", "Reviews"]}
        />
        <FooterCol
          title="Specialities"
          links={[
            "Custom Cakes",
            "Wedding Cakes",
            "Cupcakes",
            "Artisan Brownies",
            "Dessert Boxes",
          ]}
        />
        <FooterCol
          title="Contact"
          links={["Instagram", "WhatsApp", "Pinterest", "Email Us"]}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
        <p className="text-xs text-cream/30">
          © 2025 Velvet Crumb. All rights reserved. Made with ♥ in Panipat.
        </p>
        <div className="flex gap-6">
          {["Instagram", "Pinterest", "WhatsApp"].map((s) => (
            <a
              key={s}
              href="#"
              data-cursor-hover
              className="text-xs uppercase tracking-[0.15em] text-cream/35 hover:text-champagne transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-[0.68rem] uppercase tracking-[0.22em] text-champagne mb-5">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              data-cursor-hover
              className="text-sm text-cream/45 hover:text-cream transition-colors"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
