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
| `projects` | Portfolio-Projekte |
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

phpMyAdmin im Stack: [http://localhost:8000](http://localhost:8000) (User `user` / Passwort `test`).

## Verwendung

### Mit docker-compose (empfohlen)

```bash
# Im Repo-Root — startet db + phpmyadmin mit
docker compose up db phpmyadmin
```

Port **3306** ist auf dem Host gemappt.

### Einzeln bauen

```bash
docker build -t pm-db .
docker run -p 3306:3306 -v portfolio-data:/var/lib/mysql pm-db
```

## Daten persistieren

Compose nutzt das Volume `data` für `/var/lib/mysql`. Beim ersten Start führt MySQL alle Skripte in `/docker-entrypoint-initdb.d/` aus — danach nur bei leerem Volume erneut.

## Schema aktualisieren

1. Änderungen in `init-scripts/dll.sql` vornehmen
2. Volume löschen und Container neu starten (nur Dev!), **oder** Migration manuell per phpMyAdmin / CLI ausführen

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
