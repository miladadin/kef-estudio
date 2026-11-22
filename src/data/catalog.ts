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

const placeholderWorks = (prefix: string, count: number): Work[] =>
  Array.from({ length: count }, (_, index) => ({
    slug: `${prefix}-${String(index + 1).padStart(2, '0')}`,
    title: `Obra ${String(index + 1).padStart(2, '0')}`,
    images: [],
  }))

export const collections: Collection[] = [
  { slug: 'vendimia', title: 'Vendimia', description: '', works: placeholderWorks('vendimia', 3) },
  { slug: 'andes', title: 'Andes', description: '', works: placeholderWorks('andes', 5) },
  { slug: 'musgo', title: 'Musgo', description: '', works: placeholderWorks('musgo', 3) },
  { slug: 'grafica', title: 'Gráfica', description: '', works: placeholderWorks('grafica', 1) },
]

export const lightingModels: LightingModel[] = [
  { slug: 'eter', title: 'Éter', description: 'Una pieza liviana de malla metálica que deja ver el filamento y proyecta una luz tenue y cálida.', products: [] },
  { slug: 'lampara-de-techo-gardenia', title: 'Lámpara de techo Gardenia', description: '', products: [] },
  { slug: 'lampara-de-mesa-gardenia', title: 'Lámpara de mesa Gardenia', description: '', products: [] },
  { slug: 'lampara-de-mesa-peonia', title: 'Lámpara de mesa Peonia', description: '', products: [] },
]

export const studioNote = 'Obras con identidad.'
