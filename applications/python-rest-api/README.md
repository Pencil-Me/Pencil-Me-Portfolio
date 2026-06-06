# Python REST API (Flask)

Alternative REST-API mit vollständigem CRUD für die **Vue Admin-UI**. Das öffentliche Angular-Frontend nutzt primär die PHP API (`/api2`); diese Flask-API liegt unter **`/api`**.

## Tech-Stack

- **Python 3.12**
- **Flask** + flask-cors + Flask-Mail
- **PyMySQL** (Datenbank)
- Docker (Alpine)

## Endpunkte (Auszug)

Header für geschützte Routen: `API-Key: <fe_key oder be_key>`

### Frontend (`fe_key`)

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | `/all_projects` | Projekte (Frontend-Format) |
| GET | `/get_project/<id>` | Einzelprojekt |
| GET | `/all_customers` | Kunden |
| GET | `/all_techstacks` | Tech-Stack |

### Backend / CRUD (`be_key`)

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET/POST | `/project`, `/customer`, `/techstack` | Listen / Anlegen |
| GET/PUT/DELETE | `/project/<id>`, `/customer/<id>`, `/techstack/<id>` | Einzelressource |
| GET | `/project_types`, `/techstack_types` | Typen-Lookup |
| POST | `/send_email` | E-Mail (Flask-Mail) |

## Konfiguration

Vorlage: `source_code/configs/config.example.py` → `source_code/configs/config.py`

```python
dbconfig = {
    "host": "pm-db",
    "port": "3306",
    "username": "user",
    "password": "test",
    "database": "portfolio_db",
}

api_keys = {
    "fe_key": "secretApiFEkey",
    "be_key": "secretApiBEkey",
}

baseurl = ""   # leer = Root; hinter Nginx /api wird der Pfad gestrippt
```

Mail-Konfiguration (`mailconfig`) für `/send_email` ebenfalls in `config.py`.

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

## Projektstruktur

```
source_code/
├── app.py                    # Flask-App, Routing
├── configs/config.py         # DB, Mail, API-Keys
├── module/
│   ├── projects/
│   ├── customers/
│   └── techstack/
└── requirements.txt
```

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
