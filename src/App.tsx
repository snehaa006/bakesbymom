import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ChatBot } from "./components/ChatBot";

// Each page is its own chunk. The landing page carries three.js and its 3D
// scenes, and opening the catalog (or a cake, or the admin) should not mean
// downloading all of that first.
const Landing = lazy(() => import("./Landing").then((m) => ({ default: m.Landing })));
const Catalog = lazy(() =>
  import("./components/Catalog").then((m) => ({ default: m.Catalog })),
);
const CakeDetail = lazy(() =>
  import("./components/CakeDetail").then((m) => ({ default: m.CakeDetail })),
);
const Shop = lazy(() => import("./components/Shop").then((m) => ({ default: m.Shop })));
const ShopItem = lazy(() =>
  import("./components/ShopItem").then((m) => ({ default: m.ShopItem })),
);
const AdminPanel = lazy(() =>
  import("./components/admin/AdminPanel").then((m) => ({ default: m.AdminPanel })),
);

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
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:cakeId" element={<CakeDetail />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/shop/:category/:item" element={<ShopItem />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
      <ChatBot />
    </>
  );
}

export default App;
