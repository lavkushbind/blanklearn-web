import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import FacebookPixel from "@/components/fb/FacebookPixel";
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Blanklearn - Your Child\'s After-School Studies, Managed.',
  description: 'Interactive Live Classes in Small Groups (Max 8 Students). Homework help, concept clearing, and skill building—all inside one app.',
  
  // --- YE LINE ADD KAREIN (Favicon ke liye) ---
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn("font-sans antialiased", inter.variable)}>
                  <FacebookPixel />  {/* <--- YE LINE ADD KARNI HAI */}

          {children}
          <Toaster />
      </body>
    </html>
  );
}
