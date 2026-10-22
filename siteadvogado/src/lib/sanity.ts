import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'l3ochegr',
  dataset: 'production',
  apiVersion: '2026-04-12',
  useCdn: true,
  perspective: 'published',
})