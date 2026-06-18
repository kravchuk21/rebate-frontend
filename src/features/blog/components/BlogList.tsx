import { Typography } from '@heroui/react';

import { Link } from '@/i18n/navigation';
import type { BlogPostMeta } from '@/features/blog/lib/posts';

interface BlogListProps {
  posts: BlogPostMeta[];
}

export const BlogList = ({ posts }: BlogListProps) => (
  <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
    {posts.map((post) => (
      <Link
        key={post.slug}
        href={`/blog/${post.slug}`}
        className="flex flex-col gap-2 rounded-2xl border border-border/40 p-6 transition-colors hover:border-primary/50"
      >
        <span className="text-xs text-muted">{post.date}</span>
        <Typography type="h4">{post.title}</Typography>
        <p className="text-muted">{post.description}</p>
      </Link>
    ))}
  </div>
);
