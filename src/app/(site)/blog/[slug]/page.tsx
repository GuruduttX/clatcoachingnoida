import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArticleHeader,
  ArticleShell,
  Body,
  Byline,
  CounsellorCard,
  FaqBlock,
  QuickAnswer,
  Tags,
  Takeaways,
} from "@/components/content/article-screen";
import { CardRail } from "@/components/content/content-card";
import { articleJsonLd, faqs, formatDate, list, num, str } from "@/components/content/doc";
import { ArticleSkeleton } from "@/components/content/skeletons";
import { getPublished, listPublished } from "@/lib/server/content";
import { site } from "@/lib/site";

type Params = PageProps<"/blog/[slug]">["params"];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getPublished("blogs", slug);
  if (!doc) return { title: "Article not found" };
  const image = str(doc, "image");
  return {
    title: str(doc, "meta.title") ? { absolute: str(doc, "meta.title") } : str(doc, "title"),
    description: str(doc, "meta.description") || str(doc, "excerpt"),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", title: str(doc, "title"), images: image ? [image] : undefined },
  };
}

export default function BlogPostPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <BlogPost params={params} />
    </Suspense>
  );
}

async function BlogPost({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = await getPublished("blogs", slug);
  if (!doc) notFound();

  const category = str(doc, "category");
  const all = await listPublished("blogs", { select: "title slug category image alt readTime publishedAt" });
  const relatedSlugs = list(doc, "relatedPostSlugs");
  const others = all.filter((d) => d.slug !== slug);
  const related = [
    ...others.filter((d) => relatedSlugs.includes(String(d.slug))),
    ...others.filter((d) => !relatedSlugs.includes(String(d.slug)) && str(d, "category") === category),
    ...others,
  ]
    .filter((d, i, arr) => arr.findIndex((x) => x.slug === d.slug) === i)
    .slice(0, 3);

  const title = str(doc, "title");
  const image = str(doc, "image");
  const faqItems = faqs(doc);

  return (
    <ArticleShell
      jsonLdData={[
        articleJsonLd({
          headline: title,
          description: str(doc, "excerpt"),
          image,
          datePublished: str(doc, "publishedAt"),
          dateModified: str(doc, "updatedAt").slice(0, 10),
          author: str(doc, "author.name"),
          url: `${site.url}/blog/${slug}`,
        }),
      ]}
    >
      <ArticleHeader back={{ href: "/blog", label: "All articles" }} eyebrow={category || "Blog"} title={title} image={image} alt={str(doc, "alt")} />
      <Byline author={str(doc, "author.name")} date={str(doc, "publishedAt")} readTime={num(doc, "readTime")} />
      <QuickAnswer label="TL;DR" text={str(doc, "tldr") || str(doc, "excerpt")} />
      <Takeaways items={list(doc, "keyTakeaways")} />
      <Body html={str(doc, "content")} />
      <FaqBlock items={faqItems} />
      <Tags items={list(doc, "tags")} />
      <CounsellorCard />
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-[22px] font-bold tracking-[-0.02em] md:text-[28px]">Read next</h2>
          <CardRail
            cards={related.map((d) => ({
              href: `/blog/${d.slug}`,
              title: str(d, "title"),
              eyebrow: str(d, "category") || undefined,
              meta: formatDate(str(d, "publishedAt")),
              image: str(d, "image") || undefined,
              alt: str(d, "alt"),
              readTime: num(d, "readTime"),
            }))}
          />
        </section>
      )}
    </ArticleShell>
  );
}
