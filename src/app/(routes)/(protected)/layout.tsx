import Navbar from "@/components/navbar";

export default function ProtectedLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex h-screen w-screen overflow-hidden">
        <Navbar />
        <section className="px-8 py-12 w-full overflow-y-auto overflow-x-hidden">
          {children}
          {sheet}
        </section>
      </main>
    </>
  );
}
