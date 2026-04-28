'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Calendar, ArrowRight, FileText, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useEffect, useState } from 'react'
import { sanityClient } from '../../lib/sanity'

type SanityBlock = {
  _type: string
  children?: {
    text: string
  }[]
  title?: string
  url?: string
}

type BlogPost = {
  _id: string
  title: string
  excerpt?: string
  publishedAt?: string
  readTime?: string
  category?: string
  slug?: {
    current: string
  }
  content?: SanityBlock[]
}

export function BlogSection() {
  const { colors } = useTheme()
  const [articles, setArticles] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null)

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await sanityClient.fetch(`
          *[_type == "blogPost"]
          | order(publishedAt desc){
            _id,
            title,
            excerpt,
            publishedAt,
            readTime,
            category,
            slug,
            content
          }
        `)

        console.log('POSTS SANITY:', data)
        setArticles(data)
      } catch (error) {
        console.error('Erro ao buscar posts do Sanity:', error)
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

  function getFirstVideo(article: BlogPost) {
    return article.content?.find((item) => item._type === 'video' && item.url)
  }

  function getVideoEmbedUrl(url?: string) {
    if (!url) return ''

    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    return url
  }

  function renderContent(content?: SanityBlock[]) {
    if (!content || content.length === 0) {
      return (
        <p style={{ color: colors.textLight }}>
          Conteúdo completo ainda não disponível.
        </p>
      )
    }

    return content.map((block, index) => {
      if (block._type === 'video') {
        return (
          <div key={index} className="my-6">
            {block.title && (
              <h4
                className="text-xl font-bold mb-3"
                style={{ color: colors.primary }}
              >
                {block.title}
              </h4>
            )}

            <iframe
              src={getVideoEmbedUrl(block.url)}
              className="w-full aspect-video rounded-2xl"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )
      }

      if (block._type === 'block') {
        const text = block.children?.map((child) => child.text).join('')

        return (
          <p
            key={index}
            className="mb-4 leading-relaxed"
            style={{ color: colors.textLight }}
          >
            {text}
          </p>
        )
      }

      return null
    })
  }

  return (
    <section id="conteudos" className="py-20" style={{ backgroundColor: colors.background }}>
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
            <span className="text-sm font-semibold" style={{ color: colors.secondary }}>
              Blog Jurídico
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.primary }}>
            Conteúdos Educativos
          </h2>

          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textLight }}>
            Artigos especializados sobre propriedade intelectual, direitos autorais e proteção de marcas
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
            {articles.map((article, index) => {
              const video = getFirstVideo(article)

              return (
                <motion.article
                  key={article._id}
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
                  {video?.url && (
                    <div className="w-full aspect-video bg-black">
                      <iframe
                        src={getVideoEmbedUrl(video.url)}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )}

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

                    <p className="mb-4 line-clamp-3" style={{ color: colors.textLight }}>
                      {article.excerpt || 'Sem resumo disponível.'}
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
              )
            })}
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

                  <p className="mt-3 text-sm" style={{ color: colors.textLight }}>
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

              {selectedArticle.excerpt && (
                <p
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: colors.textLight }}
                >
                  {selectedArticle.excerpt}
                </p>
              )}

              <div>{renderContent(selectedArticle.content)}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}