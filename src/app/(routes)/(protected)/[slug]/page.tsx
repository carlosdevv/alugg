import HomePageClient from "./page-client";

interface HomePageProps {
  params: {
    slug: string;
  };
}

export default function HomePage({ params }: HomePageProps) {
  return (
    <>
      <HomePageClient slug={params.slug} />
    </>
  );
}
