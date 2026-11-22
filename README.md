# Kef Estudio

Editorial portfolio for paintings and handmade lighting.

## Stack
- React + TypeScript
- Vite
- React Router
- Static build for Cloudflare Pages

## Local development
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

Cloudflare Pages settings:
- Build command: `npm run build`
- Build output directory: `dist`

## Catalog content
Edit `src/data/catalog.ts` to add collections, works, lighting models and image paths.

Place image files in `public/images/`. Example:
`public/images/paintings/vendimia/work-name/cover.jpg`

The current catalog entries are structural placeholders. No product photographs have been fabricated or substituted.

## Deployment
Production deployments are triggered automatically by pushes to `main`.
