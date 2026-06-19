import { Typography } from "@heroui/react";

import { Link } from "@/i18n/navigation";
import type { BlogPostMeta } from "@/features/blog/lib/posts";

interface BlogListProps {
  posts: BlogPostMeta[];
}

export const BlogList = ({ posts }: BlogListProps) => (
  <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
    {posts.map((post) => (
      <Link
        key={post.slug}
        href={`/blog/${post.slug}`}
        className="border-border/40 hover:border-primary/50 flex flex-col gap-2 rounded-2xl border p-6 transition-colors"
      >
        <span className="text-muted text-xs">{post.date}</span>
        <Typography type="h4">{post.title}</Typography>
        <p className="text-muted">{post.description}</p>
      </Link>
    ))}
  </div>
);
