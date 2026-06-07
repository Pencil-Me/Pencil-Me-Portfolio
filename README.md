# Pencil-Me-Portfolio

Monorepo für die Portfolio-Website von **Pencil&Me**: öffentliches Frontend, Admin-Backend und mehrere API-Schichten hinter einem zentralen Nginx-Gateway.

## Architektur

```
Browser
   │
   ▼
pm-middlenginx (:8080)
   ├── /              → Angular-Frontend (öffentliche Portfolio-Seite)
   ├── /backend       → Vue-Admin-UI (Projekte, Kunden, Tech-Stack)
   ├── /api2          → PHP REST API (Read + Mail-Proxy)
   ├── /api           → Python Flask API (Admin-CRUD)
   └── (mailer)       → PHP Mailer — nur Docker-intern, kein Gateway-Pfad
                              │
                              ▼
                         MySQL (portfolio_db)
```

| Service | Container | Port (Host) | Technologie |
|---------|-----------|-------------|-------------|
| Frontend | `pm-frontend_angular` | via Nginx | Angular 21, NgRx, Bootstrap |
| Backend-UI | `pm-backend_vue` | via Nginx `/backend` | Vue 3, Vite, Vuex |
| Gateway | `pm-middlenginx` | **8080** | Nginx |
| PHP REST API | `pm-api_php` | 3003 (Dev) / `/api2` | PHP 8.3, Apache |
| Python API | `pm-api_python` | via Nginx `/api` | Flask, PyMySQL |
| Mailer | `pm-mailer_php` | 3002 (Dev) / intern | Docker DNS (REST → Mailer) |
| Datenbank | `pm-db` | 3306 | MySQL 8 |
| phpMyAdmin | `pm-phpmyadmin` | 8000 (nur mit `--profile dev`) | Web-UI für MySQL |

## Schnellstart (Docker)

Voraussetzungen: [Docker](https://www.docker.com/) und Docker Compose.

```bash
# Im Repo-Root
cp .env.example .env          # optional: zentrale Compose-Variablen
docker compose up --build

# phpMyAdmin (nur Dev):
docker compose --profile dev up phpmyadmin
```

Danach erreichbar:

- Portfolio: [http://localhost:8080](http://localhost:8080)
- Admin-UI: [http://localhost:8080/backend](http://localhost:8080/backend)
- phpMyAdmin: [http://localhost:8000](http://localhost:8000) (nur mit `docker compose --profile dev up phpmyadmin`)

Vor dem ersten Start die Umgebungsvariablen konfigurieren (siehe unten). API-Keys müssen zwischen Frontend, Backend und APIs übereinstimmen.

## Lokale Entwicklung (ohne Docker)

Jede Anwendung kann einzeln gestartet werden. Typischer Ablauf:

1. MySQL starten (`applications/db`) oder Docker nur für `db` + `phpmyadmin`
2. PHP REST API und Mailer konfigurieren und starten
3. **Optional (Pre-commit-Hooks):** im Repo-Root `npm install` — aktiviert Husky + lint-staged für Angular-Frontend **und** Vue-Admin (`applications/backend/src/`)
4. Angular-Frontend: `cd applications/frontend && npm install && npm start` → [http://localhost:4200](http://localhost:4200)
5. Vue-Backend: `cd applications/backend && npm install && npm run dev`

**Frontend ↔ API:**

| Modus | Frontend | API-Ziel |
|-------|----------|----------|
| `npm start` (ng serve) | [localhost:4200](http://localhost:4200) | `/api2` via Proxy → Nginx :8080 |
| `docker compose up` | [localhost:8080](http://localhost:8080) | `/api2` (gleiche Origin) |
| Production-Build | pencil-me.de | `https://api.pencil-me.eu/index.php` |

Details: [applications/frontend/README.md](applications/frontend/README.md)

## Anwendungen

| Pfad | Beschreibung | README |
|------|--------------|--------|
| `applications/frontend` | Öffentliche Portfolio-Website (Angular 21) | [README](applications/frontend/README.md) |
| `applications/backend` | Admin-Oberfläche für CRUD-Operationen (Vue 3) | [README](applications/backend/README.md) |
| `applications/php-rest-api` | REST-Gateway für Frontend-Endpunkte | [README](applications/php-rest-api/README.md) |
| `applications/php-mailer-api` | E-Mail-Versand für Kontaktformular | [README](applications/php-mailer-api/README.md) |
| `applications/python-rest-api` | Alternative Flask-API (v. a. Backend-CRUD) | [README](applications/python-rest-api/README.md) |
| `applications/db` | MySQL-Schema und Seed-Daten | [README](applications/db/README.md) |
| `deploy/` | Shared-Hosting-Build (FTP + PHP) | [README](deploy/README.md) |
| `scripts/security/` | Security-Smoke-Tests (Auth, CORS) | siehe unten |

## Konfiguration

Zentrale Dateien:

| Datei | Zweck |
|-------|-------|
| `.env.example` | Master-Liste aller Compose-/Build-Variablen |
| `docker-compose.yml` | Orchestrierung aller Services |
| `docker-compose.override.yml.example` | Dev-Mounts für PHP (→ `docker-compose.override.yml`, gitignored) |
| `docker-compose.prod.yml.example` | Production: `APP_ENV`, Basic Auth Admin, keine Host-Ports DB/PHP |
| `nginx.middle.conf` | Dev-Gateway: Routing, gzip, Rate-Limit, Security-Headers |
| `nginx.prod.conf.example` | Prod-Gateway: + Basic Auth `/backend/` |

Optional: `cp .env.example .env` und `docker compose --env-file .env up`.

### Keys synchron halten

Dieselben Werte an mehreren Stellen pflegen:

| Variable | Wo setzen |
|----------|-----------|
| `API_KEY_FE` | Root `.env`, `php-rest-api/src/Inc/.env.dev`, `php-mailer-api/src/Inc/.env.dev`, Angular `environment.ts` |
| `API_KEY_BE` | Root `.env`, `python-rest-api` (Compose-Env), Vue `.env` / Compose `VITE_API_KEY`, **`php-mailer-api`** (`API_KEY_BE` auf `/send_email`) |
| `MAIL_API_KEY` | `php-rest-api/src/Inc/.env.dev` — muss **`API_KEY_BE`** entsprechen (REST → Mailer) |
| `DB_*` | Root `.env`, Compose (Python), PHP `.env.dev` falls direkter DB-Zugriff |
| `MAIL_*` | Root `.env`, Compose (Python), `php-mailer-api/src/Inc/.env.dev` |
| `APP_ENV` | Root `.env`, Compose (`php_api`, `php_mailer`, `python_api`) |
| `ALLOWED_ORIGINS` | Root `.env`, Compose (`python_api`) — CORS-Whitelist für Admin-API |

API-Authentifizierung erfolgt über den Header `API-Key` (Frontend: `fe_key`, Backend: `be_key`).

Der **Mailer** ist absichtlich nicht über Nginx erreichbar — nur `pm-api_php` ruft `pm-mailer_php` per Docker-DNS auf. Der `fe_key` im Angular-Bundle ist für Read-only-Zugriff akzeptiert; in Production eigene Keys setzen und bei Bedarf rotieren (siehe Doc 23).

Security: [22-security-audit.md](docs/refactoring/22-security-audit.md) · [23-security-remediation.md](docs/refactoring/23-security-remediation.md)

### Production (zwei Wege)

#### A) Shared Hosting (FTP + PHP) — öffentliche Website

Nur **Frontend**, **PHP REST API** und **Mailer** — ohne Docker, Python oder Vue-Admin.

→ [deploy/README.md](deploy/README.md) · `.\deploy\build-shared-hosting.ps1` · `.\deploy\clean.ps1`

#### B) Docker-Stack (Homelab / Full Stack)

- `docker-compose.prod.yml.example` kopieren nach `docker-compose.prod.yml` und anpassen
- Start: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
- TLS am externen Reverse-Proxy (nicht im Repo-Stack)
- phpMyAdmin nicht starten (kein `--profile dev`)
- `nginx.prod.conf.example` + `secrets/nginx.htpasswd` für Admin Basic Auth
- Nur Nginx-Port 8080 nach außen (DB/PHP-APIs ohne Host-Mapping in Prod-Override)

### Security-Smoke-Tests (Docker-Stack)

```powershell
# Stack auf :8080 muss laufen
.\scripts\security\smoke-auth.ps1
```

Prüft Auth (401), CORS-Whitelist, Mailer nicht öffentlich, Honeypot. Siehe [23-security-remediation.md](docs/refactoring/23-security-remediation.md).

## CI / Qualitätssicherung

Die Drone-Pipeline (`.drone.yml`) prüft Frontend und Backend-Services:

| Step | Befehl | Inhalt |
|------|--------|--------|
| `frontend-quality` | `npm run quality:ci` | Prettier, ESLint, Stylelint, Unit-Tests + Coverage, Production-Build, Fallow |
| `frontend-e2e` | `npm run e2e:ci` | Playwright E2E |
| `php-rest-api-test` | `composer test` + `composer audit` | PHPUnit, PHPStan |
| `php-mailer-api-test` | `composer test` + `composer audit` | PHPUnit, PHPStan |
| `vue-admin-quality` | `npm run quality:ci` + `npm audit` | ESLint, vue-tsc, Vitest |
| `vue-admin-e2e` | `npm run test:e2e:ci` | Cypress E2E |
| `python-api-smoke` | ruff + mypy + pytest + `pip-audit` | Python Admin API |
| `openapi-lint` | `npm run openapi:lint` | Spectral |
| `compose-config` | `docker compose config` | Compose-Syntax-Check |
| `secret-scan` | gitleaks | Secrets im Repo (Allowlist für Dev-Beispielkeys) |

Lokal dieselbe Qualitäts-Pipeline:

```bash
# Angular Frontend
cd applications/frontend
npm run quality:ci   # ohne E2E
npm run e2e:ci       # E2E separat (Port 4200 muss frei sein)

# PHP REST API
cd applications/php-rest-api && composer test

# PHP Mailer
cd applications/php-mailer-api && composer test

# Vue Admin
cd applications/backend && npm run quality:ci
cd applications/backend && npm run test:e2e:ci

# OpenAPI (Spectral)
npm run openapi:lint

# Python API
cd applications/python-rest-api/source_code && pytest -q
```

Details zu Scripts, Coverage-Schwellen und Pre-commit-Hooks: [applications/frontend/README.md](applications/frontend/README.md)

## Backend-Refactoring

Geplanter Verbesserungsplan für PHP-/Python-APIs, Vue-Admin und Docker: [docs/refactoring/README.md](docs/refactoring/README.md)

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
