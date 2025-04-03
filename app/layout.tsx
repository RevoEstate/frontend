import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants/index.ts";
import { Toaster } from '@/components/ui/sonner';



const inter = Inter({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    template: `%s | RevoEstate`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
          {children}
          <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
