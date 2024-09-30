
export default function InventoryLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode;
}>) {
  return (
    <>
      {sheet}
      {children}
    </>
  );
}
