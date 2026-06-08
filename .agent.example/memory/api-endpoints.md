# REST API — Endpunkte (öffentlich)

Basis Production: `https://api.example.eu/index.php`  
Basis lokal Gateway: `http://localhost:8080/api2`  
Basis lokal direkt: `http://localhost:3003/index.php`

## Lesen (fe_key)

| Pfad | Methode | Auth |
|------|---------|------|
| `/all_projects` | GET | `fe_key` (Header oder `?api_key=`) |
| `/all_techstacks` | GET | `fe_key` |
| `/all_customers` | GET | `fe_key` |
| `/project/{id}` | GET | `fe_key` |

## Schreiben / System

| Pfad | Methode | Auth | Hinweis |
|------|---------|------|---------|
| `/send_email` | POST | `fe_key` | Kontaktformular → Mailer |
| `/healthcheck` | GET | `fe_key` | Prüft DB + Mailer |

## Mailer (separate Subdomain)

Basis: `https://mapi.example.eu/index.php`

| Pfad | Methode | Auth | Client |
|------|---------|------|--------|
| `/healthcheck` | GET | — | Öffentlich / Monitoring |
| `/send_email` | POST | `be_key` | Nur REST API (Server-zu-Server) |

## Pfad-Parsing

`RequestPath::parse()` — Pfad aus `REQUEST_URI`, Query-String wird abgeschnitten.  
Shared Hosting: oft `/index.php/all_projects` oder Rewrite zu `/all_projects`.

## Beispiel-Requests (Production, Cross-Origin)

```powershell
# Projekte (Query-Key, kein Preflight)
curl.exe -s "https://api.example.eu/index.php/all_projects?api_key=<API_KEY_FE>"

# Mit CORS-Header-Check
curl.exe -s -I -H "Origin: https://example.com" `
  "https://api.example.eu/index.php/all_techstacks?api_key=<API_KEY_FE>"

# Kontakt (POST)
curl.exe -s -X POST -d "name=A&email=a@b.de&message=Hi&api_key=<API_KEY_FE>" `
  "https://api.example.eu/index.php/send_email"
```

## Deprecated / nicht für Public-Frontend

- Python `/api` — Vue-Admin
- Vue-Admin-Routen unter `/backend`
