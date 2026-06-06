# PHP Mailer API

Schlanker Microservice zum Versenden von E-Mails über SMTP (PHPMailer). Wird vom PHP REST API Gateway intern angesprochen.

## Tech-Stack

- **PHP 8.1** + Apache
- **PHPMailer**
- phpdotenv
- PHPUnit 11, PHPStan Level 5

## Endpunkte

| Methode | Pfad | Auth | Beschreibung |
|---------|------|------|--------------|
| POST | `/send_email` | `fe_key` | E-Mail senden |
| GET | `/healthcheck` | — | Verfügbarkeit prüfen |

Im Compose-Stack: Basis-Pfad **`/mailer`** (Nginx rewrite → `index.php`).

### POST `/send_email`

Header: `API-Key: <API_KEY_FE>`

Body (Form):

| Feld | Beschreibung |
|------|--------------|
| `sender` | Absender-Adresse |
| `recipient` | Empfänger-Adresse |
| `subject` | Betreff |
| `message` | Nachrichtentext |

## Response-Contract

Fehler und Erfolg: `{"message": "..."}` + HTTP-Status.

## Logging

`src/logs/mail.log` — Level über `LOG_LEVEL` (`DEBUG` | `INFO` | `WARNING` | `ERROR`). Passwörter/API-Keys werden nicht geloggt.

## Statische Analyse

```bash
composer analyse   # PHPStan Level 5
composer test
```

## Konfiguration

Vorlage: `src/Inc/.env.example`

Kopieren nach **`src/Inc/.env.dev`** bzw. **`src/Inc/.env.prod`**:

```env
APP_ENV=development
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:8080
API_KEY_FE=secretApiFEkey
API_KEY_BE=secretApiBEkey

MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=mail_user
MAIL_PASSWORD=mail_password

BASE_URL=/
LOG_LEVEL=DEBUG
```

## Docker

```bash
docker build -t pm-mailer .
docker run -p 3002:80 pm-mailer
```

Das Dockerfile führt `composer install --no-dev` aus — `vendor/` wird im Image gebaut, nicht committet.

Dev-Override: Root-`docker-compose.override.yml.example` (optional `src/`-Mount).

Direkt: [http://localhost:3002](http://localhost:3002), im Stack: [http://localhost:8080/mailer](http://localhost:8080/mailer).

## Projektstruktur

```
composer.json / composer.lock   # Root (CI + Docker)
src/
├── index.php
├── Controller/Api/
├── Inc/
└── logs/
```

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
