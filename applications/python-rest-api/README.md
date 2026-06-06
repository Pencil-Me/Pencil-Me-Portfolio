# Python REST API (Flask)

Admin-CRUD fuer die **Vue Admin-UI** unter **`/api`**. Das oeffentliche Angular-Frontend nutzt ausschliesslich die PHP API (`/api2`) — siehe [ADR-001](../../docs/adr/001-api-responsibilities.md).

## Tech-Stack

- **Python 3.12**
- **Flask** + flask-cors + Flask-Mail
- **PyMySQL** (Datenbank)
- Docker (Alpine)

## Endpunkte (Auszug)

Header für geschützte Routen: `API-Key: <fe_key oder be_key>`

### Deprecated (`fe_key`) — nicht mehr ausbauen

| Methode | Pfad | Ersatz |
|---------|------|--------|
| GET | `/all_projects` | PHP `GET /api2/all_projects` |
| GET | `/get_project/<id>` | PHP `GET /api2/get_project/{id}` |
| GET | `/all_customers` | PHP `GET /api2/all_customers` |
| GET | `/all_techstacks` | PHP `GET /api2/all_techstacks` |
| PUT | `/send_email` | PHP `POST /api2/send_email` |

Antworten tragen `Deprecation: true` und `Sunset: 2026-08-01`.

### Admin CRUD (`be_key`) — aktiv

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET/POST | `/project`, `/customer`, `/techstack` | Listen / Anlegen |
| GET/PUT/DELETE | `/project/<id>`, `/customer/<id>`, `/techstack/<id>` | Einzelressource |
| GET | `/project_types`, `/techstack_types` | Typen-Lookup |
| GET | `/healthcheck` | Health-Check (ohne Auth) |

Entfernt aus aktiver Doku: `POST /send_email` (war falsch — Route ist `PUT`, deprecated).

## Response-Contract

| Situation | Format |
|-----------|--------|
| Erfolg (CRUD Reads) | Roh-JSON |
| Erfolg (Create) | `{"message": "CREATED_SUCCESSFULLY"}` |
| Fehler | `{"message": "..."}` + HTTP-Status |

OpenAPI: [`openapi.yaml`](openapi.yaml)

## Konfiguration

Secrets liegen **nicht** mehr in `config.py`, sondern in Umgebungsvariablen.

1. Vorlage kopieren:

```bash
cd source_code
cp .env.example .env
```

2. Werte in `.env` anpassen (DB, SMTP, API-Keys). Dieselben Keys wie in den PHP-`.env`-Dateien verwenden.

| Variable | Zweck |
|----------|-------|
| `APP_ENV` | `development` oder `production` |
| `DB_*` | MySQL-Verbindung |
| `MAIL_*` | SMTP für deprecated `/send_email` |
| `API_KEY_FE` / `API_KEY_BE` | API-Authentifizierung |
| `BASE_URL` | leer = Root hinter Nginx `/api` |

Docker setzt Defaults in `docker-compose.yml`; für Production `APP_ENV=production` und echte Secrets verwenden.

## Lokale Entwicklung

```bash
cd source_code
pip install -r requirements.txt
python app.py
```

Standard-Port im Container: **8181** (intern). Über Nginx: `http://localhost:8080/api`.

## Docker

```bash
docker build -t pm-python-api .
```

Compose mountet `source_code/` nach `/app` für Live-Reload während der Entwicklung.

Container: `pm-api_python`

## Tests & Qualität

```bash
cd source_code
pip install -r requirements.txt -r requirements-dev.txt
python -m pytest -q
ruff check app.py configs module/helper tests
```

Tests: `/healthcheck`, API-Key-Auth, Project-CRUD (Mock), Deprecation-Header.

## Projektstruktur

```
source_code/
├── app.py
├── configs/                  # config.py, logging_config.py
├── module/helper/            # auth, error_handlers, deprecation
├── tests/
├── requirements.txt
├── requirements-dev.txt
└── pyproject.toml            # ruff + mypy config
```

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
