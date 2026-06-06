# Backend — Vue Admin-UI

Interne Verwaltungsoberfläche für Projekte, Kunden und Tech-Stack-Einträge. Spricht mit der Python Flask API unter `/api` (Backend-Key).

## Tech-Stack

- **Vue 3.4** + **TypeScript**
- **Vite 5** (Build & Dev-Server)
- **Vue Router 4** + **Vuex 4**
- **Tailwind CSS** + tw-elements
- Tests: **Vitest** (Unit), **Cypress** (E2E)

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
| `npm run test:unit` | Vitest Unit-Tests |
| `npm run test:e2e:dev` | Cypress interaktiv gegen Dev-Server |
| `npm run test:e2e` | Cypress gegen Production-Build |
| `npm run lint` | ESLint |
| `npm run type-check` | vue-tsc Typprüfung |

## Funktionsumfang

- **Projekte:** Anlegen, Bearbeiten, Löschen, Auflistung
- **Kunden:** CRUD mit Standort
- **Tech-Stack:** Einträge und Typen verwalten

Services unter `src/services/` kapseln die API-Aufrufe (`projects.service.ts`, `customer.service.ts`, `techstack.service.ts`).

## Docker

```bash
docker build -t pm-backend .
```

Im Compose-Stack erreichbar unter [http://localhost:8080/backend](http://localhost:8080/backend).

## IDE-Empfehlung

VS Code mit [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur deaktivieren).

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
