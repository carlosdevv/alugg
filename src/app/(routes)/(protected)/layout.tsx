import { MainNav } from "@/components/main-nav";

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
        <MainNav>
          {children}
          {sheet}
        </MainNav>
      </main>
    </>
  );
}
