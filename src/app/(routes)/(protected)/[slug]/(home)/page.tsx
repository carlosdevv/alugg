import HomePageClient from "./page-client";

interface HomePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { slug } = await params;

  return <HomePageClient slug={slug} />;
}
