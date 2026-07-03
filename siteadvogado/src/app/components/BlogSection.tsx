'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Calendar, ArrowRight, FileText, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useEffect, useState } from 'react'
import { getBlogPosts, type BlogPost } from '../services/strapi'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'

export function BlogSection() {
  const { colors } = useTheme()
  const [articles, setArticles] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null)

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await getBlogPosts()
        console.log('POSTS STRAPI:', data)
        setArticles(data)
      } catch (error) {
        console.error('Erro ao buscar posts do Strapi:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [])

  function formatDate(date?: string) {
    if (!date) return 'Sem data'

    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  function getVideoEmbedUrl(url?: string | null) {
    if (!url) return ''

    const cleanUrl = url.trim()

    if (cleanUrl.includes('youtube.com/watch?v=')) {
      const videoId = cleanUrl.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    if (cleanUrl.includes('youtu.be/')) {
      const videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    if (cleanUrl.includes('youtube.com/embed/')) {
      return cleanUrl
    }

    return cleanUrl
  }

function extractTextFromBlock(block: any): string {
  if (!block) return ''

  if (typeof block.text === 'string') {
    return block.text
  }

  if (Array.isArray(block.children)) {
    return block.children
      .map((child: any) => extractTextFromBlock(child))
      .filter(Boolean)
      .join(' ')
  }

  return ''
}

function getArticleText(article: BlogPost) {
  if (typeof article.excerpt === 'string' && article.excerpt.trim()) {
    return article.excerpt.trim()
  }

  if (typeof article.content === 'string' && article.content.trim()) {
    return article.content.trim()
  }

  if (Array.isArray(article.content)) {
    const text = article.content
      .map((block: any) => extractTextFromBlock(block))
      .filter(Boolean)
      .join(' ')
      .trim()

    if (text) {
      return text
    }
  }

  return 'Conteúdo completo ainda não disponível.'
}

  return (
    <section
      id="conteudos"
      className="py-20"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: `${colors.secondary}20` }}
          >
            <FileText className="w-4 h-4" style={{ color: colors.secondary }} />

            <span
              className="text-sm font-semibold"
              style={{ color: colors.secondary }}
            >
              Blog Jurídico
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.primary }}
          >
            Conteúdos Educativos
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textLight }}
          >
            Artigos especializados sobre propriedade intelectual, direitos
            autorais e proteção de marcas
          </p>
        </motion.div>

        {loading ? (
          <p style={{ color: colors.textLight }} className="text-center">
            Carregando artigos...
          </p>
        ) : articles.length === 0 ? (
          <p style={{ color: colors.textLight }} className="text-center">
            Nenhum artigo publicado ainda.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group rounded-xl overflow-hidden shadow-lg transition-all"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.secondary}20`,
                }}
              >
                {article.videoUrl ? (
                  <div className="w-full aspect-video bg-black">
                    <iframe
                      src={getVideoEmbedUrl(article.videoUrl)}
                      className="w-full h-full"
                      title={article.title}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : article.cover?.url ? (
                  <img
                    src={article.cover.url}
                    alt={article.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : null}

                <div className="p-6 pb-0">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${colors.secondary}20`,
                      color: colors.secondary,
                    }}
                  >
                    {article.category || 'Conteúdo'}
                  </span>
                </div>

                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-3 group-hover:opacity-80 transition-opacity"
                    style={{ color: colors.primary }}
                  >
                    {article.title}
                  </h3>

                  <p
                    className="mb-4 line-clamp-3"
                    style={{ color: colors.textLight }}
                  >
                    {getArticleText(article)}
                  </p>

                  <div
                    className="flex items-center justify-between text-sm"
                    style={{ color: colors.textLight }}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    <span>{article.readTime || 'Leitura rápida'}</span>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="mt-4 flex items-center space-x-2 font-semibold transition-all group-hover:translate-x-2"
                    style={{ color: colors.secondary }}
                  >
                    <span>Ler artigo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-10 shadow-2xl"
              style={{ backgroundColor: colors.background }}
            >
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{
                      backgroundColor: `${colors.secondary}20`,
                      color: colors.secondary,
                    }}
                  >
                    {selectedArticle.category || 'Conteúdo'}
                  </span>

                  <h2
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {selectedArticle.title}
                  </h2>

                  <p
                    className="mt-3 text-sm"
                    style={{ color: colors.textLight }}
                  >
                    {formatDate(selectedArticle.publishedAt)}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-3 rounded-full"
                  style={{
                    backgroundColor: `${colors.secondary}15`,
                    color: colors.primary,
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedArticle.videoUrl ? (
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden mb-6">
                  <iframe
                    src={getVideoEmbedUrl(selectedArticle.videoUrl)}
                    className="w-full h-full"
                    title={selectedArticle.title}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : selectedArticle.cover?.url ? (
                <img
                  src={selectedArticle.cover.url}
                  alt={selectedArticle.title}
                  className="w-full rounded-2xl mb-6"
                />
              ) : null}

              <div
                className="
                  text-lg leading-relaxed
                  [&_p]:mb-4
                  [&_strong]:font-bold
                  [&_em]:italic
                  [&_a]:underline
                "
                style={{ color: colors.textLight }}
              >
                {Array.isArray(selectedArticle.content) ? (
                  <BlocksRenderer
                    content={selectedArticle.content as any}
                    blocks={{
                      paragraph: ({ children }) => (
                        <p className="mb-4">{children}</p>
                      ),

                      heading: ({ children, level }) => {
                        if (level === 1) {
                          return (
                            <h1 className="text-4xl font-bold mb-5 mt-6">
                              {children}
                            </h1>
                          )
                        }

                        if (level === 2) {
                          return (
                            <h2 className="text-3xl font-bold mb-4 mt-6">
                              {children}
                            </h2>
                          )
                        }

                        if (level === 3) {
                          return (
                            <h3 className="text-2xl font-bold mb-4 mt-6">
                              {children}
                            </h3>
                          )
                        }

                        if (level === 4) {
                          return (
                            <h4 className="text-xl font-bold mb-3 mt-5">
                              {children}
                            </h4>
                          )
                        }

                        if (level === 5) {
                          return (
                            <h5 className="text-lg font-bold mb-3 mt-5">
                              {children}
                            </h5>
                          )
                        }

                        return (
                          <h6 className="text-base font-bold mb-3 mt-5">
                            {children}
                          </h6>
                        )
                      },

                      list: ({ children, format }) => {
                        if (format === 'ordered') {
                          return (
                            <ol
                              className="list-decimal pl-8 mb-6 space-y-2"
                              style={{ listStyleType: 'decimal' }}
                            >
                              {children}
                            </ol>
                          )
                        }

                        return (
                          <ul
                            className="list-disc pl-8 mb-6 space-y-2"
                            style={{ listStyleType: 'disc' }}
                          >
                            {children}
                          </ul>
                        )
                      },

                      'list-item': ({ children }) => (
                        <li
                          className="pl-1"
                          style={{ display: 'list-item' }}
                        >
                          {children}
                        </li>
                      ),

                      quote: ({ children }) => (
                        <blockquote
                          className="border-l-4 pl-4 my-6 italic"
                          style={{ borderColor: colors.secondary }}
                        >
                          {children}
                        </blockquote>
                      ),
                    }}
                    modifiers={{
                      bold: ({ children }) => (
                        <strong className="font-bold">{children}</strong>
                      ),

                      italic: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),

                      underline: ({ children }) => (
                        <span className="underline">{children}</span>
                      ),

                      strikethrough: ({ children }) => (
                        <span className="line-through">{children}</span>
                      ),
                    }}
                  />
                ) : (
                  <p>{getArticleText(selectedArticle)}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}