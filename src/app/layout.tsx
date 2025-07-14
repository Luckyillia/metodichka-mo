import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/next"
import { Inter } from 'next/font/google';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Методичка для Министерства Обороны',
  description: 'Официальное руководство для Министерства Обороны',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>


    </html>
  );
}