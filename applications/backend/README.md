# Backend — Vue Admin-UI

Interne Verwaltungsoberfläche für Projekte, Kunden und Tech-Stack-Einträge. Spricht mit der Python Flask API unter `/api` (Backend-Key).

## Tech-Stack

- **Vue 3.4** + **TypeScript**
- **Vite 5** (Build & Dev-Server)
- **Vue Router 4** + **Pinia 2**
- **Tailwind CSS**
- Tests: **Vitest** (Unit), **Cypress** (E2E)

Dev-Server: Port **8081** · Preview/E2E: Port **4173**

## Voraussetzungen

- Node.js 20+
- npm
- Laufende API (Python oder alternativ PHP) und MySQL

## Installation

```bash
npm install
```

## Umgebung konfigurieren

Vorlage: `.env.example` → `.env.production` (bzw. `.env.local` für Vite)

```env
VITE_API_URL=http://localhost:8080/api
VITE_API_KEY=dein-be-key
```

`VITE_API_KEY` muss dem `be_key` der API entsprechen. Der Header heißt `API-Key`.

## NPM-Scripts

| Befehl | Beschreibung |
|--------|--------------|
| `npm run dev` | Dev-Server mit Hot-Reload |
| `npm run build` | Production-Build |
| `npm run preview` | Vorschau des Production-Builds |
| `npm run test:unit:ci` | Vitest (CI, non-watch) |
| `npm run test:e2e:dev` | Cypress interaktiv (Preview-Port 4173, Base `/backend/`) |
| `npm run test:e2e` | Cypress gegen Production-Build |
| `npm run test:e2e:ci` | Build + Cypress headless — Drone `vue-admin-e2e` |
| `npm run quality:ci` | ESLint (`src/`) + vue-tsc + Vitest — Drone `vue-admin-quality` |
| `npm run lint` | ESLint (gesamtes Projekt) |
| `npm run type-check` | vue-tsc Typprüfung |

## Funktionsumfang

- **Projekte:** Anlegen, Bearbeiten, Löschen, Auflistung
- **Kunden:** CRUD mit Standort
- **Tech-Stack:** Einträge und Typen verwalten

Services unter `src/services/` kapseln die API-Aufrufe (`projects.service.ts`, `customer.service.ts`, `techstack.service.ts`).

## Docker

Build-Args (Compose setzt Defaults aus Root-`.env`):

| Arg | Default (Compose) |
|-----|-------------------|
| `VITE_API_URL` | `http://localhost:8080/api` |
| `VITE_API_KEY` | Wert aus `API_KEY_BE` |

```bash
docker build -t pm-backend \
  --build-arg VITE_API_URL=http://localhost:8080/api \
  --build-arg VITE_API_KEY=secretApiBEkey \
  applications/backend
```

Im Compose-Stack erreichbar unter [http://localhost:8080/backend](http://localhost:8080/backend).

## IDE-Empfehlung

VS Code mit [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur deaktivieren).

## Refactoring & Architektur

| Dokument | Inhalt |
|----------|--------|
| [docs/refactoring/08-vue-admin-architecture.md](../../docs/refactoring/08-vue-admin-architecture.md) | Architektur-Review, Schichten |
| [docs/refactoring/09-vue-admin-bugs.md](../../docs/refactoring/09-vue-admin-bugs.md) | P1-Bugfixes (Masks, v-model) |
| [docs/refactoring/10-vue-admin-quality.md](../../docs/refactoring/10-vue-admin-quality.md) | Legacy, CI, Pinia |
| [docs/refactoring/11-vue-admin-followup.md](../../docs/refactoring/11-vue-admin-followup.md) | Phase 2 — Übersicht & Roadmap |
| [docs/refactoring/12-vue-admin-consistency.md](../../docs/refactoring/12-vue-admin-consistency.md) | Validierung, UI, Send-Mapper |
| [docs/refactoring/13-vue-admin-architecture-dry.md](../../docs/refactoring/13-vue-admin-architecture-dry.md) | DRY, Display-Typen |
| [docs/refactoring/14-vue-admin-modernization.md](../../docs/refactoring/14-vue-admin-modernization.md) | script setup, Aufräumen |
| [docs/refactoring/15-vue-admin-testing.md](../../docs/refactoring/15-vue-admin-testing.md) | Tests & E2E |
| [src/pinia/ARCHITECTURE.md](src/pinia/ARCHITECTURE.md) | Pinia-Stores, Datenfluss |

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
