import Link from "next/link";
import Logo from "@/components/Logo";
import { CONTACT } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="relative z-10 px-6 md:px-16 pt-20 pb-10 bg-choco/50">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-champagne/10">
        <div>
          <Logo className="mb-4" />
          <p className="text-sm leading-relaxed text-cream/45 mb-6 max-w-xs">
            Handcrafted cakes, brownies, cupcakes and cookies made with love,
            seasonal ingredients and obsessive attention to beauty — based in{" "}
            {CONTACT.city}.
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
          links={[
            { label: "Collections", href: "/#collections" },
            { label: "Our Story", href: "/#story" },
            { label: "Order Online", href: "/orders" },
            { label: "Reviews", href: "/reviews" },
          ]}
        />
        <FooterCol
          title="Modules"
          links={[
            { label: "Wedding Cakes", href: "/collections/wedding-cakes" },
            { label: "Birthday Cakes", href: "/collections/birthday-cakes" },
            { label: "Anniversary Cakes", href: "/collections/anniversary-cakes" },
            { label: "Brownies & Treats", href: "/collections/treats" },
          ]}
        />
        <FooterCol
          title="Contact"
          links={[
            { label: "Instagram", href: CONTACT.instagram },
            { label: "Email Us", href: `mailto:${CONTACT.email}` },
            { label: "Order Now", href: "/orders" },
          ]}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
        <p className="text-xs text-cream/30">
          © {new Date().getFullYear()} {CONTACT.brand}. All rights reserved. Made
          with ♥ in {CONTACT.city}.
        </p>
        <div className="flex gap-6">
          <a
            href={CONTACT.instagram}
            data-cursor-hover
            className="text-xs uppercase tracking-[0.15em] text-cream/35 hover:text-champagne transition-colors"
          >
            Instagram
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            data-cursor-hover
            className="text-xs uppercase tracking-[0.15em] text-cream/35 hover:text-champagne transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[0.68rem] uppercase tracking-[0.22em] text-champagne mb-5">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              data-cursor-hover
              className="text-sm text-cream/45 hover:text-cream transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
