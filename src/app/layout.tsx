import CreateOrganizationModal from "@/components/modals/create-organization-modal";
import { AppProviders } from "@/providers/app-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alugg",
  description: "Alugg is a platform for renting and leasing properties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt">
        <body className={inter.className}>
          <AppProviders>
            <CreateOrganizationModal className="bg-gray-50 px-4 py-8 sm:px-16" />
            {children}
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
