const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

export type StrapiBlock = {
  type: string
  format?: 'ordered' | 'unordered'
  level?: number
  children?: StrapiBlock[]
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  url?: string
}

export type BlogPost = {
  id: number
  documentId?: string
  title: string
  slug: string
  excerpt?: string | null
  content?: StrapiBlock[] | string | null
  category?: string | null
  readTime?: string | null
  videoUrl?: string | null
  publishedAt?: string
  cover?: {
    url?: string
  } | null
}

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined

  // Quando o campo de mídia aceita vários arquivos
  const media = Array.isArray(cover)
    ? cover[0]
    : Array.isArray(cover.data)
      ? cover.data[0]
      : cover.data || cover

  const attributes = media?.attributes || media
  const url = attributes?.url

  if (!url) return undefined

  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const url =
    `${STRAPI_URL}/api/blog-spots` +
    `?populate=*` +
    `&sort=publishedAt:desc`

  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text()

    console.error('Erro da API do Strapi:', {
      status: response.status,
      url,
      resposta: errorText,
    })

    throw new Error(
      `Erro ao buscar artigos do Strapi: ${response.status}`
    )
  }

  const json = await response.json()

  if (!Array.isArray(json.data)) {
    console.error('Formato inesperado recebido do Strapi:', json)
    return []
  }

  return json.data.map((item: any) => {
    // Compatível com Strapi 4 e Strapi 5
    const post = item.attributes || item

    return {
      id: item.id,
      documentId: item.documentId,
      title: post.title || 'Artigo sem título',
      slug: post.slug || '',
      excerpt: post.excerpt ?? null,

      // Este campo estava faltando
      content: post.content ?? null,

      category: post.category ?? null,
      readTime: post.readTime ?? null,
      videoUrl: post.videoUrl ?? null,
      publishedAt: post.publishedAt,

      cover: getCoverUrl(post.cover)
        ? {
            url: getCoverUrl(post.cover),
          }
        : null,
    }
  })
}