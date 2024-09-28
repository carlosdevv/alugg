import Navbar from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-screen">
      <Navbar />
      <section className="px-8 py-12 w-full">{children}</section>
    </main>
  );
}
