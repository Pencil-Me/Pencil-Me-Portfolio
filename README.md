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
   ├── /api2          → PHP REST API (Produktions-API fürs Frontend)
   ├── /api           → Python Flask API (Alternative / Backend-CRUD)
   └── /mailer        → PHP Mailer API (Kontaktformular per SMTP)
                              │
                              ▼
                         MySQL (portfolio_db)
```

| Service | Container | Port (Host) | Technologie |
|---------|-----------|-------------|-------------|
| Frontend | `pm-frontend_angular` | via Nginx | Angular 21, NgRx, Bootstrap |
| Backend-UI | `pm-backend_vue` | via Nginx `/backend` | Vue 3, Vite, Vuex |
| Gateway | `pm-middlenginx` | **8080** | Nginx |
| PHP REST API | `pm-api_php` | 3003 (direkt) / `/api2` | PHP 8.1, Apache |
| Python API | `pm-api_python` | via Nginx `/api` | Flask, PyMySQL |
| Mailer | `pm-mailer_php` | 3002 (direkt) / `/mailer` | PHP 8.1, PHPMailer |
| Datenbank | `pm-db` | 3306 | MySQL 8 |
| phpMyAdmin | `pm-phpmyadmin` | 8000 | Web-UI für MySQL |

## Schnellstart (Docker)

Voraussetzungen: [Docker](https://www.docker.com/) und Docker Compose.

```bash
# Im Repo-Root
docker compose up --build
```

Danach erreichbar:

- Portfolio: [http://localhost:8080](http://localhost:8080)
- Admin-UI: [http://localhost:8080/backend](http://localhost:8080/backend)
- phpMyAdmin: [http://localhost:8000](http://localhost:8000)

Vor dem ersten Start die Umgebungsvariablen in den einzelnen Anwendungen konfigurieren (siehe READMEs unten). API-Keys müssen zwischen Frontend, Backend und APIs übereinstimmen.

## Lokale Entwicklung (ohne Docker)

Jede Anwendung kann einzeln gestartet werden. Typischer Ablauf:

1. MySQL starten (`applications/db`) oder Docker nur für `db` + `phpmyadmin`
2. PHP REST API und Mailer konfigurieren und starten
3. **Optional (Pre-commit-Hooks):** im Repo-Root `npm install` — aktiviert Husky + lint-staged für Frontend-Dateien
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
| `applications/frontend-test` | Minimaler Nginx/HTML-Container zum Testen | [README](applications/frontend-test/README.md) |

## Konfiguration

Zentrale Dateien:

| Datei | Zweck |
|-------|-------|
| `docker-compose.yml` | Orchestrierung aller Services |
| `nginx.middle.conf` | Routing zwischen Frontend, Backend und APIs |

API-Authentifizierung erfolgt über den Header `API-Key` (Frontend: `fe_key`, Backend: `be_key`). Die Keys müssen in allen beteiligten `.env`-Dateien identisch sein.

## CI / Qualitätssicherung

Die Drone-Pipeline (`.drone.yml`) prüft das Angular-Frontend in zwei Schritten:

| Step | Befehl | Inhalt |
|------|--------|--------|
| `frontend-quality` | `npm run quality:ci` | Prettier, ESLint, Stylelint, Unit-Tests + Coverage, Production-Build, Fallow |
| `frontend-e2e` | `npm run e2e:ci` | Playwright E2E (Chromium) gegen `ng serve` |

Lokal dieselbe Qualitäts-Pipeline:

```bash
cd applications/frontend
npm run quality:ci   # ohne E2E
npm run e2e:ci       # E2E separat (Port 4200 muss frei sein)
```

Details zu Scripts, Coverage-Schwellen und Pre-commit-Hooks: [applications/frontend/README.md](applications/frontend/README.md)

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
