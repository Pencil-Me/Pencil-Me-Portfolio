# PHP Mailer API

Schlanker Microservice zum Versenden von E-Mails über SMTP (PHPMailer). Wird vom PHP REST API Gateway intern angesprochen.

## Tech-Stack

- **PHP 8.3** + Apache
- **PHPMailer**
- phpdotenv
- PHPUnit 11, PHPStan Level 5

## Endpunkte

| Methode | Pfad | Auth | Beschreibung |
|---------|------|------|--------------|
| POST | `/send_email` | `be_key` | E-Mail senden (Server-to-Server) |
| GET | `/healthcheck` | — | Verfügbarkeit prüfen |

Im Compose-Stack: nur **intern** per Docker-DNS (`pm-mailer_php`) — kein öffentlicher Nginx-Pfad `/mailer` mehr.

### POST `/send_email`

Header: `API-Key: <API_KEY_BE>` (in REST: `MAIL_API_KEY` = `API_KEY_BE`)

Body (Form):

| Feld | Beschreibung |
|------|--------------|
| `sender` | Absender-Adresse (Reply-To) |
| `recipient` | Empfänger-Adresse |
| `subject` | Betreff (max. 200 Zeichen) |
| `message` | Nachrichtentext (max. 10.000 Zeichen) |

## Key-Vertrag REST ↔ Mailer

| Service | Variable | Rolle |
|---------|----------|-------|
| php-rest-api | `MAIL_API_KEY` | Header beim Aufruf des Mailers |
| php-mailer-api | `API_KEY_BE` | Erwarteter Key auf `/send_email` |

Beide Werte müssen identisch sein (`secretApiBEkey` lokal).

## Response-Contract

Fehler und Erfolg: `{"message": "..."}` + HTTP-Status.

## Logging

`src/logs/mail.log` — Level über `LOG_LEVEL` (`DEBUG` | `INFO` | `WARNING` | `ERROR`). Passwörter/API-Keys werden nicht geloggt. SMTP-Debug nur bei `LOG_LEVEL=DEBUG`.

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
MAIL_SENDER=mail_user
MAIL_FROM_NAME="Portfolio Contact"
MAIL_SMTP_SECURE=tls

LOG_LEVEL=DEBUG
```

## Docker

```bash
docker build -t pm-mailer .
docker run -p 3002:80 pm-mailer
```

Das Dockerfile führt `composer install --no-dev` aus — `vendor/` wird im Image gebaut, nicht committet.

**Erreichbarkeit:**

| Kontext | URL |
|---------|-----|
| Dev (Host-Port) | [http://localhost:3002](http://localhost:3002) |
| Docker-Stack (intern) | `http://pm-mailer_php/index.php/...` — REST ruft per `MAIL_ENDPOINT` auf |
| Nginx-Gateway | **Nicht** öffentlich (Security Remediation Doc 23) |

Öffentliches Kontaktformular ausschließlich über **`/api2/send_email`** (Frontend `fe_key` + Nginx Rate-Limit).

Healthcheck: `GET /index.php/healthcheck` (Apache Rewrite via `src/.htaccess`).

## Shared Hosting

Eigenes Document Root auf Mailer-Subdomain — Paket `deploy/out/2-mailer/`. Siehe [deploy/README.md](../../deploy/README.md).

## Projektstruktur

```
composer.json / composer.lock   # Root (CI + Docker)
src/
├── index.php
├── Controller/Api/
├── Inc/
│   ├── MailSenderInterface.php
│   └── PhpmailerMailSender.php
└── logs/
tests/
```

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
