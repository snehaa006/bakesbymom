import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import ReviewsClient from "@/components/ReviewsClient";

export const metadata: Metadata = {
  title: "Reviews — Bakes by Mom",
  description:
    "Read what our customers say about their cakes and treats, and leave your own review.",
};

export default function ReviewsPage() {
  return (
    <SiteShell>
      <ReviewsClient />
    </SiteShell>
  );
}
