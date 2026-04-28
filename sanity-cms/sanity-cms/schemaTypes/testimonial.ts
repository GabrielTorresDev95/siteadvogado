import {defineField, defineType} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Depoimentos',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Cargo ou relação',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Depoimento',
      type: 'text',
    }),
    defineField({
      name: 'order',
      title: 'Ordem',
      type: 'number',
    }),
  ],
})