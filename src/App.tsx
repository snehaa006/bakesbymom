import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Landing } from "./Landing";
import { Catalog } from "./components/Catalog";
import { CakeDetail } from "./components/CakeDetail";
import { Shop } from "./components/Shop";
import { ShopItem } from "./components/ShopItem";
import { AdminPanel } from "./components/admin/AdminPanel";
import { ChatBot } from "./components/ChatBot";

/**
 * Start each route at the top of the page instead of keeping the old scroll —
 * unless the link carried a hash, in which case land on that section. The
 * navbar routes home as "/#about" from the catalog, and this is what catches it.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // The target section may still be mounting on a fresh route, so look for it
    // on the next frame rather than during this render pass.
    const frame = requestAnimationFrame(() => {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:cakeId" element={<CakeDetail />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/shop/:category/:item" element={<ShopItem />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <ChatBot />
    </>
  );
}

export default App;
