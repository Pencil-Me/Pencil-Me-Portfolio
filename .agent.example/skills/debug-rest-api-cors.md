# Skill: REST API & CORS debuggen

## Wann nutzen

- Browser: CORS-Fehler, leere API-Daten
- `curl` liefert JSON, Browser nicht
- API HTTP 500 (Apache-Fehlerseite)
- `allowed_origins: []` in Diagnose

## Stufe 1 — Kurzcheck

```powershell
curl.exe -s "https://api.example.eu/ping.php"
```

Erwartung:

```
env_file_used=.env.prod
.env.dev no
CorsHeaders.php yes
.env.prod yes
```

## Stufe 2 — CORS-Report

```powershell
curl.exe -s -H "Origin: https://example.com" -H "Referer: https://example.com/" `
  "https://api.example.eu/test.php?format=json"
```

Prüfen:

| Feld | Erwartung |
|------|-----------|
| `files.env_file_used` | `.env.prod` |
| `files..env.dev` | `false` |
| `cors.allowed_origins` | Frontend-Domains |
| `cors.origin_allowed` | `true` (mit Origin-Header) |
| `cors.apply_headers.response_headers` | `Access-Control-Allow-Origin: ...` |

Ohne `Origin`-Header: `origin_allowed: false` ist **normal**.

## Stufe 3 — Echter Endpunkt

```powershell
curl.exe -s -I -H "Origin: https://example.com" `
  "https://api.example.eu/index.php/all_techstacks?api_key=<API_KEY_FE>"
```

Erwartung: `access-control-allow-origin` + HTTP 200.

```powershell
curl.exe -s "https://api.example.eu/index.php/all_projects?api_key=<API_KEY_FE>"
```

## Entscheidungsbaum

```
HTTP 500 (Apache)?
  → API-.htaccess auf Rewrite-only prüfen, Header/SetEnv entfernen

allowed_origins leer?
  → .env.prod auf Server? env_file_used?
  → .env.dev auf Server löschen, neu deployen

origin_allowed false mit Origin?
  → ALLOWED_ORIGINS in .env.prod (exakt Schema+Host)

curl OK, Browser nicht?
  → Frontend nutzt noch API-Key-Header? → API_KEY_IN_QUERY deployen
  → Oder /api2-Proxy in deploy.config

OPTIONS 404?
  → Query-Key-Strategie (Fix A) oder /api2-Proxy (Fix B)
```

## Aufräumen

Nach erfolgreicher Analyse:

```
Server löschen: ping.php, test.php
```

## Code-Stellen

| Thema | Datei |
|-------|-------|
| Env-Priorität | `src/Inc/EnvLoader.php` |
| CORS | `src/Inc/CorsHeaders.php` |
| API-Key | `src/Inc/ApiKeyResolver.php` |
| Frontend Query-Key | `applications/frontend/.../api-client.service.ts` |
