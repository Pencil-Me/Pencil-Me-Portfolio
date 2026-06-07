# Frontend — Angular Portfolio

Öffentliche Portfolio-Website: Projekte, Tech-Stack, Kunden und Kontaktformular. Kommuniziert mit der PHP REST API.

## Tech-Stack

- **Angular 21.2** (Standalone-Komponenten, Block Control Flow)
- **NgRx 21** (State Management)
- **Bootstrap 5** + ng-bootstrap
- **Font Awesome 6**
- Tests: **Karma** + Jasmine, **Playwright** (E2E)
- Format & Lint: **Prettier**, **ESLint**, **Stylelint** (SCSS)
- Analyse: **Fallow** (Dead Code, Duplikate, Health)

## Voraussetzungen

- Node.js 20+
- npm
- Für API-Anbindung lokal: Docker-Stack im Repo-Root **oder** erreichbare PHP-API
- Für E2E lokal einmalig: `npx playwright install chromium`

## Installation

```bash
npm install
```

Pre-commit-Hooks (Prettier/ESLint/Stylelint auf gestagten Dateien) liegen im **Repo-Root**:

```bash
# Im Repo-Root — einmalig nach Clone
npm install
```

## Backend-Anbindung (Umgebungen)

| Profil               | Datei                        | `API_BASE_URL`                       | Build / Start               |
| -------------------- | ---------------------------- | ------------------------------------ | --------------------------- |
| **Lokal (ng serve)** | `environment.development.ts` | `/api2`                              | `npm start`                 |
| **Docker Compose**   | `environment.docker.ts`      | `/api2`                              | `docker compose up --build` |
| **Production (Deploy-Skript)** | `environment.deploy.ts` (generiert) | aus `deploy.config.local.json` | `ng build --configuration deploy` via [deploy/](../../deploy/README.md) |
| **Production (manuell)** | `environment.production.ts` | `https://api.pencil-me.eu/index.php` | `npm run build:prod` |

`API_KEY` muss mit `API_KEY_FE` in der PHP-API übereinstimmen (lokal/Docker: `secretApiFEkey` in `php-rest-api/src/Inc/.env.dev`). **Docker-Build:** Compose-Arg `API_KEY_FE` ersetzt den Wert in `environment.docker.ts`. **Shared-Hosting:** Deploy-Skript setzt Key aus `src/Inc/.env.prod` — siehe [deploy/README.md](../../deploy/README.md).

### Shared Hosting (Production)

Empfohlen über das Repo-Deploy-Skript (setzt Keys automatisch):

```powershell
# Im Repo-Root
.\deploy\build-shared-hosting.ps1
```

Manuell: `npx ng build --configuration deploy` (nutzt generiertes `environment.deploy.ts`).

### Statische Root-Assets

Dateien in `src/assets/root/` — Favicons, Manifest, SEO:

| Im Document Root (`/`) | Beschreibung |
|-----------------------|--------------|
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` | Browser-Icons |
| `apple-touch-icon.png`, `android-chrome-*.png`, `mstile-150x150.png` | PWA / Tiles |
| `site.webmanifest`, `browserconfig.xml`, `safari-pinned-tab.svg` | Manifest / Safari |
| `robots.txt`, `sitemap.xml` | SEO |

Weitere Assets (z. B. `utilitarian-graphics.webp`) bleiben unter `/assets/root/`. Der Angular-Build kopiert die Root-Dateien zusätzlich ins Build-Root (`angular.json`); das Deploy-Skript prüft die Vollständigkeit.

`.htaccess` in `src/assets/root/` wird beim Shared-Hosting-Deploy ins Frontend-Root gelegt (HTTPS, SPA-Routing).

### Lokal entwickeln (`ng serve` :4200)

1. Im Repo-Root: `docker compose up` (mindestens `nginx`, `php_api`, `db`, `mailer`)
2. Im Frontend: `npm start`
3. API-Aufrufe: Browser → `http://localhost:4200/api2/...` → **Proxy** → `http://localhost:8080/api2/...`

Proxy-Konfiguration: `proxy.conf.json`

### Lokaler Docker-Stack (:8080)

Frontend-Image wird mit `BUILD_CONFIGURATION=docker` gebaut und nutzt relative URL `/api2` über dasselbe Nginx-Gateway.

### Production

```bash
npm run build:prod
```

Ausgabe: `dist/portfolio/browser/` — API zeigt auf die externe Prod-URL.

Vorlage für eigene Werte: `environment.example.ts`

## NPM-Scripts

| Befehl | Beschreibung |
|--------|--------------|
| `npm start` | Dev-Server [http://localhost:4200](http://localhost:4200) + API-Proxy |
| `npm run build` / `build:prod` | Production-Build |
| `npm run build:docker` | Build für lokalen Docker-Stack |
| `npm test` | Unit-Tests (Karma, interaktiv) |
| `npm run ci-test` | Tests headless mit Coverage (Schwellen in `karma.conf.js`) |
| `npm run lint` | ESLint + Stylelint |
| `npm run lint-fix` | Prettier + ESLint + Stylelint mit Auto-Fix |
| `npm run format` | Prettier auf das gesamte Projekt |
| `npm run format:check` | Prettier-Check ohne Schreiben |
| `npm run quality:ci` | CI-Pipeline: format → lint → test → build → fallow |
| `npm run fallow:ci` | Unit-Tests + Fallow-Analyse |
| `npm run e2e` | Playwright E2E (startet Dev-Server bei Bedarf) |
| `npm run e2e:ui` | Playwright mit UI |
| `npm run e2e:ci` | E2E headless (Chromium, für CI) |

## Code-Qualität

**Coverage-Schwellen** (`karma.conf.js`): Statements/Lines/Functions ≥ 90 %, Branches ≥ 74 %.

**Refactoring-Plan:** [docs/refactoring/20-angular-frontend-quality.md](../../docs/refactoring/20-angular-frontend-quality.md)

**Domain-Enums:** Kanonische Werte in [applications/shared/domain/README.md](../../shared/domain/README.md) (`portfolio-domain.json`).

**API-Modelle:** PHP-Roh-JSON in `src/app/core/models/portfolio-api.models.ts` (snake_case); View-Models in `@modules/*/…models.ts`.

**Pre-commit** (Repo-Root): Husky + lint-staged formatiert und lintet geänderte Dateien unter `applications/frontend/` automatisch vor jedem Commit.

**Fallow** (`.fallowrc.json`): Dead-Code, Duplikat- und Health-Checks; in `quality:ci` integriert.

## E2E-Tests (Playwright)

Specs unter `e2e/` — Home, Navigation, Theme, **Projekte**, **Kontakt**, **API-Fehler**. API-Aufrufe werden per Route-Mock abgefangen (`e2e/helpers/api-mocks.ts`, Fixture-Daten in `api-fixtures.ts`), kein Backend nötig.

```bash
npm run e2e        # lokal, nutzt laufenden Server falls vorhanden
npm run e2e:ci     # CI-Modus: startet ng serve, Port 4200 muss frei sein
```

Konfiguration: `playwright.config.ts`

## Projektstruktur (Auszug)

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # PHP API-Roh-Typen (portfolio-api.models.ts)
│   │   └── services/api/     # ApiClientService → environment.API_BASE_URL
│   ├── modules/
│   └── state/
├── environments/
│   ├── environment.development.ts
│   ├── environment.docker.ts
│   ├── environment.production.ts
│   ├── environment.deploy.ts       # generiert, gitignored
│   └── environment.model.ts
├── assets/
│   ├── logos/
│   └── root/                       # Favicons, robots, sitemap, .htaccess
├── proxy.conf.json
└── styles.scss
e2e/                         # Playwright E2E
playwright.config.ts
.fallowrc.json
.eslintrc.json
.prettierrc
```

## Docker

```bash
# Im Repo-Root — baut Frontend mit docker-Profil
docker compose up --build

# Nur Frontend-Image manuell
docker build --build-arg BUILD_CONFIGURATION=docker -t pm-frontend .
```

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
