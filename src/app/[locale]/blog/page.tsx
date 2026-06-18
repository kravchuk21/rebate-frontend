import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { getAllPosts } from '@/features/blog/lib/posts';
import { BlogList } from '@/features/blog/components/BlogList';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = getAllPosts(locale);

  return (
    <div className="min-h-screen px-6 py-12 md:py-24">
      <div className="max-w-2xl mx-auto w-full mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t('title')}</h1>
        <p className="text-muted">{t('description')}</p>
      </div>
      {posts.length > 0 ? (
        <BlogList posts={posts} />
      ) : (
        <p className="text-center text-muted">{t('empty')}</p>
      )}
    </div>
  );
}
