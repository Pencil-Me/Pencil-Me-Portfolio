# PHP Mailer API

Schlanker Microservice zum Versenden von E-Mails über SMTP (PHPMailer). Wird vom PHP REST API Gateway und optional direkt vom Frontend angesprochen.

## Tech-Stack

- **PHP 8.1** + Apache
- **PHPMailer**
- phpdotenv

## Endpunkte

| Methode | Pfad | Auth | Beschreibung |
|---------|------|------|--------------|
| POST | `/send_email` | `fe_key` | E-Mail senden |
| GET | `/healthcheck` | — | Verfügbarkeit prüfen |

Im Compose-Stack: Basis-Pfad **`/mailer`** (Nginx rewrite → `index.php`).

### POST `/send_email`

Header: `API-Key: <API_KEY_FE>`

Body (JSON oder Form):

| Feld | Beschreibung |
|------|--------------|
| `sender` | Absender-Adresse |
| `recipient` | Empfänger-Adresse |
| `subject` | Betreff |
| `message` | Nachrichtentext |

## Konfiguration

Vorlage: `src/Inc/.env.example`

Kopieren nach **`src/Inc/.env.dev`** bzw. **`src/Inc/.env.prod`**:

```env
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:8080
API_KEY_FE=secretApiFEkey
API_KEY_BE=secretApiBEkey

MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=mail_user
MAIL_PASSWORD=mail_password

BASE_URL=/
```

SMTP-Zugangsdaten müssen zu einem erreichbaren Mailserver passen.

## Lokale Entwicklung

```bash
cd src
composer install
# oder Docker:
docker build -t pm-mailer .
docker run -p 3002:80 -v ./src:/var/www/html pm-mailer
```

Direkt erreichbar unter [http://localhost:3002](http://localhost:3002), im Stack unter [http://localhost:8080/mailer](http://localhost:8080/mailer).

## Projektstruktur

```
src/
├── index.php             # Front-Controller
├── Controller/Api/       # MailController, HealthController
├── Inc/                  # Bootstrap, Router, Config
└── vendor/
```

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
