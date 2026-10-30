# Dashboard frontend

React + TypeScript + Vite with Tailwind CSS v4 via the Vite plugin.

## Run locally

Use Node.js 22 or later.

```sh
cd frontend
npm install
npm run dev
```

## Check and build

```sh
npm run typecheck
npm run build
npm run preview
```

A dependency lockfile is not included in this initial scaffold. Generate and commit package-lock.json after the first successful installation; then use npm ci for repeatable installs. Dependency installation, compilation and browser behaviour have not been verified in the authoring environment.

## Included

- Responsive dark sidebar/header and Tailwind layout.
- Overview with counts, board distribution and attention list.
- Five-column Kanban preview with accessible status selectors.
- Jobs table and staff assignment cards.
- Search and project filters for data views.
- Imports placeholder describing unimplemented connections.
- DD/MM/YYYY display dates and deterministic demo reference date.

All records are fictional sample data in src/data.ts. Status edits are in-memory only and reset on refresh. They do not modify schedule progress. Drag-and-drop, authentication, backend requests, real file imports and persistence are not implemented.

## Hosting later

For Cloudflare Pages, use frontend as the root directory, npm run build as the build command, and dist as the output directory. No deployment or CI workflow is included in this commit. All sections currently use local component state, not URL routes. Do not publish real business records until authentication and API authorisation are implemented. Never place service-role keys or Microsoft credentials in frontend files or VITE_* variables.
