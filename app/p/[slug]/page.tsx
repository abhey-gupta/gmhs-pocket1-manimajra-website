import DynamicPageView from "@/components/DynamicPageView";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <DynamicPageView slug={params.slug} />;
}
