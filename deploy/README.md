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

Pfade je nach Hoster anpassen (Strato, All-Inkl, …).

## Nach dem Upload

1. Datenbank importieren (`1-database/portfolio_db.sql`)
2. Smoke-Tests:

```powershell
curl https://mailer.deinedomain.de/index.php/healthcheck
curl -H "API-Key: <API_KEY_FE>" https://api.deinedomain.de/index.php/all_projects
```

3. Frontend im Browser + Kontaktformular testen

### API liefert HTTP 500 (Apache-Fehlerseite, kein JSON)

**Viele Shared-Hosting-Anbieter:** Im API-Root **keine `.htaccess`** mit `SetEnvIf`, `SetEnv`, `Header` oder `Options` verwenden.
Jede davon kann HTTP 500 ausloesen. Das Deploy-Paket `3-rest-api/` enthaelt **absichtlich keine** `.htaccess`.

1. `.htaccess` im API-Root **loeschen**
2. Rest aus `3-rest-api/` erneut hochladen (ohne `.htaccess`)
3. `https://api.../ping.php` Kurzcheck, `https://api.../test.php?format=json` Diagnose (~41 Dateien)
4. `curl ".../index.php/all_projects?api_key=..."` muss JSON liefern

**API-Diagnose (`ping.php` / `test.php`):**

```powershell
curl.exe -s "https://api.pencil-me.eu/ping.php"
curl.exe -s "https://api.pencil-me.eu/test.php?format=json"
curl.exe -s -H "Origin: https://pencil-me.de" -H "Referer: https://pencil-me.de/" `
  "https://api.pencil-me.eu/test.php"
```

Zeigt u.a.: `HTTP_ORIGIN`, `HTTP_REFERER`, `ALLOWED_ORIGINS`, CorsHeaders, RequestPath, maskierte API-Keys.

### CORS-Fehler (Frontend auf pencil-me.de, API auf api.*)

**Symptom:** `curl` mit `API-Key` liefert JSON, aber OPTIONS-Preflight auf der API-Subdomain gibt **404** (Apache). Ursache: Custom-Header `API-Key` erzwingt Preflight.

**Fix A (Cross-Origin, empfohlen mit separater API-Subdomain): Kein Preflight**

Frontend sendet den Key als **`?api_key=`** (GET) bzw. Form-Feld **`api_key`** (POST) — keine Custom-Header, kein OPTIONS. PHP: `ApiKeyResolver.php`. Build setzt `API_KEY_IN_QUERY: true` bei absoluter `apiBaseUrl`.

Smoke-Test (ohne Header):

```powershell
curl.exe "https://api.pencil-me.eu/index.php/all_projects?api_key=<API_KEY_FE>"
```

**Fix B (Same-Origin-Proxy auf der Hauptdomain)**

In `deploy.config.local.json`:

```json
{
  "apiBaseUrl": "/api2",
  "apiBackendUrl": "https://api.pencil-me.eu/index.php",
  "frontendDomain": "https://www.pencil-me.de"
}
```

Das Build-Skript setzt `API_BASE_URL: '/api2'` im Frontend und erzeugt in `4-frontend/.htaccess` eine Proxy-Regel:

```apache
RewriteRule ^api2/(.*)$ https://api.pencil-me.eu/index.php/$1 [P,L,NC]
```

Der Browser ruft dann `https://www.pencil-me.de/api2/all_projects` auf — **gleiche Origin**, kein CORS, kein OPTIONS-Preflight auf `api.*`.

Smoke-Test nach Frontend-Upload:

```powershell
curl.exe -H "API-Key: <API_KEY_FE>" "https://www.pencil-me.de/api2/all_projects"
```

**API-Subdomain:** weiter **ohne** `.htaccess` (sonst HTTP 500).

**Direkter Cross-Origin-Zugriff** (nur falls Proxy nicht genutzt wird):

Typische Ursachen:

1. **`src/Inc/.env.prod` fehlt auf dem Server** oder `ALLOWED_ORIGINS` ist leer/falsch  
   → muss exakt passen: `https://pencil-me.de,https://www.pencil-me.de` (Schema + Host, kein `/` am Ende)
2. **Deploy ohne Build-Skript** → `ALLOWED_ORIGINS` nicht aus `frontendDomain` gesetzt  
   → `.\deploy\build-shared-hosting.ps1` erneut ausfuehren und **`3-rest-api/src/Inc/.env.prod`** mit hochladen
3. **Preflight (OPTIONS)** schlaegt fehl → auf manchen Hostern erreicht OPTIONS PHP nicht (404 vor `EarlyCors`)

Check per curl (bei Apache-404 deshalb Proxy nutzen):

```powershell
curl.exe -I -X OPTIONS `
  -H "Origin: https://pencil-me.de" `
  -H "Access-Control-Request-Method: GET" `
  -H "Access-Control-Request-Headers: api-key,content-type" `
  "https://api.pencil-me.eu/index.php/all_projects"
```

**Wichtig:** CORS in PHP (`EarlyCors`) hilft nur, wenn OPTIONS bei PHP ankommt. Auf der **api-Subdomain** keine `.htaccess` mit `Header`/`SetEnv` — HTTP 500.

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
