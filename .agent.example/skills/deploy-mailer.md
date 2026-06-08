# Skill: Mailer deployen & prüfen

## Rolle im Stack

```
Browser → REST API (/send_email) → Mailer (/send_email) → SMTP
                ↑ fe_key                    ↑ be_key (MAIL_API_KEY)
```

Der Mailer ist **nicht** direkt vom Browser erreichbar (Server-zu-Server). Das Frontend ruft die REST API auf; die REST API proxied an den Mailer.

## Voraussetzungen

- [ ] `applications/php-mailer-api/src/Inc/.env.prod` mit echten SMTP-Daten
- [ ] `API_KEY_BE` im Mailer = `MAIL_API_KEY` in REST `.env.prod`
- [ ] `deploy.config.local.json` → `mailerBaseUrl` = tatsächliche Mailer-URL (z. B. `https://mapi.example.eu/index.php`)
- [ ] Build-Skript hat `MAIL_ENDPOINT` / `HEALTH_ENDPOINT` in REST `.env.prod` synchronisiert

## Build

Mailer ist Teil des Gesamt-Builds:

```powershell
.\deploy\build-shared-hosting.ps1
```

Nur Mailer (wenn REST/Frontend schon aktuell):

```powershell
.\deploy\build-shared-hosting.ps1 -SkipFrontend -SkipRestApi -SkipDatabase -SkipNpmInstall -SkipComposer
```

Paket: `deploy/out/2-mailer/` — Struktur: `Inc/`, `vendor/`, `index.php`, `logs/`.

## Upload

- Document Root der **Mailer-Subdomain** (z. B. `mapi.example.eu`)
- Inhalt von `2-mailer/` ins Root legen (nicht den Ordner selbst)
- `Inc/.env.prod` muss mit hochgeladen sein (wird vom Build explizit kopiert)

## Smoke-Tests

```powershell
# Mailer direkt (öffentlicher Health-Endpunkt)
curl.exe -s "https://mapi.example.eu/index.php/healthcheck"

# REST Health (prüft Mailer-Erreichbarkeit)
curl.exe -s "https://api.example.eu/index.php/healthcheck?api_key=<API_KEY_FE>"
```

Erwartung Health: JSON mit OK-Status (kein 500/404).

## Kontaktformular (End-to-End)

1. Browser: https://example.com → Kontaktseite
2. Formular absenden
3. REST loggt Fehler in `src/logs/app.log` (auf Server, nicht im Git)

Test per curl (POST an REST):

```powershell
curl.exe -s -X POST `
  -H "Origin: https://example.com" `
  -d "name=Test&email=test@example.com&message=Hello&api_key=<API_KEY_FE>" `
  "https://api.example.eu/index.php/send_email"
```

## Typische Fehler

| Symptom | Ursache | Fix |
|---------|---------|-----|
| REST Health: Mailer unreachable | Falsche `HEALTH_ENDPOINT` / Mailer nicht deployed | `mailerBaseUrl` + Upload `2-mailer/` |
| 401 auf Mailer | `MAIL_API_KEY` ≠ `API_KEY_BE` | Keys in beiden `.env.prod` angleichen |
| SMTP-Fehler | `MAIL_HOST`/`MAIL_PASSWORD` falsch | SMTP-Daten beim Hoster prüfen |
| CORS auf Mailer | Irrelevant für Browser | Nur REST-CORS relevant |

## Mailer `.htaccess`

Deploy-Template: `deploy/templates/mailer-root.htaccess` — Rewrite zu `index.php`.

## Nach Deploy

- [ ] `healthcheck` auf Mailer-Subdomain
- [ ] REST `healthcheck` mit API-Key
- [ ] Kontaktformular im Browser
- [ ] `memory/production-state.md` → Mailer-Status auf „deployed“ setzen
