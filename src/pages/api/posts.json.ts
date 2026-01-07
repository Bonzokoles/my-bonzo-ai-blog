import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog"); // src/content/blog/*
  const data = posts
    .filter(p => !p.data.isDraft)
    .sort((a, b) => (b.data.pubDatetime?.valueOf?.() ?? 0) - (a.data.pubDatetime?.valueOf?.() ?? 0))
    .map(p => ({
      slug: p.slug, // lub p.id - zależnie od definicji kolekcji, ale slug bezpieczniejszy
      id: p.id,
      title: p.data.title ?? p.slug,
      description: p.data.description ?? "",
      date: p.data.pubDatetime ? new Date(p.data.pubDatetime).toISOString().slice(0, 10) : null,
      tags: Array.isArray(p.data.tags) ? p.data.tags : [],
      readingTime: p.data.readingTime ?? null // upewnij się że masz to w schemacie
    }));

  return new Response(JSON.stringify({ posts: data }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
};
