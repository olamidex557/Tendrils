import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Mail, Phone, ShieldCheck, Truck } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Logo from "@/components/shared/logo";

type FooterProps = {
  storeName: string;
  storeEmail: string | null;
  storePhone: string | null;
  supportEmail: string | null;
};

const shoppingLinks: [string, string][] = [
  ["About us", "/about"],
  ["All products", "/products"],
  ["Categories", "/categories"],
  ["Wishlist", "/wishlist"],
  ["Cart", "/cart"],
  ["Track order", "/order-tracking"],
  ["Contact us", "/contact"],
];

const categoryLinks: [string, string][] = [
  ["Electronics", "/categories/electronics"],
  ["Fashion", "/categories/fashion"],
  ["Beauty", "/categories/beauty"],
  ["Home essentials", "/categories/home-essentials"],
  ["Sports", "/categories/sports"],
];

export default function Footer({
  storeName,
  storeEmail,
  storePhone,
  supportEmail,
}: FooterProps) {
  const email = supportEmail || storeEmail || "support@ajikeplus.com";
  const phone = storePhone || "+234 703 904 1074";

  return (
    <footer className="mt-12 bg-[#111111] px-4 pt-10 text-white md:px-6 md:pt-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.1fr_1.9fr] lg:gap-14">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-4">
              <Logo size="md" className="rounded-full bg-white p-1" />
              <span className="text-xl font-bold tracking-tight">
                {storeName}
              </span>
            </Link>

            <p className="mt-5 text-sm leading-6 text-white/65">
              Carefully selected beauty, fashion, home, lifestyle, and everyday
              essentials delivered with a simple shopping experience.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-white/70">
              <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#9bf36b]" />
                <span>Fast order processing across supported locations.</span>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9bf36b]" />
                <span>No refunds or exchanges after completed purchase.</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <SocialLink href="#" label="Facebook">
                <FaFacebookF className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="#" label="Twitter">
                <FaTwitter className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <FaInstagram className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterGroup title="Shop" links={shoppingLinks} />

            <FooterGroup title="Categories" links={categoryLinks} />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Contact
              </h3>

              <div className="mt-4 space-y-3 text-sm leading-6 text-white/65">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#9bf36b]" />
                  <span className="break-all">{email}</span>
                </a>

                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#9bf36b]" />
                  <span>{phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong className="font-semibold text-white/80">
              © 2026 {storeName}
            </strong>
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/products" className="transition hover:text-white">
              Products
            </Link>
            <Link href="/categories" className="transition hover:text-white">
              Categories
            </Link>
            <Link href="/order-tracking" className="transition hover:text-white">
              Track order
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
        {title}
      </h3>

      <div className="mt-4 grid gap-2 text-sm text-white/65">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="group inline-flex w-fit items-center gap-2 transition hover:text-white"
          >
            <span>{label}</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-white/30 hover:bg-white hover:text-black"
    >
      {children}
    </a>
  );
}
