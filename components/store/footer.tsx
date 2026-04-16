import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="mt-16 bg-[#8d86f7] px-4 py-14 md:px-6">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <div className="px-8 py-10 md:px-12 md:py-12">
                    <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <div className="text-2xl font-bold tracking-tight text-black">
                                TEMPLATE
                            </div>

                            <p className="mt-5 max-w-xs text-sm leading-7 text-stone-600">
                                Discover quality products across multiple categories with a
                                modern shopping experience built for convenience, trust, and
                                everyday value.
                            </p>

                            <div className="mt-6 flex items-center gap-4 text-stone-500">
                                <a href="#" aria-label="Facebook" className="transition hover:text-black">
                                    <FaFacebookF className="h-4 w-4" />
                                </a>

                                <a href="#" aria-label="Twitter" className="transition hover:text-black">
                                    <FaTwitter className="h-4 w-4" />
                                </a>

                                <a href="#" aria-label="Instagram" className="transition hover:text-black">
                                    <FaInstagram className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
                                Quick Links
                            </h3>

                            <ul className="mt-5 space-y-3 text-sm text-stone-600">
                                <li>
                                    <Link href="/about" className="transition hover:text-black">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products" className="transition hover:text-black">
                                        Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/all" className="transition hover:text-black">
                                        Categories
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/order-tracking" className="transition hover:text-black">
                                        Track Order
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="transition hover:text-black">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
                                Our Categories
                            </h3>

                            <ul className="mt-5 space-y-3 text-sm text-stone-600">
                                <li>
                                    <Link href="/categories/electronics" className="transition hover:text-black">
                                        Electronics
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/fashion" className="transition hover:text-black">
                                        Fashion
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/grocery" className="transition hover:text-black">
                                        Grocery
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/home-essentials" className="transition hover:text-black">
                                        Home Essentials
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/sports" className="transition hover:text-black">
                                        Sports
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
                                Contact Us
                            </h3>

                            <div className="mt-5 space-y-4 text-sm text-stone-600">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8d86f7]" />
                                    <p>Lorem ipsum vitae voluptatum alias eaque id eos delen</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-[#8d86f7]" />
                                    <p>info@TEMPLATE.com</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-[#8d86f7]" />
                                    <p>+234 705 224 3768</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-stone-200 pt-5">
                        <div className="flex flex-col gap-4 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
                            <p>© 2026 Designed by OLABYTE TECH. Your Premium Web Solutions.</p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/terms" className="transition hover:text-black">
                                    Terms of Service
                                </Link>
                                <Link href="/privacy" className="transition hover:text-black">
                                    Privacy Policy
                                </Link>
                                <Link href="/cookies" className="transition hover:text-black">
                                    Cookie Policy
                                </Link>
                                <Link href="/sitemap" className="transition hover:text-black">
                                    Sitemap
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}