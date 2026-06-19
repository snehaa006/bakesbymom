import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";

/**
 * Layout wrapper for the non-3D pages (orders, reviews, modules). Uses the
 * lightweight CSS ambient background instead of the heavy WebGL scene so these
 * content pages stay fast and readable.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="ambient-bg" aria-hidden />
      <Nav />
      <main className="page-content min-h-screen pt-28">{children}</main>
      <Footer />
    </>
  );
}
