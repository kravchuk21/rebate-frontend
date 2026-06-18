import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getAllSlugs, getPostBySlug } from '@/features/blog/lib/posts';
import { BlogArticle } from '@/features/blog/components/BlogArticle';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllSlugs(params.locale).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'blog' });

  return (
    <div className="min-h-screen px-6 py-12 md:py-24">
      <div className="max-w-2xl mx-auto w-full mb-8">
        <Link href="/blog" className="text-sm text-muted hover:text-foreground">
          {t('backToBlog')}
        </Link>
      </div>
      <BlogArticle post={post} />
    </div>
  );
}
