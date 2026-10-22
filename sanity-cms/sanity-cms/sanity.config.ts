import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Sanity CMS',
  projectId: 'l3ochegr',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})