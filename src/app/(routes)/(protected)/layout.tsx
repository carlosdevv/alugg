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
      <main className="min-h-screen w-full bg-white">
        <MainNav>
          {children}
          {sheet}
        </MainNav>
      </main>
    </>
  );
}
