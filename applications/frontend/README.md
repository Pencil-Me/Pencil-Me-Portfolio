# Frontend — Angular Portfolio

Öffentliche Portfolio-Website: Projekte, Tech-Stack, Kunden und Kontaktformular. Kommuniziert mit der PHP REST API.

## Tech-Stack

- **Angular 21.2** (Standalone-Komponenten, Block Control Flow)
- **NgRx 21** (State Management)
- **Bootstrap 5** + ng-bootstrap
- **Font Awesome 6**
- Tests: **Karma** + Jasmine
- Lint: **ESLint** + **Stylelint** (SCSS)

## Voraussetzungen

- Node.js 20+
- npm
- Für API-Anbindung lokal: Docker-Stack im Repo-Root **oder** erreichbare PHP-API

## Installation

```bash
npm install
```

## Backend-Anbindung (Umgebungen)

| Profil               | Datei                        | `API_BASE_URL`                       | Build / Start               |
| -------------------- | ---------------------------- | ------------------------------------ | --------------------------- |
| **Lokal (ng serve)** | `environment.development.ts` | `/api2`                              | `npm start`                 |
| **Docker Compose**   | `environment.docker.ts`      | `/api2`                              | `docker compose up --build` |
| **Production**       | `environment.production.ts`  | `https://api.pencil-me.eu/index.php` | `npm run build:prod`        |

`API_KEY` muss mit `API_KEY_FE` in der PHP-API übereinstimmen (lokal: `apikey123` in `.env.dev`).

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

| Befehl                         | Beschreibung                                                          |
| ------------------------------ | --------------------------------------------------------------------- |
| `npm start`                    | Dev-Server [http://localhost:4200](http://localhost:4200) + API-Proxy |
| `npm run build` / `build:prod` | Production-Build                                                      |
| `npm run build:docker`         | Build für lokalen Docker-Stack                                        |
| `npm test`                     | Unit-Tests (Karma, interaktiv)                                        |
| `npm run ci-test`              | Tests headless mit Coverage (CI)                                      |
| `npm run lint`                 | ESLint + Stylelint                                                    |
| `npm run lint-fix`             | Lint mit Auto-Fix                                                     |

## Projektstruktur (Auszug)

```
src/
├── app/
│   ├── core/services/api/   # ApiClientService → environment.API_BASE_URL
│   ├── modules/
│   └── state/
├── environments/
│   ├── environment.development.ts
│   ├── environment.docker.ts
│   ├── environment.production.ts
│   └── environment.model.ts
├── proxy.conf.json
└── styles.scss
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
