import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Blanklearn - Your Child\'s After-School Studies, Managed.',
  description: 'Interactive Live Classes in Small Groups (Max 8 Students). Homework help, concept clearing, and skill building—all inside one app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn("font-sans antialiased", inter.variable)}>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
