# TaxFlow Colombia - Taxes Calculator

TaxFlow is a React + TypeScript web app to simulate key Colombia 2026 tax scenarios in one place.  
It helps users compare scenarios quickly, visualize impact, and save local simulation history without a backend.

> [!IMPORTANT]
> This simulator is informational and educational. It does not replace professional tax or legal advice. Validate final numbers with an accountant or tax advisor before filing.

## What The App Includes

### Tax simulation modules

- Withholding tax 2026 (advanced taxable-base cleanup + UVT-based estimate)
- Withholding procedure comparison (Procedure 1 vs Procedure 2)
- Vehicle consumption tax simulation (8% or 19% tariff scenarios)
- Wealth tax simulation (starting from 72,000 UVT threshold)
- Service export scenario (foreign withholding offset estimate)
- E-invoice deduction simulation (5% deduction effect)
- Social security for independent workers (IBC 40%, health, pension, ARL by risk class)

### Product capabilities

- Dashboard summary cards for base, tax, social/security line, and net result
- Donut/bar charts for distribution and high-level comparison
- Scenario results panel with assumptions and metrics
- Scenario name + save to local history (restore/delete)
- Export actions:
  - Print-based PDF export
  - JSON export for simulation payloads
- Dark/light theme toggle
- PWA-ready setup (service worker + web app manifest)
- Spanish-first UX copy (`es-CO` labels and date formatting)

## Architecture

The app is client-side and organized by responsibility:

- UI composition in `src/app` and `src/components`
- Tax formulas and simulation domain logic in `src/domain/tax`
- Browser persistence (history) in `src/services/storage`
- Localization copy in `src/i18n`
- Shared helpers in `src/utils`
- Global styling in `src/styles`

### Runtime flow

1. `src/main.tsx` mounts the app and registers the PWA service worker.
2. `src/app/App.tsx` owns global UI state (active module, theme, history, exports).
3. `src/domain/tax/calculators.ts` resolves each module's formula and returns normalized results.
4. UI components render summaries, charts, calculator inputs, and result panels.
5. Saved scenarios are persisted in `localStorage` through `src/services/storage/simulation-storage.ts`.

### Folder map

```txt
src/
  app/                  # App shell and page composition
  components/           # Feature/UI components (calculator, dashboard, layout, results, ui)
  domain/tax/           # Tax constants, calculator definitions, and formula resolvers
  services/storage/     # localStorage simulation persistence
  i18n/                 # Spanish UI dictionary and formatters
  utils/                # Shared utility functions
  styles/               # Global CSS
```

## Tech Stack

- React 19 + TypeScript 6
- Vite 8
- Tailwind CSS 4
- Vitest + Testing Library
- Oxlint + Oxfmt
- Recharts
- Radix UI primitives
- Vite PWA plugin + Workbox window

## Getting Started

### Prerequisites

- Node.js `25` (recommended to match CI)
- `pnpm` `10`

### Install and run

```bash
pnpm install
pnpm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## Scripts

- `pnpm run dev` - Start local dev server
- `pnpm run build` - Type-check and create production build
- `pnpm run preview` - Preview the production build locally
- `pnpm run test` - Run tests once (CI mode)
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run lint` - Run Oxlint
- `pnpm run lint:fix` - Run Oxlint with auto-fix
- `pnpm run fmt` - Format code with Oxfmt
- `pnpm run fmt:check` - Verify formatting without changing files

## Quality Gates (CI)

GitHub Actions runs on pushes and pull requests to `main` with this pipeline:

1. `pnpm run lint`
2. `pnpm run fmt:check`
3. `pnpm run test`
4. `pnpm run build`

To avoid CI failures, run the same commands locally before opening a PR.

## Open Source Contributing

Contributions are welcome. For smooth reviews:

1. Fork the repo and create a branch from `main`.
2. Keep changes focused and small.
3. Run local checks:
   ```bash
   pnpm run lint
   pnpm run fmt:check
   pnpm run test
   pnpm run build
   ```
4. Open a pull request with:
   - clear problem statement
   - concise change summary
   - test notes (what you ran and results)

### Review ownership

Code ownership is defined in `.github/CODEOWNERS` and currently points all paths to `@mateobetancurb`.

## Current Behavior Notes

- PDF export uses browser printing (`window.print()`), not server-side PDF generation.
- Simulation history is local-only (`localStorage`) and capped to 25 items.
- Some select fields are present for future behavior and currently do not affect formulas (documented in the calculator domain).
- The app is fully frontend; it does not persist data to a remote database.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
