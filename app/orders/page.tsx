import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import OrdersClient from "@/components/OrdersClient";

export const metadata: Metadata = {
  title: "Order Online — Bakes by Mom",
  description:
    "Browse our menu of custom cakes, brownies, cupcakes and cookies, and place your order online.",
};

export default function OrdersPage() {
  return (
    <SiteShell>
      <OrdersClient />
    </SiteShell>
  );
}
