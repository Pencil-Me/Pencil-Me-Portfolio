# Skill: Lokales Docker

## Zwei Modi

| Modus | Compose | Frontend API | CORS |
|-------|---------|--------------|------|
| **Gateway** (Standard) | `docker compose up` | `/api2` (gleiche Origin) | Nein |
| **Shared-Hosting-Sim** | `+ docker-compose.shared-hosting-sim.yml` | `http://localhost:3003/index.php` | Ja |

## Gateway-Stack

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- API via Nginx: http://localhost:8080/api2/...
- Mailer: intern (`pm-mailer_php`), Host-Port :3002 optional
- Vue-Admin / Python: Profile `gateway`

Frontend-Build-Arg: `BUILD_CONFIGURATION=docker`  
Env: `applications/frontend/src/environments/environment.docker.ts`

## Shared-Hosting-Simulation

```bash
docker compose -f docker-compose.yml -f docker-compose.shared-hosting-sim.yml up --build frontend php_api php_mailer db
```

- Frontend: http://localhost:8080
- REST direkt: http://localhost:3003/index.php
- Mailer: http://localhost:3002/index.php/healthcheck
- **Kein** Nginx-Gateway (Profile `gateway` deaktiviert)

Frontend-Build: `docker-shared-hosting` → `environment.docker-shared-hosting.ts`  
Env-Mounts: `docker/shared-hosting-sim/php-rest-api.env`, `php-mailer.env`

## ng serve (:4200) ohne vollen Stack

```bash
# Terminal 1: mindestens nginx + php_api + db + mailer
docker compose up nginx php_api php_mailer db

# Terminal 2
cd applications/frontend && npm start
```

Proxy: `proxy.conf.json` → `localhost:8080/api2`

## Key-Sync lokal

Alle müssen übereinstimmen:

| Variable | Frontend | REST `.env.dev` | Mailer `.env.dev` |
|----------|----------|-----------------|-------------------|
| FE Key | `API_KEY` / `API_KEY_FE` | `API_KEY_FE` | — |
| BE Key | — | `MAIL_API_KEY` | `API_KEY_BE` |

Defaults: `secretApiFEkey` / `secretApiBEkey`

## Wann welchen Modus?

- **Gateway:** Alltags-Entwicklung, Admin, Python-API
- **Shared-Hosting-Sim:** CORS, Query-API-Key, Production-Parität vor Deploy
