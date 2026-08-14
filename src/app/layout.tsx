import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import AnalyticsTracker from '@/components/AnalyticsTracker';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '3SGate – Social Enterprise Platform',
    template: '%s | 3SGate',
  },
  description:
    'A trusted gateway that connects Myanmar communities with opportunities, knowledge, businesses, and meaningful social impact.',
  keywords: ['Myanmar', 'Thailand', 'social enterprise', 'community', 'jobs', 'art', 'donations', 'food guide'],
  openGraph: {
    title: '3SGate – Social Enterprise Platform',
    description: 'Connecting Communities. Creating Opportunities.',
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AnalyticsTracker />
        <div style={{ position: 'sticky', top: '-52px', zIndex: 1000, background: '#0b0b0b' }}>
          <AdBanner />
          <Navbar />
        </div>
        <main className="page-wrapper">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
