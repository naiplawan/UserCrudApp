import type { Metadata } from 'next';
import { Geist_Mono, Nunito } from 'next/font/google';
import ClientSessionProvider from '@/app/ClientSessionProvider';
import './globals.css';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UserDataManagementAPP',
  description: 'A simple user data management app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  );
}
