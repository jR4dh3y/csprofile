# CS2 Profile

Minimal CS2 profile page. SvelteKit + TypeScript + Tailwind.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Configuration

Edit `src/lib/config.ts` to customize:
- Page title, roles, footer
- Stats fallback values & crosshair
- Weapon loadout, categories
- UI text & colors

API keys go in `.env`:
- `STEAM_API_KEY` / `STEAM_ID`
- `LEETIFY_API_KEY` (optional)
- `ALLSTAR_API_KEY` (optional)

## Build

```bash
npm run build
```
