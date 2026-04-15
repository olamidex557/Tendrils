import Link from "next/link";
import Logo from "@/components/shared/logo";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/order-tracking">Track Order</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}