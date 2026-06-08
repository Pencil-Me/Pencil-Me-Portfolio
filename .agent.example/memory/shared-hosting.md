# Shared Hosting — Deploy, CORS, Env

## Deploy-Build

```powershell
# Repo-Root
.\deploy\build-shared-hosting.ps1
```

Artefakte: `deploy/out/`

| Ordner | Ziel auf Hoster |
|--------|-----------------|
| `1-database/` | phpMyAdmin Import |
| `2-mailer/` | Document Root Mailer-Subdomain |
| `3-rest-api/` | Document Root API-Subdomain |
| `4-frontend/` | Document Root Hauptdomain |

Voraussetzung: `deploy/deploy.config.local.json` (aus Example) + `applications/*/src/Inc/.env.prod` (gitignored).

## Env-Regeln (kritisch)

- **Production:** nur `src/Inc/.env.prod` auf dem Server.
- **Priorität im Code:** `EnvLoader::resolveEnvFilePath()` — wenn `.env.prod` existiert, wird sie genutzt (auch wenn alte `.env.dev` noch auf dem Server liegt).
- **Deploy-Build:** `Copy-PhpSourceForDeploy` kopiert **keine** `.env.dev`/`.env.example`; `.env.prod` nur explizit aus dem validierten Quellpfad.
- **Assertion:** `Assert-DeployPackageHasNoEnvDev` bricht Build ab, falls `.env.dev` in `deploy/out` landet.

Build-Skript synchronisiert in `.env.prod`:

- `ALLOWED_ORIGINS` aus `frontendDomain`
- `MAIL_ENDPOINT` / `HEALTH_ENDPOINT` aus `mailerBaseUrl`
- `APP_ENV=production`

## REST API `.htaccess` (Shared-Hosting-safe)

Nur Rewrite — **kein** `Header`, `SetEnvIf`, `SetEnv`, `Options`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
```

Erweiterte Header/CORS in `.htaccess` → oft **HTTP 500** auf Shared Hosting.

## CORS-Architektur

1. **Browser Cross-Origin** braucht `Access-Control-Allow-Origin` auf der **Antwort** (auch bei GET ohne Preflight).
2. **Preflight vermeiden:** Bei absoluter `API_BASE_URL` sendet Angular `api_key` als Query (GET) / Form-Feld (POST), nicht als `API-Key`-Header.
3. **`CorsHeaders`:** Lädt Origins früh aus `.env.prod`; Referer-Fallback wenn `HTTP_ORIGIN` fehlt; www↔apex-Matching.
4. **OPTIONS** erreicht auf manchen Hostern PHP nicht (Apache 404) — deshalb Query-Key-Strategie.

## Zwei Deployment-Strategien API-Zugriff

| Strategie | Frontend `apiBaseUrl` | CORS nötig? |
|-----------|----------------------|-------------|
| **A — Cross-Origin** | `https://api.example.eu/index.php` | Ja (`CorsHeaders` + `API_KEY_IN_QUERY`) |
| **B — Same-Origin-Proxy** | `/api2` + `apiBackendUrl` in deploy.config | Nein (Proxy in Frontend-`.htaccess`) |

## Schlankes REST-Paket (~41 Dateien)

- `composer.json` ohne Runtime-Deps → `vendor/` nur Autoload
- Ersetzt: Dotenv → `EnvLoader`, Monolog → `AppLogger`, Guzzle → `HttpClient`
- Entfernt: `Cors.php`, `RateLimiter.php`

## Diagnose (temporär)

| Datei | Zweck |
|-------|-------|
| `ping.php` | Kurzcheck (Env, Dateien, `env_file_used`) |
| `test.php?format=json` | Vollreport CORS, Headers, Routing |

**Nach Analyse vom Server löschen.**

## Typische Fehler

| Symptom | Ursache | Fix |
|---------|---------|-----|
| `allowed_origins: []` trotz `.env.prod` | `.env.dev` auf Server + alte Prioritätslogik | Fix deployen, `.env.dev` auf Server löschen |
| API HTTP 500 | `.htaccess` mit `Header`/`SetEnv` | Nur Rewrite-`.htaccess` |
| Browser blockiert, curl OK | Fehlender `Access-Control-Allow-Origin` | CORS + Origins prüfen |
| OPTIONS 404 | Apache, nicht PHP | Query-Key / Proxy nutzen |
