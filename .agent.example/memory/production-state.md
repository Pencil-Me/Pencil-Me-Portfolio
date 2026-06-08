# Production — Ist-Zustand & Checkliste

> Stand: Agent-Session 2026-06-08. Nach Deploys hier aktualisieren.

## URLs

| Service | URL | Status (bekannt) |
|---------|-----|------------------|
| Frontend | https://example.com | Live |
| REST API | https://api.example.eu | Live, CORS-Fix verifiziert |
| Mailer | https://mapi.example.eu | ggf. noch nicht deployed |

> `deploy.config.example.json` nutzt teils `mailer.example.eu` — in Production/`mailerBaseUrl` die **tatsächliche** Subdomain (`mapi.example.eu`) verwenden.

## API-Server-Pfad (aus ping.php)

```
/homepages/35/d484155260/htdocs/live_umgebung/APIs/pm-portfolio
```

`src/Inc/` liegt neben `index.php` im API-Root.

## Verifiziert (2026-06-08)

- `env_file_used=.env.prod`
- `.env.dev` auf Server: **nein**
- `allowed_origins`: `https://www.example.com`, `https://example.com`
- Mit `Origin: https://example.com` → `origin_allowed: true`, Header gesetzt

## Smoke-Tests

```powershell
curl.exe -s "https://api.example.eu/ping.php"
curl.exe -s -H "Origin: https://example.com" "https://api.example.eu/test.php?format=json"
curl.exe -s -I -H "Origin: https://example.com" "https://api.example.eu/index.php/all_techstacks?api_key=<API_KEY_FE>"
curl.exe -s "https://api.example.eu/index.php/all_projects?api_key=<API_KEY_FE>"
```

Browser: https://example.com — Projekte/Tech-Stacks laden; Kontaktformular braucht Mailer.

## Offene Punkte

- [ ] `ping.php` / `test.php` vom API-Server entfernen (nach finaler Verifikation)
- [ ] Mailer (`2-mailer/`) deployen falls Kontaktformular noch fehlschlägt
- [ ] Frontend deployen falls alte Version noch `API-Key`-Header bei Cross-Origin nutzt
- [ ] Alte `.env.dev` auf Server löschen falls noch vorhanden (aktuell: nein)

## Nach jedem API-Deploy prüfen

1. `ping.php` → `env_file_used=.env.prod`
2. `test.php` mit Origin → `origin_allowed: true`
3. Echter Endpunkt mit `?api_key=` → JSON + CORS-Header
