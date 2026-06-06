# Portfolio Domain Contract

Gemeinsame Enum-Werte fuer PHP REST API, Angular-Frontend und Vue-Admin.

## Dateien

| Datei | Verbraucher |
|-------|-------------|
| `portfolio-domain.json` | Referenz / kuenftiges Codegen |
| `PortfolioDomain.php` | PHP REST API (optional einbinden) |
| `applications/frontend/src/app/shared/domain/portfolio-domain.ts` | Angular |

## Aenderungen

1. Wert in `portfolio-domain.json` anpassen
2. `PortfolioDomain.php` und `portfolio-domain.ts` synchron halten
3. DB-Seeds (`applications/db/init-scripts/dll.sql`) pruefen

Langfristig: OpenAPI-Spec aus der PHP-API ableiten und TS-Typen generieren.
