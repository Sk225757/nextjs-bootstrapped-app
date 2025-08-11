import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tax Calculator FY 2024-25 | Compare Old vs New Tax Regime',
  description: 'Dynamic tax calculator to compare tax liability between Old Tax Regime and New Tax Regime for FY 2024-25. Calculate deductions, surcharge, cess and download PDF reports.',
  keywords: 'tax calculator, income tax, old regime, new regime, FY 2024-25, tax comparison, deductions, surcharge, cess',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
