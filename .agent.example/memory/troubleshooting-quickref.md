# Troubleshooting — Quick Reference

| Symptom | Erste Aktion | Skill |
|---------|--------------|-------|
| Browser CORS, curl OK | `test.php?format=json` + Origin-Header | [debug-rest-api-cors](../skills/debug-rest-api-cors.md) |
| API HTTP 500 (HTML) | API-`.htaccess` auf Rewrite-only | [shared-hosting](shared-hosting.md) |
| `allowed_origins: []` | `ping.php` → `env_file_used`, `.env.dev` löschen | [debug-rest-api-cors](../skills/debug-rest-api-cors.md) |
| Projekte laden nicht | Network-Tab: Query-Key? CORS? | [verify-frontend-deploy](../skills/verify-frontend-deploy.md) |
| Kontaktformular tot | REST healthcheck → Mailer healthcheck | [debug-contact-form](../skills/debug-contact-form.md) |
| Mailer 401 | `MAIL_API_KEY` vs `API_KEY_BE` | [deploy-mailer](../skills/deploy-mailer.md) |
| Deploy out zu groß | REST ~41 Dateien? | [deploy-shared-hosting](../skills/deploy-shared-hosting.md) |
| Commit unsicher? | `git status`, keine `.env.prod` | [secrets-and-git](../skills/secrets-and-git.md) |

## 30-Sekunden Production-Check

```powershell
curl.exe -s "https://api.example.eu/ping.php"
curl.exe -s "https://api.example.eu/index.php/all_projects?api_key=<API_KEY_FE>"
curl.exe -s "https://mapi.example.eu/index.php/healthcheck"
```

## Eskalation

1. Diagnose-Dateien temporär deployen (`ping.php`, `test.php`)
2. Fix im Repo
3. `deploy/build-shared-hosting.ps1` → gezieltes Paket hochladen
4. Diagnose-Dateien vom Server löschen
5. `memory/session-log.md` aktualisieren
