import Footer from "@/components/footer";
import Nav from "@/components/nav";
import PlansPageClient from "./page-client";

export default function PlansPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1120px] flex-col">
      <Nav />
      <PlansPageClient />
      <Footer />
    </div>
  );
}
