# Schlüsseldateien — Schnellreferenz

## Deploy & Config

| Datei | Rolle |
|-------|-------|
| `deploy/build-shared-hosting.ps1` | Haupt-Build |
| `deploy/Deploy-Helpers.ps1` | Copy, htaccess, Asserts |
| `deploy/deploy.config.local.json` | URLs, FTP (gitignored) |
| `deploy/deploy.config.example.json` | Vorlage |
| `deploy/templates/rest-api-root.htaccess` | Rewrite-only API |
| `deploy/templates/mailer-root.htaccess` | Mailer Rewrite |

## PHP REST API

| Datei | Rolle |
|-------|-------|
| `public/index.php` | Front-Controller, frühes CORS |
| `public/ping.php` | Kurz-Diagnose (temporär) |
| `public/test.php` | Voll-Diagnose (temporär) |
| `src/Inc/EnvLoader.php` | Env + `.env.prod`-Priorität |
| `src/Inc/CorsHeaders.php` | CORS Allow-Origin |
| `src/Inc/ApiKeyResolver.php` | Key: Header / Query / POST |
| `src/Inc/Config.php` | Bootstrap-Konfiguration |
| `src/Inc/Diag.php` | Diagnose-Report |
| `src/Inc/HttpClient.php` | Mailer-Aufrufe (curl) |
| `src/Inc/Router.php` | Routing + 401/404 CORS |
| `src/Controller/Api/MailController.php` | Kontakt → Mailer |
| `src/Controller/Api/HealthController.php` | Health + Mailer-Ping |
| `src/Inc/.env.prod` | Production-Secrets (gitignored) |

## PHP Mailer

| Datei | Rolle |
|-------|-------|
| `src/index.php` | Entry |
| `src/Inc/Config.php` | SMTP, API-Keys |
| `src/Inc/PhpmailerMailSender.php` | Versand |
| `src/Controller/Api/MailController.php` | `/send_email` |
| `src/Inc/.env.prod` | SMTP-Secrets (gitignored) |

## Angular Frontend

| Datei | Rolle |
|-------|-------|
| `.fallowrc.json` | Fallow: Entry, dupes, health |
| `docs/plans/code-quality-improvements.md` | Spec-driven Quality-Epic |
| `src/app/shared/constants/user-messages.ts` | Zentrale User-Messages |
| `src/app/shared/utils/api-error.util.ts` | HTTP-Fehler → UI-String |
| `src/app/shared/models/load-status.model.ts` | LoadStatus + `toErrorMessage` |
| `src/app/modules/projects/featured-projects.config.ts` | Featured-Filter + Mapping |
| `src/app/core/services/api/api-client.service.ts` | HTTP + Query-Key |
| `src/environments/environment.production.ts` | Manuelles Prod |
| `src/environments/environment.deploy.ts` | Deploy-generiert (gitignored) |
| `src/environments/environment.docker-shared-hosting.ts` | Cross-Origin-Sim |
| `src/assets/root/.htaccess` | SPA + optional Proxy |
| `angular.json` | Build-Konfigurationen |

## Docker

| Datei | Rolle |
|-------|-------|
| `docker-compose.yml` | Gateway-Stack |
| `docker-compose.shared-hosting-sim.yml` | Cross-Origin-Sim |
| `docker/shared-hosting-sim/*.env` | Sim-Env-Mounts |

## Agent-Kontext

| Datei | Rolle |
|-------|-------|
| `AGENTS.md` | Kurzindex |
| `.agent/README.md` | Vollständiger Einstieg |
