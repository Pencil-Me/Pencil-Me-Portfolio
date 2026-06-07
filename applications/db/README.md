# Datenbank — MySQL

MySQL 8-Container mit Schema und Seed-Daten für das Portfolio. Wird von PHP REST API, Python API und phpMyAdmin genutzt.

## Tech-Stack

- **MySQL 8** (offizielles Docker-Image)
- Init-Skript: `init-scripts/dll.sql`

## Schema

Datenbankname: **`portfolio_db`**

| Tabelle | Inhalt |
|---------|--------|
| `customers` | Kunden (UUID, Name, Standort) |
| `projects` | Portfolio-Projekte (inkl. Highlight-Felder für Startseite) |

**Highlight-Seed (Startseite):** In `dll.sql` sind drei öffentliche Projekte mit `featured_rank` 1–3 vorbelegt (NetworX, Bordercontrol Kambodscha, Produktion-Manager). Alle übrigen Projekte haben `featured_* = NULL`.
| `techstack` | Technologien / Skills |
| `project_types`, `techstack_types` | Lookup-Tabellen |
| Verknüpfungstabellen | n:m zwischen Projekten, Kunden, Tech-Stack |

Das SQL-Dump enthält bereits Beispieldaten für die öffentliche Portfolio-Ansicht.

## Docker-Standardzugang

| Variable | Wert (Compose) |
|----------|----------------|
| `MYSQL_DATABASE` | `portfolio_db` |
| `MYSQL_USER` | `user` |
| `MYSQL_PASSWORD` | `test` |
| Root-Passwort | zufällig generiert (`MYSQL_RANDOM_ROOT_PASSWORD=yes`) |

Werte können über Root-`.env` (`DB_*`) überschrieben werden — dann auch im `db`-Healthcheck und phpMyAdmin anpassen.

phpMyAdmin (nur Dev, Compose-Profil `dev`): [http://localhost:8000](http://localhost:8000) (User `user` / Passwort `test`).

```bash
docker compose --profile dev up phpmyadmin
```

## Verwendung

### Mit docker-compose (empfohlen)

```bash
# Im Repo-Root — DB startet automatisch mit dem Stack
docker compose up --build

# Nur DB + phpMyAdmin (Dev)
docker compose --profile dev up db phpmyadmin
```

Port **3306** ist auf dem Host gemappt. Der Service `db` hat einen Healthcheck; `php_api` und `python_api` warten auf `service_healthy`.

### Einzeln bauen

```bash
docker build -t pm-db .
docker run -p 3306:3306 -v portfolio-data:/var/lib/mysql pm-db
```

## Daten persistieren

Compose nutzt das Volume `data` für `/var/lib/mysql`. Beim ersten Start führt MySQL alle Skripte in `/docker-entrypoint-initdb.d/` aus — danach nur bei leerem Volume erneut.

## Schema aktualisieren (Migrations-Strategie)

**Aktuell:** Init-only via `init-scripts/dll.sql` beim ersten Container-Start; inkrementelle SQL unter `init-scripts/migrations/`.

| Migration | Inhalt |
|-----------|--------|
| `001-techstack-type-projecttool.sql` | Typ-Code PROJECTTOOL |
| `002-project-featured-fields.sql` | Highlight-Spalten auf `projects` |
| `002-project-featured-fields-seed.sql` | Highlight-Texte (UTF-8, nach 002) |
| `003-project-detail-content-seed.sql` | Kurz- und Langtexte für Projektdetail |
| `005-project-story-fields-10y.sql` | Story-Felder (Tag, Ausgangslage, Rolle, Ergebnis) ab 2016 |

**Migration unter Windows:** SQL nicht per `Get-Content | docker exec` pipen (Umlaute werden zu `?`). Stattdessen `docker cp` + `mysql --default-character-set=utf8mb4 … source /tmp/….sql` (Kommentare in den Migrationsdateien).

| Szenario | Vorgehen |
|----------|----------|
| Lokale Dev-DB neu aufsetzen | Volume `data` löschen, `docker compose up db` |
| Schema-Änderung in Dev | SQL manuell per phpMyAdmin / CLI, oder Volume reset |
| Production | Geplante SQL-Migrationen oder Tool (Flyway/Liquibase) — noch nicht im Repo |

Empfehlung: Schema-Änderungen zuerst in `dll.sql` dokumentieren und in Dev testen; Production per kontrolliertem SQL-Deploy ausrollen.

## Shared Hosting

Das Deploy-Skript exportiert `portfolio_db.sql` nach `deploy/out/1-database/` — Import per phpMyAdmin auf dem Hoster. Siehe [deploy/README.md](../../deploy/README.md).

## Backups (Production)

- **Volume-Snapshot:** `docker run --rm -v pencil-me-portfolio_data:/data -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz /data`
- **Logical dump:** `docker exec pm-db mysqldump -u user -ptest portfolio_db > backup.sql`
- Backups regelmäßig und außerhalb des Hosts aufbewahren; Restore vor Deploy testen.

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
