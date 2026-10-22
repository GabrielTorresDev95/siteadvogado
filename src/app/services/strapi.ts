
const STRAPI_URL = (
  import.meta.env.VITE_STRAPI_URL ||
  "https://siteadvogado.onrender.com"
).replace(/\/+$/, "");

// ======================================================
// TIPOS DO BLOG
// ======================================================

export type StrapiBlock = {
  type: string;
  text?: string;
  format?: "ordered" | "unordered";
  level?: number;
  children?: StrapiBlock[];
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
};

export type BlogPost = {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: StrapiBlock[] | null;
  category?: string | null;
  readTime?: string | null;
  videoUrl?: string | null;
  publishedAt?: string;
  cover?: {
    url?: string;
  } | null;
};

// ======================================================
// TIPOS DOS ARTICLES
// ======================================================

export type ArticleBlock = {
  id: number;
  __component: string;

  // Rich Text
  body?: string;

  // Quote
  title?: string;
  text?: string;

  // Outros campos da Dynamic Zone
  [key: string]: unknown;
};

export type Article = {
  id: number;
  documentId?: string;
  title: string;
  description?: string | null;
  slug?: string | null;
  publishedAt?: string;

  cover?: {
    url?: string;
  } | null;

  author?: unknown;
  category?: unknown;
  blocks?: ArticleBlock[];
};

// ======================================================
// TIPOS INTERNOS
// ======================================================

type StrapiRecord = {
  id: number;
  documentId?: string;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
};

type StrapiResponse = {
  data?: StrapiRecord[];
  error?: {
    message?: string;
  };
};

function asRecord(
  value: unknown
): Record<string, unknown> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as Record<string, unknown>;
  }

  return {};
}

function asString(
  value: unknown
): string | undefined {
  return typeof value === "string"
    ? value
    : undefined;
}

// ======================================================
// TRATAR URL DAS IMAGENS DO STRAPI
// ======================================================

function getMediaUrl(
  cover: unknown
): string | undefined {
  if (!cover) {
    return undefined;
  }

  let media: unknown = cover;

  // Caso o Strapi retorne uma lista
  if (Array.isArray(media)) {
    media = media[0];
  }

  // Compatibilidade com Strapi 4
  const original = asRecord(media);

  if (original.data) {
    media = Array.isArray(original.data)
      ? original.data[0]
      : original.data;
  }

  const mediaObject = asRecord(media);

  const attributes = mediaObject.attributes
    ? asRecord(mediaObject.attributes)
    : mediaObject;

  const url = asString(attributes.url);

  if (!url) {
    return undefined;
  }

  // URL absoluta
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // URL relativa
  return `${STRAPI_URL}${
    url.startsWith("/") ? url : `/${url}`
  }`;
}

// ======================================================
// BUSCAR DADOS DA API
// ======================================================

async function fetchStrapiData(
  endpoint: string
): Promise<StrapiRecord[]> {
  const apiUrl = `${STRAPI_URL}${endpoint}`;

  console.log("Buscando dados do Strapi:", apiUrl);

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();

    console.error("Erro da API do Strapi:", {
      status: response.status,
      body: errorBody,
    });

    throw new Error(
      `Erro ao buscar dados do Strapi: ${response.status}`
    );
  }

  const json: StrapiResponse =
    await response.json();

  if (!Array.isArray(json.data)) {
    console.error(
      "Resposta inesperada do Strapi:",
      json
    );

    throw new Error(
      "O Strapi não retornou uma lista válida."
    );
  }

  return json.data;
}

// ======================================================
// BLOG POSTS
// Utilizado pelo BlogSection.tsx
// ======================================================

export async function getBlogPosts(): Promise<
  BlogPost[]
> {
  const data = await fetchStrapiData(
    "/api/blog-spots?populate=*&sort=publishedAt:desc"
  );

  return data.map((item) => {
    // Strapi 4 ou Strapi 5
    const attributes = item.attributes
      ? asRecord(item.attributes)
      : item;

    const rawContent =
      attributes.content ?? item.content ?? null;

    const content = Array.isArray(rawContent)
      ? (rawContent as StrapiBlock[])
      : null;

    const coverUrl = getMediaUrl(
      attributes.cover
    );

    return {
      id: item.id,

      documentId:
        item.documentId ||
        asString(attributes.documentId),

      title:
        asString(attributes.title) ||
        "Artigo sem título",

      slug:
        asString(attributes.slug) || "",

      excerpt:
        asString(attributes.excerpt) ?? null,

      // Preserva parágrafos e listas do editor
      content,

      category:
        asString(attributes.category) ??
        asString(
          asRecord(attributes.category).name
        ) ??
        null,

      readTime:
        asString(attributes.readTime) ?? null,

      videoUrl:
        asString(attributes.videoUrl) ?? null,

      publishedAt:
        asString(attributes.publishedAt),

      cover: coverUrl
        ? {
            url: coverUrl,
          }
        : null,
    };
  });
}

// ======================================================
// ARTICLES
// Utilizado pelo TestimonialsSection.tsx
// ======================================================

export async function getArticles(): Promise<
  Article[]
> {
  const data = await fetchStrapiData(
    "/api/articles?populate=*&sort=publishedAt:desc"
  );

  return data.map((item) => {
    // Compatibilidade com Strapi 4 e 5
    const attributes = item.attributes
      ? asRecord(item.attributes)
      : item;

    const coverUrl = getMediaUrl(
      attributes.cover
    );

    const rawBlocks = attributes.blocks;

    const blocks = Array.isArray(rawBlocks)
      ? (rawBlocks as ArticleBlock[])
      : [];

    return {
      id: item.id,

      documentId:
        item.documentId ||
        asString(attributes.documentId),

      title:
        asString(attributes.title) ||
        "Artigo sem título",

      description:
        asString(attributes.description) ??
        null,

      slug:
        asString(attributes.slug) ?? null,

      publishedAt:
        asString(attributes.publishedAt),

      cover: coverUrl
        ? {
            url: coverUrl,
          }
        : null,

      author:
        attributes.author ?? null,

      category:
        attributes.category ?? null,

      blocks,
    };
  });
}
