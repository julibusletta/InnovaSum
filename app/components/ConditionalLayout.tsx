'use client';

import { usePathname } from 'next/navigation';
import Header from './Header/Header';
import LogosMarquee from './LogosMarquee/LogosMarquee';
import Footer from './Footer/Footer';
import WhatsAppButton from './WhatsAppButton/WhatsAppButton';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isMaintenance = pathname === '/maintenance';

  if (isAdmin || isMaintenance) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <LogosMarquee />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
