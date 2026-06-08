# PHP REST API

REST-Gateway für das **öffentliche Frontend**. Liefert Projekte, Tech-Stack und Kunden; leitet Kontakt-E-Mails an den Mailer-Service weiter.

## Tech-Stack

- **PHP 8.3** + Apache
- Composer-Autoload nur (keine Runtime-Deps — Shared-Hosting Dateilimit)
- Inc: EnvLoader, AppLogger, HttpClient (curl), CorsHeaders
- **PHPUnit 11** (Tests)
- PDO/MySQL

## Endpunkte

Alle Pfade relativ zur API-Basis (lokal: `http://localhost:8080/api2` oder direkt `:3003`).

| Methode | Pfad | Auth | Beschreibung |
|---------|------|------|--------------|
| GET | `/all_projects` | `fe_key` | Alle Projekte (Frontend-Format) |
| GET | `/get_project/{id}` | `fe_key` | Einzelnes Projekt |
| GET | `/all_customers` | `fe_key` | Alle Kunden |
| GET | `/all_techstacks` | `fe_key` | Alle Tech-Stack-Einträge |
| POST | `/send_email` | `fe_key` | Kontakt-E-Mail (Proxy zum Mailer) |
| GET | `/healthcheck` | — | Health-Check |

### Authentifizierung

Auth (Frontend): `API-Key`-Header (Same-Origin `/api2`) **oder** `?api_key=` / Form-Feld `api_key` (Cross-Origin, kein OPTIONS-Preflight)

Geschützte Routen erwarten den Frontend-Key (`fe_key`).

### Rate Limiting

Read-Endpunkte haben keinen PHP-internen Limiter mehr (Option A, ADR-001). Kontakt-Mail ist am Nginx-Gateway limitiert (`limit_req` auf `/api2/send_email`).

### Query-Parameter

| Parameter | Endpunkte | Default | Maximum |
|-----------|-----------|---------|---------|
| `limit` | `/all_projects`, `/all_customers`, `/all_techstacks` | 100 | 100 |

## Response-Contract

| Situation | Format |
|-----------|--------|
| Erfolg (Reads) | Roh-JSON (Array oder Objekt) |
| Erfolg (Mail) | `{"message": "..."}` |
| Fehler | `{"message": "..."}` + passender HTTP-Status |

| Endpunkte | [`openapi.yaml`](openapi.yaml) · Architektur: [`docs/adr/001-api-responsibilities.md`](../../docs/adr/001-api-responsibilities.md) |
| Refactoring | [05-php-apis.md](../../docs/refactoring/05-php-apis.md) · Follow-up: [16-php-rest-api-followup.md](../../docs/refactoring/16-php-rest-api-followup.md) |

## Logging & Analyse

- Logs: `src/logs/app.log` (AppLogger), Level via `LOG_LEVEL`
- Statische Analyse: `composer analyse` (PHPStan Level 5)
- Dev-Mounts: Root-`docker-compose.override.yml.example`

## Konfiguration

Vorlage: `src/Inc/.env.example` — kopieren nach **`src/Inc/.env.dev`** (Entwicklung) bzw. **`src/Inc/.env.prod`** (Production):

```env
APP_ENV=development
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:8080
API_KEY_FE=secretApiFEkey
API_KEY_BE=secretApiBEkey

DB_HOST=pm-db
DB_PORT=3306
DB_DATABASE_NAME=portfolio_db
DB_USERNAME=user
DB_PASSWORD=test

BASE_URL=/

MAIL_RECIPIENT=email@domain.com
MAIL_ENDPOINT=http://pm-mailer_php/index.php/send_email
# Server-to-server: gleicher Wert wie API_KEY_BE in php-mailer-api
MAIL_API_KEY=secretApiBEkey

HEALTH_ENDPOINT=http://pm-mailer_php/index.php/healthcheck
```

**Docker:** `MAIL_ENDPOINT` nutzt Docker-DNS (`pm-mailer_php`).  
**Shared Hosting:** volle URL zur Mailer-Subdomain, z. B. `https://mapi.example.com/index.php/send_email` — wird vom [Deploy-Skript](../../deploy/README.md) aus `mailerBaseUrl` gesetzt.

`Config.php` lädt `.env.dev` oder `.env.prod` ausschließlich aus **`src/Inc/`** — gesteuert über `APP_ENV=production` (Docker/Server) bzw. `development` (Standard). In Production liefert `/` bzw. `/index.php` keine Welcome-Message mehr (404 JSON).

**CORS (Production):** `ALLOWED_ORIGINS` muss die exakte Frontend-Origin enthalten, z. B. `https://pencil-me.de,https://www.pencil-me.de`. Beim Shared-Hosting-Deploy setzt `build-shared-hosting.ps1` den Wert aus `frontendDomain` in `deploy.config.local.json` (inkl. www/apex-Paar). Nach Änderung REST-API neu deployen.

## Lokale Entwicklung

```bash
composer install
# Apache/PHP lokal oder:
docker build -t pm-php-api .
docker run -p 3003:80 -v ./public:/var/www/html/public pm-php-api
```

## Tests

```bash
composer install
./vendor/bin/phpunit
# oder
composer test
```

## Projektstruktur

```
public/index.php          # Front-Controller, Routing
src/
├── Controller/Api/       # Projects, Customers, Techstack, Mail, Health
├── Model/                # PDO-Datenzugriff
├── Inc/                  # Bootstrap, Router, Config, CORS
└── logs/                 # AppLogger (app.log, wird bei erstem Log angelegt)
```

## Docker

Container: `pm-api_php` — Port **3003** (Dev) direkt, im Stack über Nginx **`/api2`**.

### Shared-Hosting Deploy (Dateilimit)

Production-Paket `deploy/out/3-rest-api/` hat **~40 Dateien** (kein Guzzle/Monolog/Dotenv-vendor).

Diagnose: `ping.php` (Kurzcheck), `test.php?format=json` (vollstaendig). Nach Analyse vom Server loeschen.

Compose mountet `src/Inc/.env.dev` und `public/` für Live-Reload.

## Shared Hosting

Teil des Deploy-Pakets `deploy/out/3-rest-api/` — siehe [deploy/README.md](../../deploy/README.md).

Upload-Reihenfolge: DB → Mailer → REST API → Frontend.

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
