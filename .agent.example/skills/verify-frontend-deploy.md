# Skill: Frontend-Deploy verifizieren

## Wann nutzen

Nach Upload von `deploy/out/4-frontend/` oder bei „API-Daten laden nicht“ im Browser.

## Build-Kontext

Deploy-Skript erzeugt temporär `environment.deploy.ts` (gitignored) mit:

- `API_KEY` aus REST `.env.prod` (`API_KEY_FE`)
- `API_BASE_URL` aus `deploy.config.local.json` (`apiBaseUrl`)
- `API_KEY_IN_QUERY: true` wenn `apiBaseUrl` absolut (`http(s)://...`)

## Zwei Production-Setups

### A — Cross-Origin (separate API-Subdomain)

`deploy.config.local.json`:

```json
{
  "apiBaseUrl": "https://api.example.eu/index.php",
  "frontendDomain": "https://www.example.com"
}
```

Browser ruft `api.example.eu` direkt auf → CORS + Query-Key nötig.

### B — Same-Origin-Proxy

```json
{
  "apiBaseUrl": "/api2",
  "apiBackendUrl": "https://api.example.eu/index.php",
  "frontendDomain": "https://www.example.com"
}
```

Browser ruft `www.example.com/api2/...` auf → kein CORS.

## Checks nach Upload

### 1. Statische Assets

```powershell
curl.exe -sI "https://www.example.com/"
curl.exe -sI "https://www.example.com/robots.txt"
curl.exe -sI "https://www.example.com/.htaccess"
```

- `index.html` → 200
- `.htaccess` sollte **nicht** öffentlich lesbar sein (403/404)

### 2. SPA-Routing

Browser: Deep-Link z. B. `/projects` — kein 404 von Apache.

### 3. API im Browser (DevTools → Network)

| Setup | Erwartetes Request-Muster |
|-------|---------------------------|
| Cross-Origin | `GET https://api.../index.php/all_projects?api_key=...` |
| Proxy | `GET https://www.../api2/all_projects` (+ ggf. Header) |

**Warnsignal:** Cross-Origin-Setup sendet noch `API-Key`-Header → altes Frontend-Bundle.

### 4. Chunk-Inhalt (optional)

Im gebauten JS sollte bei Cross-Origin **nicht** nur Header-Logik ohne Query-Key dominieren. Nach Deploy: Hard-Refresh (Ctrl+F5).

## Assert im Build

Das Skript ruft `Assert-FrontendDeployPackage` auf:

- Favicons, `robots.txt`, `sitemap.xml`, `.htaccess`, Logos

## Typische Fehler

| Symptom | Ursache |
|---------|---------|
| Leere Projektliste, CORS-Fehler | Altes Bundle ohne `API_KEY_IN_QUERY` |
| 404 auf `/api2/...` | Proxy-`.htaccess` fehlt oder `apiBackendUrl` falsch |
| 401 | `API_KEY` im Bundle ≠ REST `API_KEY_FE` |
| Mixed Content | `http://` API-URL auf `https://` Frontend |

## Root-Assets

Quelle: `applications/frontend/src/assets/root/`  
Deploy kopiert nach Document Root — siehe `Deploy-Helpers.ps1` → `Copy-FrontendRootAssets`.
