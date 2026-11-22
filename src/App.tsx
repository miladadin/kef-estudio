import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { collections, lightingModels, type Work } from './data/catalog'

function Header() {
  const location = useLocation()
  return (
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label="Inicio de Kef Estudio">kef<span>.</span></Link>
      <nav className="main-nav" aria-label="Navegación principal">
        <Link className={location.pathname.startsWith('/paintings') ? 'active' : ''} to="/paintings">Obras</Link>
        <Link className={location.pathname.startsWith('/lighting') ? 'active' : ''} to="/lighting">Iluminación</Link>
      </nav>
      <a className="contact-link" href="#contact">Contacto <ArrowUpRight size={13} /></a>
    </header>
  )
}

function Footer() {
  return <footer id="contact" className="site-footer"><span>KEF ESTUDIO</span><span>Obras, objetos y luz hecha a mano</span><a href="#contact">Escribinos <ArrowUpRight size={13} /></a></footer>
}

function ImageOrPlaceholder({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  return src
    ? <img className={className} src={src} alt={alt} loading="lazy" />
    : <div className={`image-placeholder ${className}`} aria-label={alt}><span>KEF ESTUDIO</span></div>
}

function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">ESTUDIO DE ARTE Y OBJETOS</p>
          <h1>Obras<br /><em>con identidad.</em></h1>
          <p className="hero-description">Piezas únicas donde conviven materia, textura, intuición y trabajo artesanal.</p>
          <div className="hero-links"><Link to="/paintings">Explorar obras <ArrowUpRight size={15} /></Link><Link to="/lighting">Ver iluminación <ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="hero-image-wrap">
          <ImageOrPlaceholder alt="Kef Estudio — fotografía del estudio" className="hero-image" />
          <span className="image-index">01 / STUDIO</span>
        </div>
        <div className="hero-side-note">BUENOS AIRES<br />DISEÑADO Y HECHO A MANO</div>
      </section>
      <section className="home-intro">
        <p className="eyebrow">EL ESTUDIO</p>
        <p className="intro-statement">Piezas que transforman los espacios y encuentran un nuevo sentido en cada mirada.</p>
        <span className="intro-arrow"><ArrowDown size={18} /></span>
      </section>
      <section className="home-categories">
        <Link to="/paintings" className="category-feature">
          <div className="category-image"><ImageOrPlaceholder alt="Colección de obras" /></div>
          <div className="category-meta"><span>01 — OBRAS</span><span>Ver colecciones <ArrowUpRight size={14} /></span></div>
          <h2>Obras</h2>
        </Link>
        <Link to="/lighting" className="category-feature category-offset">
          <div className="category-image"><ImageOrPlaceholder alt="Colección de iluminación" /></div>
          <div className="category-meta"><span>02 — ILUMINACIÓN</span><span>Ver modelos <ArrowUpRight size={14} /></span></div>
          <h2>Iluminación</h2>
        </Link>
      </section>
    </main>
  )
}

function Paintings() {
  return (
    <main className="listing-page">
      <div className="page-heading"><p className="eyebrow">01 / COLECCIÓN</p><h1>Obras<span>.</span></h1><p>Obras singulares, atravesadas por la materia y la huella de la mano.</p></div>
      <div className="collection-grid">
        {collections.map((collection, index) => (
          <Link to={`/paintings/${collection.slug}`} className="collection-card" key={collection.slug}>
            <div className="collection-cover"><ImageOrPlaceholder src={collection.cover} alt={collection.title} /><span className="collection-number">0{index + 1}</span></div>
            <div className="collection-card-meta"><h2>{collection.title}</h2><span>{collection.works.length ? `${collection.works.length} obras` : 'Colección'} <ArrowUpRight size={14} /></span></div>
            {collection.description && <p>{collection.description}</p>}
          </Link>
        ))}
      </div>
    </main>
  )
}

function WorkGallery({ work, onClose }: { work: Work; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const images = work.images.length ? work.images : work.cover ? [work.cover] : []
  const next = () => setIndex((current) => (current + 1) % images.length)
  const previous = () => setIndex((current) => (current - 1 + images.length) % images.length)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight' && images.length > 1) next()
      if (event.key === 'ArrowLeft' && images.length > 1) previous()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [images.length])

  return (
    <div className="gallery-overlay" role="dialog" aria-modal="true" aria-label={work.title} onClick={onClose}>
      <button className="gallery-close" onClick={onClose} aria-label="Cerrar galería"><X /></button>
      <div className="gallery-stage" onClick={(event) => event.stopPropagation()}>
        {images.length > 0 ? <img src={images[index]} alt={work.title} /> : <div className="gallery-empty">FOTOGRAFÍAS PRÓXIMAMENTE</div>}
        {images.length > 1 && <>
          <button className="gallery-arrow previous" onClick={previous} aria-label="Imagen anterior"><ArrowLeft /></button>
          <button className="gallery-arrow next" onClick={next} aria-label="Imagen siguiente"><ArrowRight /></button>
        </>}
      </div>
      <div className="gallery-caption"><span>{work.title}</span><span>{images.length ? `${String(index + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}` : 'KEF ESTUDIO'}</span></div>
      {images.length > 1 && <div className="gallery-thumbs">{images.map((image, i) => <button key={image} className={i === index ? 'selected' : ''} onClick={() => setIndex(i)}><img src={image} alt={`${work.title}, view ${i + 1}`} /></button>)}</div>}
    </div>
  )
}

function CollectionDetail() {
  const { slug } = useParams()
  const collection = collections.find((item) => item.slug === slug)
  const [selected, setSelected] = useState<Work | null>(null)
  if (!collection) return <NotFound />
  return (
    <main className="listing-page">
      <Link to="/paintings" className="back-link"><ArrowLeft size={14} /> Todas las colecciones</Link>
      <div className="page-heading detail-heading"><p className="eyebrow">OBRAS / {collection.title.toUpperCase()}</p><h1>{collection.title}<span>.</span></h1>{collection.description && <p>{collection.description}</p>}</div>
      {collection.works.length ? <div className="works-grid">{collection.works.map((work) => <button className="work-card" key={work.slug} onClick={() => setSelected(work)}><ImageOrPlaceholder src={work.cover} alt={work.title} /><span>{work.title}<ArrowUpRight size={14} /></span></button>)}</div> : <div className="empty-state">Las obras de esta colección se incorporarán próximamente.</div>}
      {selected && <WorkGallery work={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}

function Lighting() {
  return (
    <main className="listing-page">
      <div className="page-heading"><p className="eyebrow">02 / COLECCIÓN</p><h1>Iluminación<span>.</span></h1><p>Piezas hechas a mano para transformar la atmósfera de cada espacio.</p></div>
      {lightingModels.length ? <div className="collection-grid">{lightingModels.map((model, index) => <Link to={`/lighting/${model.slug}`} className="collection-card" key={model.slug}><div className="collection-cover"><ImageOrPlaceholder src={model.cover} alt={model.title} /><span className="collection-number">0{index + 1}</span></div><div className="collection-card-meta"><h2>{model.title}</h2><span>Ver modelo <ArrowUpRight size={14} /></span></div></Link>)}</div> : <div className="empty-state">Los modelos de iluminación se incorporarán próximamente.</div>}
    </main>
  )
}

function LightingDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const model = lightingModels.find((item) => item.slug === slug)
  const [selected, setSelected] = useState<Work | null>(null)
  if (!model) return <NotFound />
  return <main className="listing-page"><button className="back-link" onClick={() => navigate('/lighting')}><ArrowLeft size={14} /> Toda la iluminación</button><div className="page-heading detail-heading"><p className="eyebrow">ILUMINACIÓN / {model.title.toUpperCase()}</p><h1>{model.title}<span>.</span></h1><p>{model.description}</p></div>{model.products.length ? <div className="works-grid">{model.products.map((work) => <button className="work-card" key={work.slug} onClick={() => setSelected(work)}><ImageOrPlaceholder src={work.cover} alt={work.title} /><span>{work.title}<ArrowUpRight size={14} /></span></button>)}</div> : <div className="empty-state">Las fotografías de este modelo se incorporarán próximamente.</div>}{selected && <WorkGallery work={selected} onClose={() => setSelected(null)} />}</main>
}

function NotFound() {
  return <main className="listing-page"><div className="page-heading"><p className="eyebrow">404</p><h1>No encontrada<span>.</span></h1><Link to="/">Volver al inicio <ArrowUpRight size={14} /></Link></div></main>
}

export default function App() {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  return <><Header /><Routes><Route path="/" element={<Home />} /><Route path="/paintings" element={<Paintings />} /><Route path="/paintings/:slug" element={<CollectionDetail />} /><Route path="/lighting" element={<Lighting />} /><Route path="/lighting/:slug" element={<LightingDetail />} /><Route path="*" element={<NotFound />} /></Routes><Footer /></>
}