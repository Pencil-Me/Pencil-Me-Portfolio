# Portfolio Domain Contract

Gemeinsame Enum-Werte fuer PHP REST API, Angular-Frontend und Vue-Admin.

## Dateien

| Datei | Verbraucher |
|-------|-------------|
| `portfolio-domain.json` | Referenz / kuenftiges Codegen |
| `PortfolioDomain.php` | PHP REST API (optional einbinden) |
| `applications/frontend/src/app/shared/domain/portfolio-domain.ts` | Angular |
| `applications/backend/src/stores/index.ts` | Vue Admin (lokale Enums `projectType`, `techStackType`) |

## Kanonische Werte

Quelle: `portfolio-domain.json`

| Gruppe | Keys | Bedeutung (DE) |
|--------|------|----------------|
| `projectTypes` | `CUST`, `PRIV`, `FEST` | Projektarbeit, Private Projekte, Festanstellung |
| `techStackTypes` | `FEDEV`, `BEDEV`, … | Frontend/Backend/DevOps/… (siehe JSON) |
| `loadStatuses` | `PENDING`, `LOADING`, `COMPLETED`, `ERROR` | NgRx Load-State (Angular) |

Vue Admin mappt DB-IDs auf Labels ueber die gleichen Key-Namen in `stores/index.ts` — bei Aenderungen JSON + Vue-Enums synchron halten.

## Aenderungsprozess

1. Wert in `portfolio-domain.json` anpassen
2. `PortfolioDomain.php` und `portfolio-domain.ts` synchron halten
3. Vue `projectType` / `techStackType` Enums pruefen
4. DB-Seeds (`applications/db/init-scripts/dll.sql`) pruefen

Kein npm-Package noetig — nur Naming-Konsistenz und Docs.

## API-Bezug

- OpenAPI: `applications/php-rest-api/openapi.yaml`, `applications/python-rest-api/openapi.yaml`
- Architektur: `docs/adr/001-api-responsibilities.md`

Langfristig: OpenAPI-Enums aus `portfolio-domain.json` ableiten und TS-Typen generieren.
