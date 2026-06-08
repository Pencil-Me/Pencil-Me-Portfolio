# ADR-001: API-Zuständigkeiten

**Status:** Umgesetzt  
**Datum:** 2026-05-29  
**Sunset abgeschlossen:** 2026-05-29  
**Kontext:** [04-architecture.md](../refactoring/04-architecture.md)

## Kontext

Zwei Backend-Implementierungen (PHP `/api2`, Python `/api`) bedienten überlappende Read-Endpunkte. Mail konnte über die PHP-Proxy-Kette oder direkt über Flask-Mail laufen. Das erhöhte Wartungsaufwand und Verhaltens-Drift.

## Entscheidung

1. **Reads fürs Angular-Frontend** ausschließlich über PHP `/api2` (`fe_key`)
2. **Writes (Admin-CRUD)** ausschließlich über Python `/api` (`be_key`) — Vue Admin
3. **Kontakt-Mail** ausschließlich über PHP-Kette: `POST /api2/send_email` → `php-mailer-api`
4. ~~Flask-Endpunkte `GET /all_*`, `GET /get_project/<id>`, `PUT /send_email`~~ — **entfernt** (Sunset umgesetzt)

## API-Rollen

| API | Pfad | Verantwortung | Key |
|-----|------|---------------|-----|
| PHP REST | `/api2` | Öffentliche Reads, Kontakt-Mail-Proxy, Health | `fe_key` |
| Python Flask | `/api` | Admin CRUD, Metadaten (`*_types`) | `be_key` |
| PHP Mailer | `/mailer` | SMTP-Versand (intern) | `fe_key` |

## Konsequenzen

- Deprecated Python Read-/Mail-Routen und `*_fe`-Repository-Code entfernt
- Python-Config benötigt nur noch `API_KEY_BE` (kein `API_KEY_FE`, kein `MAIL_*`)
- Fehlerantworten vereinheitlicht auf `{ "message": "..." }` + HTTP-Status (Erfolg: Roh-JSON wie bisher)
- OpenAPI-Spec pro API (`openapi.yaml`) als Contract-Referenz; Lint via Spectral in Drone
- Shared Domain unter `applications/shared/domain/` für Enum-Namen

## Breaking-Change-Policy (Contract)

- **PHP Public API (`/api2`):** Nur additive Änderungen an Read-Endpunkten ohne Major-Version-Bump; Felder nicht entfernen ohne Deprecation-Zyklus
- **Python Admin API (`/api`):** CRUD-Pfade stabil halten; Response-Shape `{ "message": "..." }` bei Fehlern nicht ändern
- **Enums:** Kanonische Werte in `applications/shared/domain/portfolio-domain.json`; API-Änderungen dort zuerst dokumentieren

## Timeline Entfernung deprecated Python-Routen

| Meilenstein | Ziel | Status |
|-------------|------|--------|
| 2026-05-29 | Deprecation-Header + Dokumentation | ✅ |
| Release-Zyklus | Production-Logs prüfen (kein App-Consumer im Repo) | ✅ (Repo-Inventur) |
| 2026-05-29 | Routen und `*_fe`-Repository-Methoden entfernen | ✅ |

## Verweise

- Umsetzung: [17-architecture-sunset.md](../refactoring/17-architecture-sunset.md)
- Consumer-Matrix: [04-architecture.md](../refactoring/04-architecture.md#phase-1--inventarisierung)
- OpenAPI: `applications/php-rest-api/openapi.yaml`, `applications/python-rest-api/openapi.yaml`
