import type { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { Geist, Geist_Mono } from 'next/font/google';

import { I18nProvider } from './components/i18n-provider';
import { ThemeProvider } from './components/theme-provider';
import { TopLoader } from './components/top-loader';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nawah',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  setStaticParamsLocale('en');
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TopLoader />
        <I18nProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
