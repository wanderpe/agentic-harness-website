# Agentic Harness website

Next.js App Router website with a static export for Vercel hosting.

## Develop

Run `npm ci`, then `npm run dev`. Open http://localhost:3000.

Edit TypeScript pages in `app/`. The guide is in `app/guide/Guide.tsx`, with its typed conversation controller in `app/guide/interaction.ts`. Styles and ZIP downloads live in `public/assets/` and `public/downloads/`.

## Quality checks

Run `npm run lint` (zero warnings), `npm run typecheck` (strict TypeScript), and `npm run build` (production static export). `npm run verify` runs all three in order.

## Deploy to Vercel

Import the repository into Vercel and select this folder as the Root Directory (the folder containing `package.json`). The included `vercel.json` selects the Other framework preset, runs `npm run verify`, and serves the static `out/` directory. No environment variables are required. Keep `package-lock.json` in Git for reproducible installs.

This project uses static export. Features requiring a server, such as server actions or request-time rendering, would require changing that hosting choice.

## Build output

Run `npm run build`; the generated website is in `out/`. The Vercel configuration builds and serves this static output.
