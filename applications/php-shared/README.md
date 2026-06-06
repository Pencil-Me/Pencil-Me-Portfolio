# PHP Shared Code — Entscheidung

**Stand:** 2026-05-29 · siehe [ADR-001](../../docs/adr/001-api-responsibilities.md)

## Router-Duplikation

`php-rest-api` und `php-mailer-api` haben jeweils eine eigene `Inc/Router.php` (nahezu identisch).

| Option | Entscheidung |
|--------|--------------|
| **A:** Fix in beiden Kopien | **Kurzfristig aktiv** (P0 Auth, `hash_equals` — erledigt) |
| **B:** Composer-Package `php-shared` | Mittelfristig, wenn ein dritter PHP-Service dazukommt |
| **C:** Symlink / Monorepo-Pfad | Nicht gewählt (Docker-Build-Komplexität) |

## Sync-Regel bis Option B

Bei Router-Änderungen **beide** Dateien anpassen:

- `applications/php-rest-api/src/Inc/Router.php`
- `applications/php-mailer-api/src/Inc/Router.php`

Gemeinsame Hilfsklassen (z. B. `RequestPath`) dürfen pro Service dupliziert werden — kein Package-Zwang.
