# Skill: Secrets & Git (Projekt)

> Generische Regeln: `.ai-brain/sops/secrets-and-git.md`

## Nie committen

| Pfad | Inhalt |
|------|--------|
| `applications/php-rest-api/src/Inc/.env.prod` | Prod API-Keys, DB-Passwort |
| `applications/php-mailer-api/src/Inc/.env.prod` | SMTP, API-Keys |
| `applications/*/src/Inc/.env.dev` | Lokale Dev-Env (gitignored) |
| `applications/backend/.env` | Vue `VITE_API_KEY` |
| `deploy/deploy.config.local.json` | URLs, FTP |
| `**/environment.deploy.ts` | Generiertes Frontend-Env mit echtem Key |
| `deploy/out/` | Build inkl. `.env.prod` |

## Darf committet sein (Dev-Defaults)

| Pfad | Hinweis |
|------|---------|
| `**/.env.example` | Platzhalter `secretApiFEkey`, `test` |
| `environment.development.ts` | Dev-Key `secretApiFEkey` |
| `environment.production.ts` | `REPLACE_BEFORE_DEPLOY` |
| `docker-compose.yml` | Default-Args mit Dev-Keys |

## Vor Commit prüfen

```powershell
git status --short
git diff --stat
git grep -n "qyQz\|apikey123\|secretkey456" HEAD  # keine Prod-Secrets in HEAD
```

Staged files auf `.env.prod`, `deploy.config.local.json`, `environment.deploy.ts` prüfen.

## Git-Historie (bekannt)

- `applications/backend/.env` mit `secretkey456` war in Initial-Commit — in `d9a1f49` entfernt, **noch in Historie**
- `.env.prod` mit echten DB-Passwörtern: **nicht** in Historie gefunden

## Agent-Regeln

- Keine Secrets in `.agent/` ablegen
- `test.php`/`ping.php`-Output mit maskierten Keys — OK
- SMTP-Hostnamen in `.env.prod` (z. B. `smtp.ionos.de`) sind Konfiguration, kein Commit-Risiko wenn Datei gitignored

## Nach Key-Rotation

`memory/production-state.md` und ggf. `session-log.md` aktualisieren — **ohne** Keys zu notieren.
