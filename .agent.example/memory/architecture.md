# Projektarchitektur

> Verbindlich: [docs/adr/001-api-responsibilities.md](../../docs/adr/001-api-responsibilities.md)

## Zwei Production-Wege

| Weg | Enthält | Dokumentation |
|-----|---------|---------------|
| **Shared Hosting** | Frontend, PHP REST, Mailer, DB | `deploy/README.md`, `.agent/skills/deploy-*` |
| **Docker Full Stack** | + Nginx Gateway, Vue Admin, Python API | Root-`README.md`, `.agent/skills/local-docker.md` |

## Gateway-Stack (Docker)

```
pm-middlenginx (:8080)
├── /           → Angular Frontend
├── /backend    → Vue Admin (be_key)
├── /api2       → PHP REST (fe_key) — öffentliche Reads + Mail-Proxy
├── /api        → Python Flask (be_key) — Admin CRUD
└── (mailer)    → PHP Mailer intern
         ↓
    MySQL portfolio_db
```

## API-Rollen (ADR-001)

| API | Pfad | Verantwortung | Key |
|-----|------|---------------|-----|
| PHP REST | `/api2` oder `api.*` | Reads, Kontakt, Health | `fe_key` |
| Python | `/api` | Admin CRUD | `be_key` |
| PHP Mailer | eigene Subdomain | SMTP | `be_key` (nur Server-zu-Server) |

## Shared Hosting (Production)

- Kein Vue/Python auf Hoster
- Cross-Origin: `example.com` → `api.example.eu`
- Optional Same-Origin: `/api2`-Proxy auf Hauptdomain

## Shared Domain

- `applications/shared/domain/portfolio-domain.json` — kanonische Enums
- OpenAPI: `applications/php-rest-api/openapi.yaml`, Python analog

## Frontend-Schichten (Angular)

**layout · view · feature · core · shared** — siehe `.agent/skills/frontend-architecture.md`

| Schicht | Pfad (Ist) |
|---------|------------|
| layout | `src/app/layout/` |
| view | `src/app/modules/` (Ziel: `views/`) |
| feature | z. B. `modules/projects/details`, `shared/components/featured-projects` |
| core | `src/app/core/`, `src/app/state/` |
| shared | `src/app/shared/` |

## Code-Platzierung (Colocation)

| Reichweite | Ort (Portfolio) |
|------------|-----------------|
| View-only Feature | `modules/<view>/…` oder `views/<view>/features/` |
| 2+ Views | `features/` oder `shared/components/` |
| Vue Admin | `views/<Feature>/` + `src/utils/` bei Mehrfachnutzung |
| Cross-App | `applications/shared/domain/` |

Vor neuem Code: **suchen**. Details: `.ai-brain/core/architecture.md#colocation-and-reuse`

## Portable Patterns

Generische Architektur: `.ai-brain/core/architecture.md`
