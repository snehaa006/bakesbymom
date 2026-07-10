import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Landing } from "./Landing";
import { Catalog } from "./components/Catalog";
import { CakeDetail } from "./components/CakeDetail";
import { AdminPanel } from "./components/admin/AdminPanel";

// Start each route at the top of the page instead of keeping the old scroll.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
}

export default App;
