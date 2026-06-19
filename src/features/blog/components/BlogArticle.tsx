import { Typography } from "@heroui/react";

import type { BlogPost } from "@/features/blog/lib/posts";

interface BlogArticleProps {
  post: BlogPost;
}

export const BlogArticle = ({ post }: BlogArticleProps) => (
  <article className="mx-auto w-full max-w-2xl">
    <p className="text-muted mb-2 text-xs">{post.date}</p>
    <Typography.Prose
      className="flex flex-col gap-3"
      dangerouslySetInnerHTML={{ __html: post.contentHtml }}
    >
      {null}
    </Typography.Prose>
  </article>
);
