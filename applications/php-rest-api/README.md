# PHP REST API

REST-Gateway für das **öffentliche Frontend**. Liefert Projekte, Tech-Stack und Kunden; leitet Kontakt-E-Mails an den Mailer-Service weiter.

## Tech-Stack

- **PHP 8.3** + Apache
- Composer: Guzzle, phpdotenv, Monolog
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

Header: `API-Key: <wert von API_KEY_FE>`

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

- Logs: `src/logs/app.log` (Monolog), Level via `LOG_LEVEL`
- Statische Analyse: `composer analyse` (PHPStan Level 5)
- Dev-Mounts: Root-`docker-compose.override.yml.example`

## Konfiguration

Vorlage: `.env.example` im Projektroot.

Kopieren nach **`src/Inc/.env.dev`** (Entwicklung) bzw. **`src/Inc/.env.prod`** (Production):

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
MAIL_ENDPOINT=http://pm-mailer_php/send_email
MAIL_API_KEY=secretMailApiKey

HEALTH_ENDPOINT=http://pm-mailer_php/healthcheck
```

`Config.php` lädt beim Start `.env.dev` oder `.env.prod` aus `src/Inc/` — gesteuert über `APP_ENV=production` (Docker/Server) bzw. `development` (Standard).

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
└── logs/                 # Monolog (app.log)
```

## Docker

Container: `pm-api_php` — Port **3003** direkt, im Stack über Nginx **`/api2`**.

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
