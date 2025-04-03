import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen flex-col'>
      <Navbar />
      <main className='flex-1 wrapper'>{children}</main>
    </div>
  );
}
