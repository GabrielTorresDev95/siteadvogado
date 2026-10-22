const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL ||
  'https://siteadvogado.onrender.com'


// ======================================================
// TIPOS DO BLOG
// ======================================================

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


// ======================================================
// TIPOS DOS ARTICLES
// ======================================================

export type ArticleBlock = {
  id: number

  __component: string

  // Rich Text
  body?: string

  // Quote
  title?: string
  text?: string

  // Outros componentes da Dynamic Zone
  [key: string]: any
}


export type Article = {
  id: number

  documentId?: string

  title: string

  description?: string | null

  slug?: string | null

  publishedAt?: string

  cover?: {
    url?: string
  } | null

  author?: any

  category?: any

  blocks?: ArticleBlock[]
}


// ======================================================
// FUNÇÃO PARA TRATAR URL DAS IMAGENS DO STRAPI
// ======================================================

function getMediaUrl(
  cover: any
): string | undefined {

  if (!cover) {
    return undefined
  }

  let media = cover


  // Caso seja array
  if (Array.isArray(cover)) {
    media = cover[0]
  }


  // Compatibilidade com estrutura antiga do Strapi
  if (cover.data) {

    media = Array.isArray(cover.data)
      ? cover.data[0]
      : cover.data
  }


  const attributes =
    media?.attributes || media


  const url =
    attributes?.url


  if (!url) {
    return undefined
  }


  // Strapi Cloud já retorna URL completa
  if (url.startsWith('http')) {
    return url
  }


  // Para Strapi local
  return `${STRAPI_URL}${url}`
}


// ======================================================
// BLOG SPOTS
// Usado pelo BlogSection.tsx
// ======================================================

export async function getBlogPosts():
  Promise<BlogPost[]> {

  const apiUrl =
    `${STRAPI_URL}/api/blog-spots` +
    '?populate=*' +
    '&sort=publishedAt:desc'


  console.log(
    'URL BLOG STRAPI:',
    apiUrl
  )


  const response =
    await fetch(apiUrl)


  if (!response.ok) {

    const errorBody =
      await response.text()


    console.error(
      'Erro da API do Blog:',
      {
        status: response.status,
        body: errorBody,
      }
    )


    throw new Error(
      `Erro ao buscar artigos do blog: ${response.status}`
    )
  }


  const json =
    await response.json()


  console.log(
    'BLOG DO STRAPI:',
    json
  )


  if (!Array.isArray(json.data)) {

    console.error(
      'json.data do Blog não é uma lista:',
      json
    )

    return []
  }


  return json.data.map(
    (item: any) => {

      /*
        Strapi 5:
        campos ficam diretamente no item.

        Strapi 4:
        campos ficam dentro de attributes.
      */

      const attributes =
        item.attributes || item


      const content =
        attributes.content ??
        item.content ??
        null


      return {

        id: item.id,

        documentId:
          item.documentId ||
          attributes.documentId,


        title:
          attributes.title ||
          'Artigo sem título',


        slug:
          attributes.slug || '',


        excerpt:
          attributes.excerpt ??
          null,


        content,


        category:
          attributes.category ??
          null,


        readTime:
          attributes.readTime ??
          null,


        videoUrl:
          attributes.videoUrl ??
          null,


        publishedAt:
          attributes.publishedAt,


        cover:
          getMediaUrl(
            attributes.cover
          )
            ? {
                url: getMediaUrl(
                  attributes.cover
                ),
              }
            : null,
      }
    }
  )
}


// ======================================================
// ARTICLES
// Usado pelo TestimonialsSection.tsx
// ======================================================

export async function getArticles():
  Promise<Article[]> {

  const apiUrl =
    `${STRAPI_URL}/api/articles` +
    '?populate=*' +
    '&sort=publishedAt:desc'


  console.log(
    'URL ARTICLES STRAPI:',
    apiUrl
  )


  const response =
    await fetch(apiUrl)


  if (!response.ok) {

    const errorBody =
      await response.text()


    console.error(
      'Erro da API de Articles:',
      {
        status: response.status,
        body: errorBody,
      }
    )


    throw new Error(
      `Erro ao buscar Articles: ${response.status}`
    )
  }


  const json =
    await response.json()


  console.log(
    'ARTICLES DO STRAPI:',
    json
  )


  if (!Array.isArray(json.data)) {

    console.error(
      'json.data de Articles não é uma lista:',
      json
    )

    return []
  }


  return json.data.map(
    (item: any) => {

      /*
        Compatibilidade com
        Strapi 4 e Strapi 5
      */

      const attributes =
        item.attributes || item


      const coverUrl =
        getMediaUrl(
          attributes.cover
        )


      return {

        id: item.id,


        documentId:
          item.documentId ||
          attributes.documentId,


        title:
          attributes.title ||
          'Artigo sem título',


        description:
          attributes.description ??
          null,


        slug:
          attributes.slug ??
          null,


        publishedAt:
          attributes.publishedAt,


        cover:
          coverUrl
            ? {
                url: coverUrl,
              }
            : null,


        author:
          attributes.author ??
          null,


        category:
          attributes.category ??
          null,


        blocks:
          Array.isArray(
            attributes.blocks
          )
            ? attributes.blocks
            : [],
      }
    }
  )
}