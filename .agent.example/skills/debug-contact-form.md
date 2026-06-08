# Skill: Kontaktformular debuggen

## Datenfluss

```
Angular (contact module)
  → ApiClientService.post('send_email', formData)
  → REST API  POST /index.php/send_email  (fe_key)
  → HttpClient → MAIL_ENDPOINT (Mailer)
  → Mailer      POST /index.php/send_email  (be_key)
  → PHPMailer → SMTP
```

## Frontend-Checks

| Prüfung | Wo |
|---------|-----|
| `API_BASE_URL` korrekt | `environment.production.ts` / deploy-generiertes `environment.deploy.ts` |
| Cross-Origin: Key im Body | `API_KEY_IN_QUERY: true` → `api_key` als Form-Feld |
| Honeypot `contactByFax` leer | Spam-Schutz — befüllt = stilles OK ohne Mail |

Relevante Dateien:

- `applications/frontend/src/app/core/services/api/api-client.service.ts`
- Kontakt-Component/Service unter `applications/frontend/src/app/modules/contact/` (o. ä.)

## REST-Checks

```powershell
# Health inkl. Mailer-Ping
curl.exe -s "https://api.example.eu/index.php/healthcheck?api_key=<API_KEY_FE>"
```

Env in REST `src/Inc/.env.prod`:

```
MAIL_ENDPOINT=https://<mailer-host>/index.php/send_email
MAIL_API_KEY=<gleich API_KEY_BE im Mailer>
HEALTH_ENDPOINT=https://<mailer-host>/index.php/healthcheck
```

Code: `applications/php-rest-api/src/Controller/Api/MailController.php`  
HTTP-Client: `src/Inc/HttpClient.php`

## Mailer-Checks

```powershell
curl.exe -s "https://mapi.example.eu/index.php/healthcheck"
```

Mailer `Inc/.env.prod`: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `API_KEY_BE`.

## Entscheidungsbaum

```
Formular submit → Netzwerk-Tab
│
├─ Kein Request / CORS-Fehler
│   → debug-rest-api-cors.md, Frontend API_KEY_IN_QUERY deployen
│
├─ 401 Unauthorized
│   → API_KEY_FE Frontend ≠ REST .env.prod
│
├─ 200/JSON aber keine Mail
│   → REST logs (app.log), MAIL_ENDPOINT erreichbar?
│   → Mailer SMTP-Credentials
│
├─ 500 REST
│   → PHP error log Hoster, HealthController/MailController
│
└─ Honeypot ausgelöst
│   → contactByFax-Feld im DOM prüfen (Bot/Extension)
```

## Logs (Server, nicht Git)

| App | Pfad |
|-----|------|
| REST | `src/logs/app.log` (AppLogger) |
| Mailer | `logs/mail.log` |

## Lokaler Test

```bash
docker compose up frontend php_api php_mailer db
# Kontakt auf localhost:8080
```

Shared-Hosting-Sim (Cross-Origin):

```bash
docker compose -f docker-compose.yml -f docker-compose.shared-hosting-sim.yml up --build frontend php_api php_mailer db
```
