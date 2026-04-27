import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#8d86f7] px-3 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div className="px-5 py-6 md:px-12 md:py-10">
          <div className="grid gap-5 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="text-lg font-bold tracking-tight text-black">
                TEMPLATE
              </div>

              <p className="mt-2 max-w-sm text-xs leading-5 text-stone-600">
                Quality products across multiple categories, built for simple and trusted shopping.
              </p>

              <div className="mt-3 flex items-center gap-3 text-stone-500">
                <a href="#" aria-label="Facebook">
                  <FaFacebookF className="h-3.5 w-3.5" />
                </a>
                <a href="#" aria-label="Twitter">
                  <FaTwitter className="h-3.5 w-3.5" />
                </a>
                <a href="#" aria-label="Instagram">
                  <FaInstagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <FooterGroup
              title="Links"
              links={[
                ["About", "/about"],
                ["Shop", "/products"],
                ["Categories", "/categories/all"],
                ["Track", "/order-tracking"],
                ["Contact", "/contact"],
              ]}
            />

            <FooterGroup
              title="Categories"
              links={[
                ["Electronics", "/categories/electronics"],
                ["Fashion", "/categories/fashion"],
                ["Grocery", "/categories/grocery"],
                ["Home", "/categories/home-essentials"],
                ["Sports", "/categories/sports"],
              ]}
            />

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-black">
                Contact
              </h3>

              <div className="mt-2 space-y-2 text-xs leading-5 text-stone-600">
                <p className="flex gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8d86f7]" />
                  <span className="line-clamp-1">
                    Lorem ipsum vitae voluptatum alias eaque id eos delen
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#8d86f7]" />
                  info@TEMPLATE.com
                </p>

                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#8d86f7]" />
                  +234 705 224 3768
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-stone-200 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-500">
              <p>© 2026 OLABYTE TECH</p>

              <div className="flex flex-wrap gap-3">
                <Link href="/terms">Terms</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/cookies">Cookies</Link>
                <Link href="/sitemap">Sitemap</Link>
              </div>
            </div>
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
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-black">
        {title}
      </h3>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="transition hover:text-black">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
} 