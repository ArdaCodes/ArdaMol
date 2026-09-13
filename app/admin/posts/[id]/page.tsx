import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostEditor, { PostData } from "@/components/PostEditor";

export const revalidate = 0;

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });
  if (!post) notFound();

  const initial: PostData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage || "",
    categoryId: post.categoryId || "",
    tagIds: post.tags.map((t: any) => t.tagId),
    status: post.status,
    featured: post.featured,
    seoTitle: post.seoTitle || "",
    seoDesc: post.seoDesc || "",
  };

  return <PostEditor initial={initial} />;
}
