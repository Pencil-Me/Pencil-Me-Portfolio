# Projekt-Kontext

## Stack

| App | Tech | Port lokal (Docker) |
|-----|------|---------------------|
| Frontend | Angular 21 | :8080 (Container), :4200 (ng serve) |
| REST API | PHP 8.2+, schlankes `Inc/` | :3003 direkt, `/api2` via Nginx-Gateway |
| Mailer | PHP + PHPMailer | :3002 |
| DB | MySQL | :3306 |
| Vue Admin | Vite (optional) | Gateway-Profil |
| Python API | Flask (Legacy/Sunset) | Gateway-Profil |

## Repo-Layout (relevant für Deploy)

```
Pencil-Me-Portfolio/
├── AGENTS.md                 # Kurzindex Agent
├── .agent/                   # Persistenter Agent-Kontext (dieser Ordner)
├── applications/
│   ├── frontend/
│   ├── php-rest-api/         # public/ → API-Root auf Shared Hosting
│   ├── php-mailer-api/
│   └── db/
├── deploy/
│   ├── build-shared-hosting.ps1
│   ├── Deploy-Helpers.ps1
│   └── out/                  # gitignored — Upload-Artefakte
├── docker-compose.yml        # Gateway-Stack (/api2)
└── docker-compose.shared-hosting-sim.yml  # Cross-Origin-Simulation
```

## Umgebungsprofile Frontend

| Profil | Datei | API_BASE_URL |
|--------|-------|--------------|
| Dev (ng serve) | `environment.development.ts` | `/api2` (Proxy) |
| Docker Gateway | `environment.docker.ts` | `/api2` |
| Docker Shared-Hosting-Sim | `environment.docker-shared-hosting.ts` | `http://localhost:3003/index.php` |
| Production (Deploy) | `environment.deploy.ts` (generiert) | aus `deploy.config.local.json` |
| Production (manuell) | `environment.production.ts` | absolute API-URL |

## PHP REST — wichtige Inc-Dateien

| Datei | Rolle |
|-------|-------|
| `EnvLoader.php` | `.env.prod` priorisieren, Origins parsen (ohne Dotenv) |
| `CorsHeaders.php` | Frühes CORS vor Autoload |
| `ApiKeyResolver.php` | Key aus Header, Query, POST |
| `Diag.php` | Report für `test.php` |
| `HttpClient.php` | curl statt Guzzle (Mailer-Aufrufe) |

## Branch-Hinweis

Aktive Feature-Arbeit oft auf `feature/update-design` — vor Deploy/PR Branch prüfen.
