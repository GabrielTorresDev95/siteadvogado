const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL ||
  'https://dependable-dance-cf7ce840cf.strapiapp.com'

export type StrapiBlock = {
  type: string
  text?: string
  format?: 'ordered' | 'unordered'
  level?: number
  children?: StrapiBlock[]
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
}

export type BlogPost = {
  id: number
  documentId?: string
  title: string
  slug: string
  excerpt?: string | null
  content?: StrapiBlock[] | null
  category?: string | null
  readTime?: string | null
  videoUrl?: string | null
  publishedAt?: string
  cover?: {
    url?: string
  } | null
}

function getMediaUrl(cover: any): string | undefined {
  if (!cover) return undefined

  let media = cover

  if (Array.isArray(cover)) {
    media = cover[0]
  }

  if (cover.data) {
    media = Array.isArray(cover.data)
      ? cover.data[0]
      : cover.data
  }

  const attributes = media?.attributes || media
  const url = attributes?.url

  if (!url) return undefined

  if (url.startsWith('http')) {
    return url
  }

  return `${STRAPI_URL}${url}`
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const apiUrl =
    `${STRAPI_URL}/api/blog-spots` +
    '?populate=*' +
    '&sort=publishedAt:desc'

  console.log('URL STRAPI:', apiUrl)

  const response = await fetch(apiUrl)

  if (!response.ok) {
    const errorBody = await response.text()

    console.error('Erro da API do Strapi:', {
      status: response.status,
      body: errorBody,
    })

    throw new Error(
      `Erro ao buscar artigos: ${response.status}`
    )
  }

  const json = await response.json()

  console.log('RESPOSTA ORIGINAL DO STRAPI:', json)

  if (!Array.isArray(json.data)) {
    console.error('json.data não é uma lista:', json)
    return []
  }

  return json.data.map((item: any) => {
    /*
      Strapi 5:
      os campos normalmente ficam diretamente em item.

      Strapi 4:
      os campos normalmente ficam em item.attributes.
    */
    const attributes = item.attributes || item

    const content = attributes.content ?? item.content ?? null

    console.log('POST MAPEADO:', {
      title: attributes.title,
      content,
      contentIsArray: Array.isArray(content),
    })

    return {
      id: item.id,
      documentId: item.documentId,

      title: attributes.title || 'Artigo sem título',
      slug: attributes.slug || '',

      excerpt: attributes.excerpt ?? null,

      // Campo indispensável para listas e parágrafos
      content,

      category: attributes.category ?? null,
      readTime: attributes.readTime ?? null,
      videoUrl: attributes.videoUrl ?? null,
      publishedAt: attributes.publishedAt,

      cover: getMediaUrl(attributes.cover)
        ? {
            url: getMediaUrl(attributes.cover),
          }
        : null,
    }
  })
}