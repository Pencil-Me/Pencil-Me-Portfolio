# Shared-Hosting Deploy (FTP + PHP)

Automatisierter Build für **Frontend**, **PHP REST API** und **Mailer** — ohne Docker, Python oder Vue-Admin.

## Voraussetzungen (lokal)

- Node.js 20+ und `npm`
- PHP Composer
- Optional: [WinSCP](https://winscp.net/) für `-Upload`

## Einmalige Vorbereitung

```powershell
# 1) Deploy-Konfiguration
Copy-Item deploy/deploy.config.example.json deploy/deploy.config.local.json
# apiBaseUrl, frontendDomain, mailerBaseUrl anpassen

# 2) Production-Env für PHP-APIs (nur src/Inc/ — kein Root-.env mehr)
Copy-Item applications/php-rest-api/src/Inc/.env.example applications/php-rest-api/src/Inc/.env.prod
Copy-Item applications/php-mailer-api/src/Inc/.env.example applications/php-mailer-api/src/Inc/.env.prod
```

In beiden `.env.prod`:

- Eigene **API-Keys** setzen (nicht `secretApiFEkey` / `secretApiBEkey`)
- **DB-Zugang** des Hosters eintragen
- **SMTP-Daten** im Mailer
- `MAIL_API_KEY` (REST) = `API_KEY_BE` (Mailer)

Das Skript synchronisiert automatisch:

- `MAIL_ENDPOINT` / `HEALTH_ENDPOINT` aus `mailerBaseUrl` in der Deploy-Config
- `ALLOWED_ORIGINS` aus `frontendDomain`
- `APP_ENV=production`
- Angular `API_KEY` / `API_BASE_URL` für den Production-Build

## Deploy ausführen

```powershell
# Im Repo-Root
.\deploy\build-shared-hosting.ps1
```

Artefakte entfernen:

```powershell
.\deploy\clean.ps1                  # deploy/out, PHPUnit-Cache, .angular
.\deploy\clean.ps1 -IncludeFrontendDist
.\deploy\clean.ps1 -All             # + frontend/dist
```

Ergebnis unter `deploy/out/`:

| Ordner | Ziel auf dem Hoster |
|--------|---------------------|
| `1-database/` | phpMyAdmin — SQL importieren |
| `2-mailer/` | Document Root Mailer-Subdomain |
| `3-rest-api/` | Document Root API-Subdomain |
| `4-frontend/` | Document Root Hauptdomain |

Details und Upload-Reihenfolge: `deploy/out/MANIFEST.txt`

### Frontend-Paket (`4-frontend/`)

Enthält neben dem Angular-Build u. a.:

| Datei | Zweck |
|-------|--------|
| `.htaccess` | HTTPS-Redirect, SPA-Fallback |
| `favicon.ico`, `favicon-*.png`, `apple-touch-icon.png` | Icons (Document Root) |
| `site.webmanifest`, `browserconfig.xml`, `safari-pinned-tab.svg` | PWA / Tiles |
| `robots.txt`, `sitemap.xml` | SEO |
| `assets/logos/`, `assets/root/utilitarian-graphics.webp` | Bilder |

Quelle: `applications/frontend/src/assets/root/` — Build kopiert Icons ins Build-Root; Deploy-Skript prüft Vollständigkeit via `Assert-FrontendDeployPackage`.

## Optionen

```powershell
# Schneller Rebuild (Deps bereits installiert)
.\deploy\build-shared-hosting.ps1 -SkipNpmInstall -SkipComposer

# Nur PHP neu bauen
.\deploy\build-shared-hosting.ps1 -SkipFrontend

# ZIP für manuellen Upload
.\deploy\build-shared-hosting.ps1 -Zip

# FTP-Upload (WinSCP, ftp.enabled in deploy.config.local.json)
.\deploy\build-shared-hosting.ps1 -Upload
```

### FTP-Konfiguration (optional)

In `deploy.config.local.json`:

```json
"ftp": {
  "enabled": true,
  "host": "ftp.deinedomain.de",
  "username": "...",
  "password": "...",
  "useSsl": true,
  "remotePaths": {
    "frontend": "/public_html",
    "restApi": "/api/public_html",
    "mailer": "/mailer/public_html"
  }
}
```

Pfade je nach Hoster anpassen (IONOS, Strato, All-Inkl, …).

## Nach dem Upload

1. Datenbank importieren (`1-database/portfolio_db.sql`)
2. Smoke-Tests:

```powershell
curl https://mailer.deinedomain.de/index.php/healthcheck
curl -H "API-Key: <API_KEY_FE>" https://api.deinedomain.de/index.php/all_projects
```

3. Frontend im Browser + Kontaktformular testen

## Skripte

| Datei | Zweck |
|-------|--------|
| `build-shared-hosting.ps1` | Build + Pakete unter `deploy/out/` |
| `clean.ps1` | Lokale Artefakte entfernen |
| `Deploy-Helpers.ps1` | Hilfsfunktionen (Root-Assets, Env-Sync) |
| `deploy.config.example.json` | Vorlage für lokale Config |

## Nicht enthalten

- Python Admin-API
- Vue Admin-UI
- Content-Pflege live (DB lokal bearbeiten → Export → phpMyAdmin)
