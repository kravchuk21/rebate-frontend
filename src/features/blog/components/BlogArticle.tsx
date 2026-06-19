import { Typography, Avatar } from "@heroui/react";

import type { BlogPost } from "@/features/blog/lib/posts";

interface BlogArticleProps {
  post: BlogPost;
}

export const BlogArticle = ({ post }: BlogArticleProps) => (
  <article className="flex flex-col gap-4">
    <div className="flex gap-2">
      <Avatar aria-label="Sliceback logo picture" className="size-5">
        <Avatar.Image
          alt="Sliceback logo"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
        />
        <Avatar.Fallback>SB</Avatar.Fallback>
      </Avatar>
      <Typography.Paragraph size="xs">By Sliceback team</Typography.Paragraph>
      <Typography.Paragraph size="xs" color="muted">{post.date}</Typography.Paragraph>
    </div>
    <Typography.Prose
      className="flex flex-col gap-3"
      dangerouslySetInnerHTML={{ __html: post.contentHtml }}
    >
      {null}
    </Typography.Prose>
  </article>
);
