import type { ReactNode } from "react";
import Navbar from "@/components/store/navbar";
import Footer from "@/components/store/footer";
import StorefrontCategoryStrip from "@/components/store/storefront-category-strip";

export default function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <StorefrontCategoryStrip />
      {children}
      <Footer />
    </>
  );
}
