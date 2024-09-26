import Navbar from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full">
      <Navbar />
      <section className="px-8 py-12">{children}</section>
    </main>
  );
}
