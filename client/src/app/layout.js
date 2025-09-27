import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import ClientNavWrapper from "@/components/ClientNavWrapper";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NASA Space Biology Knowledge Engine",
  description: "Explore 30 years of NASA space biology research through an immersive 3D universe. Navigate 608+ publications, discover connections, and uncover insights for future Mars and Moon missions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <ClientNavWrapper>
          <div className="sticky top-0 z-50">
            <nav className="backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
              <div className="h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href="/" className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-semibold">B</span>
                    <span className="text-sm font-semibold text-gray-900">Biolore</span>
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
        </ClientNavWrapper>
        <main>{children}</main>
      </body>
    </html>
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
