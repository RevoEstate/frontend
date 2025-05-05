import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  APP_DESCRIPTION,
  APP_NAME,
  SERVER_URL,
} from "@/lib/constants/index.ts";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";
import { Chatbot } from "@/components/shared/Chatbot";

const inter = Inter({
  subsets: ["latin"],
});

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
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          {children}
          <Toaster richColors position="top-center" />
          <Chatbot />
        </body>
      </html>
    </Providers>
   
  );
}