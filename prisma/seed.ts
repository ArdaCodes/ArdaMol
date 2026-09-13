import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "arda@ardamol.com";
  const password = process.env.ADMIN_PASSWORD || "castle-of-ideas-2026";
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "Arda Mol", email, password: hashed },
  });

  const categories = [
    { name: "Technology", slug: "technology" },
    { name: "AI", slug: "ai" },
    { name: "Robotics", slug: "robotics" },
    { name: "Programming", slug: "programming" },
    { name: "Design", slug: "design" },
    { name: "History", slug: "history" },
    { name: "Ideas", slug: "ideas" },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  const tags = ["notes", "learning", "experiments", "build-in-public", "essay", "systems"];
  for (const t of tags) {
    await prisma.tag.upsert({
      where: { slug: t },
      update: {},
      create: { name: t.replace(/-/g, " "), slug: t },
    });
  }

  const ai = await prisma.category.findUnique({ where: { slug: "ai" } });
  const robotics = await prisma.category.findUnique({ where: { slug: "robotics" } });
  const ideas = await prisma.category.findUnique({ where: { slug: "ideas" } });
  const programming = await prisma.category.findUnique({ where: { slug: "programming" } });

  const posts = [
    {
      title: "Why I Build Things",
      slug: "why-i-build-things",
      excerpt: "A short case for making instead of consuming, and what it has cost and given me.",
      coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=1600&auto=format&fit=crop",
      categoryId: ideas?.id,
      featured: true,
      readingTime: 6,
      content: `## The itch\n\nI build things because reading about an idea is not the same as holding it. There is a specific kind of understanding that only shows up once you have broken something and put it back together.\n\n> Making is a way of asking better questions.\n\nMost of what I build never leaves my machine. That's fine. The archive isn't the point — the thinking is.\n\n### What actually changes\n\n- You stop being afraid of blank files\n- You develop taste, not just opinions\n- You learn where your assumptions were wrong\n\nThis note is the first entry in a longer thread I'll keep adding to as **Arda Mol** grows.`,
    },
    {
      title: "Learning Through Projects",
      slug: "learning-through-projects",
      excerpt: "Courses teach you syntax. Projects teach you judgment.",
      coverImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1600&auto=format&fit=crop",
      categoryId: programming?.id,
      readingTime: 5,
      content: `Every project I finish teaches me more than the ten I only plan.\n\n## The pattern\n\n1. Pick something slightly too hard\n2. Get embarrassingly stuck\n3. Find the smallest fix that unblocks you\n4. Repeat until it works\n\n\`\`\`ts\nfunction shipIt(idea: Idea): Project {\n  return refine(build(idea));\n}\n\`\`\`\n\nThe unglamorous truth is that most learning happens in step 2.`,
    },
    {
      title: "The Future of AI",
      slug: "the-future-of-ai",
      excerpt: "Some unpolished predictions about where the next decade of AI systems is heading.",
      coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
      categoryId: ai?.id,
      featured: false,
      readingTime: 8,
      content: `AI is moving from a feature bolted onto software to the substance software is made of.\n\n### Three quiet shifts\n\n- Interfaces get more conversational and less menu-driven\n- Small, specialized models start beating giant general ones on cost per task\n- The bottleneck moves from model quality to evaluation and trust\n\nNone of this is certain. I'm writing it down so I can be wrong publicly and learn from it.`,
    },
    {
      title: "Robotics and Creativity",
      slug: "robotics-and-creativity",
      excerpt: "Notes from tinkering with small robots and what it taught me about constraints.",
      coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop",
      categoryId: robotics?.id,
      readingTime: 7,
      content: `Working with physical hardware is humbling in a way software rarely is — the real world doesn't accept a quick patch.\n\n## Constraints as fuel\n\nEvery limitation — battery life, torque, weight — forced a more creative answer than I would have reached for with infinite resources.\n\n*Constraints aren't the enemy of creativity. They're usually its source.*`,
    },
    {
      title: "A Quiet Case for Slow Software",
      slug: "a-quiet-case-for-slow-software",
      excerpt: "Not everything needs to move fast. Some tools are better when they make you slow down.",
      coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
      categoryId: ideas?.id,
      readingTime: 4,
      content: `Speed is not always the point.\n\nSome of the best tools I use are the ones that ask me to slow down: a plain text editor, a paper notebook, a blank page.\n\n> Friction, used well, is a feature.`,
    },
    {
      title: "Building This Site",
      slug: "building-this-site",
      excerpt: "A behind-the-scenes note on how Arda Mol — this very site — came together.",
      coverImage: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
      categoryId: programming?.id,
      readingTime: 5,
      content: `This site is built with Next.js, Tailwind, and a small SQLite database behind an admin panel only I can access.\n\nThe goal was never to build the biggest system — just one that's mine, that I actually enjoy publishing into.`,
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, status: "published", publishedAt: new Date() },
    });
  }

  const notesTag = await prisma.tag.findUnique({ where: { slug: "notes" } });
  const learningTag = await prisma.tag.findUnique({ where: { slug: "learning" } });
  const firstPost = await prisma.post.findUnique({ where: { slug: "why-i-build-things" } });
  if (firstPost && notesTag && learningTag) {
    await prisma.postTag.upsert({
      where: { postId_tagId: { postId: firstPost.id, tagId: notesTag.id } },
      update: {},
      create: { postId: firstPost.id, tagId: notesTag.id },
    });
    await prisma.postTag.upsert({
      where: { postId_tagId: { postId: firstPost.id, tagId: learningTag.id } },
      update: {},
      create: { postId: firstPost.id, tagId: learningTag.id },
    });
  }

  const projects = [
    {
      title: "Signal",
      slug: "signal",
      description: "A small self-hosted dashboard for tracking personal metrics without sending data anywhere.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
      category: "Web",
      technologies: "Next.js, SQLite, TypeScript",
      externalUrl: "",
    },
    {
      title: "Wayfinder",
      slug: "wayfinder",
      description: "An experiment in path-planning for a small autonomous rover built from off-the-shelf parts.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop",
      category: "Robotics",
      technologies: "Python, ROS2, C++",
      externalUrl: "",
    },
    {
      title: "Loom",
      slug: "loom",
      description: "A lightweight local model fine-tuning experiment on a narrow writing-style dataset.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
      category: "AI",
      technologies: "PyTorch, LoRA, CUDA",
      externalUrl: "",
    },
    {
      title: "Ember",
      slug: "ember",
      description: "A generative type-poster series exploring medieval letterforms through code.",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1600&auto=format&fit=crop",
      category: "Creative",
      technologies: "p5.js, SVG",
      externalUrl: "",
    },
  ];
  for (const proj of projects) {
    await prisma.project.upsert({ where: { slug: proj.slug }, update: {}, create: proj });
  }

  await prisma.setting.upsert({
    where: { key: "siteTagline" },
    update: {},
    create: { key: "siteTagline", value: "Thoughts. Stories. Projects. Experiments." },
  });

  console.log("Seed complete. Admin login:", email, "/", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
