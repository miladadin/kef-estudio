export type Work = {
  slug: string
  title: string
  subtitle?: string
  cover?: string
  images: string[]
  year?: string
  dimensions?: string
  materials?: string
}

export type Collection = {
  slug: string
  title: string
  description?: string
  cover?: string
  works: Work[]
}

export type LightingModel = {
  slug: string
  title: string
  description?: string
  cover?: string
  details?: string
  products: Work[]
}

/**
 * Catalog content lives here, independently from the visual components.
 * Add image files to public/images and reference them from this file, e.g.
 * cover: '/images/paintings/work-name/cover.jpg'
 */
export const collections: Collection[] = [
  {
    slug: 'vendimia',
    title: 'Vendimia',
    description: '',
    works: [],
  },
  {
    slug: 'musgo',
    title: 'Musgo',
    description: '',
    works: [],
  },
]

export const lightingModels: LightingModel[] = []

export const studioNote = 'Objects, light and pieces made by hand.'
