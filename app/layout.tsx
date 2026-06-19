import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Bakes by Mom — Artisanal Cakes & Desserts",
  description:
    "Handcrafted cakes, brownies, cupcakes and cookies made with love for every celebration. Order online from Bakes by Mom.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <CustomCursor />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
