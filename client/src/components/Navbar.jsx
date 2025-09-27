"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const hide = pathname === "/" || pathname === "/landing" || pathname?.startsWith("/landing/");
    if (hide) return null;

    return (
        <div className="sticky top-0 z-50">
            <nav className="backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="inline-flex items-center gap-2">
                                <img src={'/logo2.png'} className="w-8 rounded-full" />
                                <span className="text-lg font-semibold text-gray-900">Space Biolores</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <NavLink href="/papers">Papers</NavLink>
                            <NavLink href="/mission">Mission</NavLink>
                            <NavLink href="/user/profile">Profile</NavLink>
                        </div>
                        <div className="md:hidden">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

function NavLink({ href, children }) {
    return (
        <Link
            href={href}
            className="text-sm text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
        >
            {children}
        </Link>
    );
}

function MobileMenu() {
    return (
        <details className="relative">
            <summary className="list-none cursor-pointer p-2 -mr-2 rounded hover:bg-gray-100">
                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg p-2">
                <Link href="/papers" className="block px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50">Papers</Link>
                <Link href="/mission" className="block px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50">Mission</Link>
                <Link href="/user/profile" className="block px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
            </div>
        </details>
    );
}
