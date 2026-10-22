import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nome do site',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título principal',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo',
      type: 'text',
    }),
    defineField({
      name: 'ctaText',
      title: 'Texto do botão',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Telefone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
    }),
  ],
})