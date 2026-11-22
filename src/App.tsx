import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { collections, lightingModels, type Work } from './data/catalog'

function Header() {
  const location = useLocation()
  return (
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label="Kef Estudio home">kef<span>.</span></Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link className={location.pathname.startsWith('/paintings') ? 'active' : ''} to="/paintings">Paintings</Link>
        <Link className={location.pathname.startsWith('/lighting') ? 'active' : ''} to="/lighting">Lighting</Link>
      </nav>
      <a className="contact-link" href="mailto:hola@kefestudio.com">Contact <ArrowUpRight size={13} /></a>
    </header>
  )
}

function Footer() {
  return <footer className="site-footer"><span>KEF ESTUDIO</span><span>Art, objects & handmade light</span><a href="mailto:hola@kefestudio.com">Get in touch <ArrowUpRight size={13} /></a></footer>
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
          <p className="eyebrow">ART & OBJECTS · ESTUDIO</p>
          <h1>Everyday objects,<br /><em>made with intention.</em></h1>
          <p className="hero-description">A collection of paintings and handmade lighting, shaped by material, texture and light.</p>
          <div className="hero-links"><Link to="/paintings">Explore paintings <ArrowUpRight size={15} /></Link><Link to="/lighting">Discover lighting <ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="hero-image-wrap">
          <ImageOrPlaceholder alt="Kef Estudio — studio photograph" className="hero-image" />
          <span className="image-index">01 / STUDIO</span>
        </div>
        <div className="hero-side-note">BUENOS AIRES<br />DESIGNED & MADE BY HAND</div>
      </section>
      <section className="home-intro">
        <p className="eyebrow">THE STUDIO</p>
        <p className="intro-statement">Pieces that make a space feel a little more <em>like yours.</em></p>
        <span className="intro-arrow"><ArrowDown size={18} /></span>
      </section>
      <section className="home-categories">
        <Link to="/paintings" className="category-feature">
          <div className="category-image"><ImageOrPlaceholder alt="Paintings collection" /></div>
          <div className="category-meta"><span>01 — PAINTINGS</span><span>Explore the collections <ArrowUpRight size={14} /></span></div>
          <h2>Paintings</h2>
        </Link>
        <Link to="/lighting" className="category-feature category-offset">
          <div className="category-image"><ImageOrPlaceholder alt="Handmade lighting collection" /></div>
          <div className="category-meta"><span>02 — LIGHTING</span><span>Explore the models <ArrowUpRight size={14} /></span></div>
          <h2>Lighting</h2>
        </Link>
      </section>
    </main>
  )
}

function Paintings() {
  return (
    <main className="listing-page">
      <div className="page-heading"><p className="eyebrow">01 / THE COLLECTION</p><h1>Paintings<span>.</span></h1><p>A series of works, each with its own character.</p></div>
      <div className="collection-grid">
        {collections.map((collection, index) => (
          <Link to={`/paintings/${collection.slug}`} className="collection-card" key={collection.slug}>
            <div className="collection-cover"><ImageOrPlaceholder src={collection.cover} alt={collection.title} /><span className="collection-number">0{index + 1}</span></div>
            <div className="collection-card-meta"><h2>{collection.title}</h2><span>{collection.works.length ? `${collection.works.length} works` : 'Collection'} <ArrowUpRight size={14} /></span></div>
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
      <button className="gallery-close" onClick={onClose} aria-label="Close gallery"><X /></button>
      <div className="gallery-stage" onClick={(event) => event.stopPropagation()}>
        {images.length > 0 ? <img src={images[index]} alt={work.title} /> : <div className="gallery-empty">PHOTOGRAPHS COMING SOON</div>}
        {images.length > 1 && <>
          <button className="gallery-arrow previous" onClick={previous} aria-label="Previous image"><ArrowLeft /></button>
          <button className="gallery-arrow next" onClick={next} aria-label="Next image"><ArrowRight /></button>
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
      <Link to="/paintings" className="back-link"><ArrowLeft size={14} /> All collections</Link>
      <div className="page-heading detail-heading"><p className="eyebrow">PAINTINGS / {collection.title.toUpperCase()}</p><h1>{collection.title}<span>.</span></h1>{collection.description && <p>{collection.description}</p>}</div>
      {collection.works.length ? <div className="works-grid">{collection.works.map((work) => <button className="work-card" key={work.slug} onClick={() => setSelected(work)}><ImageOrPlaceholder src={work.cover} alt={work.title} /><span>{work.title}<ArrowUpRight size={14} /></span></button>)}</div> : <div className="empty-state">Works from this collection will be added soon.</div>}
      {selected && <WorkGallery work={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}

function Lighting() {
  return (
    <main className="listing-page">
      <div className="page-heading"><p className="eyebrow">02 / THE COLLECTION</p><h1>Lighting<span>.</span></h1><p>Handmade pieces that transform the atmosphere of a room.</p></div>
      {lightingModels.length ? <div className="collection-grid">{lightingModels.map((model, index) => <Link to={`/lighting/${model.slug}`} className="collection-card" key={model.slug}><div className="collection-cover"><ImageOrPlaceholder src={model.cover} alt={model.title} /><span className="collection-number">0{index + 1}</span></div><div className="collection-card-meta"><h2>{model.title}</h2><span>View model <ArrowUpRight size={14} /></span></div></Link>)}</div> : <div className="empty-state">Lighting models will be added soon.</div>}
    </main>
  )
}

function LightingDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const model = lightingModels.find((item) => item.slug === slug)
  const [selected, setSelected] = useState<Work | null>(null)
  if (!model) return <NotFound />
  return <main className="listing-page"><button className="back-link" onClick={() => navigate('/lighting')}><ArrowLeft size={14} /> All lighting</button><div className="page-heading detail-heading"><p className="eyebrow">LIGHTING / {model.title.toUpperCase()}</p><h1>{model.title}<span>.</span></h1><p>{model.description}</p></div>{model.products.length ? <div className="works-grid">{model.products.map((work) => <button className="work-card" key={work.slug} onClick={() => setSelected(work)}><ImageOrPlaceholder src={work.cover} alt={work.title} /><span>{work.title}<ArrowUpRight size={14} /></span></button>)}</div> : <div className="empty-state">Product photographs will be added soon.</div>}{selected && <WorkGallery work={selected} onClose={() => setSelected(null)} />}</main>
}

function NotFound() {
  return <main className="listing-page"><div className="page-heading"><p className="eyebrow">404</p><h1>Not found<span>.</span></h1><Link to="/">Return home <ArrowUpRight size={14} /></Link></div></main>
}

export default function App() {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  return <><Header /><Routes><Route path="/" element={<Home />} /><Route path="/paintings" element={<Paintings />} /><Route path="/paintings/:slug" element={<CollectionDetail />} /><Route path="/lighting" element={<Lighting />} /><Route path="/lighting/:slug" element={<LightingDetail />} /><Route path="*" element={<NotFound />} /></Routes><Footer /></>
}