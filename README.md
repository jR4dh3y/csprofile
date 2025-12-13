# CS2 Profile

Minimal Counter-Strike 2 gaming profile page built with SvelteKit, TypeScript, and Tailwind CSS.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

3. Add your API keys:
   - `STEAM_API_KEY` - Get from [Steam Web API](https://steamcommunity.com/dev/apikey)
   - `STEAM_ID` - Your Steam64 ID
   - `LEETIFY_API_KEY` - Optional, from Leetify
   - `ALLSTAR_API_KEY` / `ALLSTAR_PUBLIC_API_KEY` - From Allstar Partner Portal

4. Run development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── lib/
│   ├── components/     # Presentational UI components
│   ├── services/       # API clients and data fetching
│   └── types/          # TypeScript type definitions
├── routes/
│   ├── +layout.svelte  # Root layout
│   ├── +page.svelte    # Main profile page
│   └── +page.server.ts # Server-side data loading
├── app.css             # Tailwind imports
├── app.d.ts            # App type declarations
└── app.html            # HTML template
```

## Data Sources

- **Steam API**: Player identity, avatar, playtime
- **Leetify API**: Performance metrics, ratings, rank
- **Allstar API**: Highlight clips

## Build

```bash
npm run build
npm run preview
```
