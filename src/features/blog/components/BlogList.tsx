import { Link } from "@/i18n/navigation";
import { Card, Avatar, Typography } from "@heroui/react";
import type { BlogPostMeta } from "@/features/blog/lib/posts";

interface BlogListProps {
  posts: BlogPostMeta[];
}

export const BlogList = ({ posts }: BlogListProps) => (
  <div className="flex flex-col gap-6">
    {posts.map((post) => (
      <Link
        key={post.slug}
        href={`/blog/${post.slug}`}
      >
        <Card>
          <Typography.Paragraph size="sm" color='muted'>{post.date}</Typography.Paragraph>
          <Card.Header>
            <Card.Title>{post.title}</Card.Title>
            <Card.Description>{post.description}</Card.Description>
          </Card.Header>
          <Card.Footer className="flex gap-2">
            <Avatar aria-label="Sliceback logo picture" className="size-5">
              <Avatar.Image
                alt="Sliceback logo"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
              />
              <Avatar.Fallback>SB</Avatar.Fallback>
            </Avatar>
            <Typography.Paragraph size="xs">By Sliceback team</Typography.Paragraph>
          </Card.Footer>
        </Card>
      </Link>
    ))}
  </div>
);
