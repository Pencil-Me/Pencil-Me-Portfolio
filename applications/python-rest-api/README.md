# Python REST API (Flask)

Admin-CRUD fuer die **Vue Admin-UI** unter **`/api`**. Das oeffentliche Angular-Frontend nutzt ausschliesslich die PHP API (`/api2`) — siehe [ADR-001](../../docs/adr/001-api-responsibilities.md).

## Tech-Stack

- **Python 3.12**
- **Flask** + flask-cors
- **PyMySQL** (Datenbank)
- Docker (Alpine)

## Endpunkte (Auszug)

Header fuer geschuetzte Routen: `API-Key: <be_key>`

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET/POST | `/project`, `/customer`, `/techstack` | Listen / Anlegen |
| GET/PUT/DELETE | `/project/<id>`, `/customer/<id>`, `/techstack/<id>` | Einzelressource |
| GET | `/project_types`, `/techstack_types` | Typen-Lookup |
| GET | `/healthcheck` | Health-Check (ohne Auth) |

Legacy Read-/Mail-Routen (`/all_*`, `/get_project`, `PUT /send_email`) wurden per ADR-001 entfernt — Ersatz: PHP `/api2`.

## Response-Contract

| Situation | Format |
|-----------|--------|
| Erfolg (CRUD Reads) | Roh-JSON |
| Erfolg (Create) | `{"message": "CREATED_SUCCESSFULLY"}` |
| Fehler | `{"message": "..."}` + HTTP-Status |

OpenAPI: [`openapi.yaml`](openapi.yaml)

## Konfiguration

Secrets liegen **nicht** in `config.py`, sondern in Umgebungsvariablen.

1. Vorlage kopieren:

```bash
cd source_code
cp .env.example .env
```

2. Werte in `.env` anpassen (DB, `API_KEY_BE`).

| Variable | Zweck |
|----------|-------|
| `APP_ENV` | `development` oder `production` |
| `DB_*` | MySQL-Verbindung |
| `API_KEY_BE` | Admin-API-Key (Vue Admin) |
| `BASE_URL` | leer = Root hinter Nginx `/api` |
| `ALLOWED_ORIGINS` | CORS-Whitelist (kommagetrennt), z. B. `http://localhost:8080,https://www.example.de` |

In Production nur die tatsächlichen Admin-Origins eintragen — kein `*`. Fehlende oder falsche Origins → Browser blockiert Admin-Requests (Doc 23).

Docker setzt Defaults in `docker-compose.yml`; fuer Production `APP_ENV=production` und echte Secrets verwenden.

## Lokale Entwicklung

```bash
cd source_code
pip install -r requirements.txt
python app.py
```

Standard-Port im Container: **8181** (intern). Ueber Nginx: `http://localhost:8080/api`.

## Docker

```bash
docker build -t pm-python-api .
```

Compose mountet `source_code/` nach `/app` fuer Live-Reload waehrend der Entwicklung.

Container: `pm-api_python`

## Tests & Qualitaet

```bash
cd source_code
pip install -r requirements.txt -r requirements-dev.txt
python -m pytest -q
python -m ruff check app.py configs module tests
python -m mypy configs module/helper
```

Tests: `/healthcheck`, API-Key-Auth, CRUD-Mocks (project, customer, techstack), Metadaten, Error-Handler, entfernte Legacy-Routen (404).

`PROPAGATE_EXCEPTIONS` ist in Production `False` (Fehler via Handler), in Tests `TESTING=True`.

**Repository-Schicht:** SQL-Auslagerung in `queries/` bewusst zurückgestellt (Doc 18 Stufe 3 optional).

## Refactoring

| Dokument | Inhalt |
|----------|--------|
| [06-python-api.md](../../docs/refactoring/06-python-api.md) | Basis (Config, pytest, ruff) |
| [17-architecture-sunset.md](../../docs/refactoring/17-architecture-sunset.md) | Legacy-Routen entfernt (ADR-001) |
| [18-python-api-followup.md](../../docs/refactoring/18-python-api-followup.md) | ruff/mypy, CRUD-Tests |

## Projektstruktur

```
source_code/
├── app.py
├── configs/                  # config.py, logging_config.py
├── module/helper/            # auth, error_handlers
├── tests/
├── requirements.txt
├── requirements-dev.txt
└── pyproject.toml            # ruff + mypy config
```

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
