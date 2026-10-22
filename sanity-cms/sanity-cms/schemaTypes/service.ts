import {defineField, defineType} from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Serviços',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
    }),
    defineField({
      name: 'order',
      title: 'Ordem',
      type: 'number',
    }),
  ],
})