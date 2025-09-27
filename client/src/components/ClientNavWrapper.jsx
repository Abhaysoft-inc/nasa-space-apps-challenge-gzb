'use client';

import { usePathname } from 'next/navigation';

export default function ClientNavWrapper({ children }) {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return children;
}
