# Domain Model — portfolio_db

Schema-Quelle: `applications/db/init-scripts/dll.sql`

## Kern-Entitäten

| Tabelle | Rolle |
|---------|-------|
| `projects` | Portfolio-Projekte (Titel, Texte, Featured-Felder) |
| `customers` | Auftraggeber / Kunden |
| `techstack` | Technologien |
| `project_type` | Projekttypen |
| `techstack_type` | Tech-Kategorien |

## Relationen

| Tabelle | Verknüpfung |
|---------|-------------|
| `project_customer` | n:m Projekte ↔ Kunden |
| `project_techstack` | n:m Projekte ↔ Techstack |
| `project_dates` | Zeitliche Zuordnung zu Projekten |

## API-Mapping (öffentlich)

| Endpunkt | Entität |
|----------|---------|
| `GET /all_projects` | `projects` (+ joins) |
| `GET /project/{id}` | `projects` |
| `GET /all_techstacks` | `techstack` |
| `GET /all_customers` | `customers` |

## Admin (Python / Vue)

Vollständiges CRUD auf allen Tabellen — nur Docker/Gateway-Pfad, nicht Shared Hosting.

## Migrations

- `applications/db/init-scripts/migrations/` — inkrementelle SQL
- Deploy: `deploy/out/1-database/portfolio_db.sql`
