import { defineField, defineType } from 'sanity'

export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo',
      type: 'text',
    }),

    defineField({
      name: 'content',
      title: 'Conteúdo',
      type: 'array',
      of: [
        { type: 'block' },

        defineField({
          name: 'video',
          title: 'Vídeo',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Título do vídeo',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL do vídeo',
              type: 'url',
              description: 'Cole aqui o link do YouTube, Vimeo ou outro vídeo',
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'publishedAt',
      title: 'Publicado em',
      type: 'datetime',
    }),
    defineField({
      name: 'isEducational',
      title: 'É conteúdo educativo?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})