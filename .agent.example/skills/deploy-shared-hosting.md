# Skill: Shared-Hosting Deploy

## Wann nutzen

Upload von Frontend, REST API, Mailer oder DB auf Production-Shared-Hosting.

## Voraussetzungen

- [ ] `deploy/deploy.config.local.json` (aus `deploy.config.example.json`)
- [ ] `applications/php-rest-api/src/Inc/.env.prod` mit echten Keys/DB/SMTP
- [ ] `applications/php-mailer-api/src/Inc/.env.prod` mit SMTP + `API_KEY_BE`
- [ ] `MAIL_API_KEY` (REST) = `API_KEY_BE` (Mailer)

## Build

```powershell
Set-Location D:\PHPStorm-Projects\Pencil-Me-Portfolio
.\deploy\build-shared-hosting.ps1
```

Schnell (ohne npm/composer):

```powershell
.\deploy\build-shared-hosting.ps1 -SkipNpmInstall -SkipComposer
```

Nur API:

```powershell
.\deploy\build-shared-hosting.ps1 -SkipFrontend -SkipMailer -SkipDatabase -SkipNpmInstall -SkipComposer
```

## Pre-Upload Checks

```powershell
# Keine .env.dev im Paket
Get-ChildItem deploy\out -Recurse -Filter ".env.dev" -File

# REST-Paketgröße (~41 Dateien)
(Get-ChildItem deploy\out\3-rest-api -Recurse -File).Count
```

Erwartung: **0** `.env.dev`-Dateien; REST ~41 Dateien.

## Upload-Reihenfolge

1. `1-database/portfolio_db.sql` → phpMyAdmin
2. `2-mailer/` → Mailer Document Root
3. `3-rest-api/` → API Document Root
4. `4-frontend/` → Hauptdomain Document Root

## Nach Upload

Siehe [debug-rest-api-cors.md](debug-rest-api-cors.md) und [../memory/production-state.md](../memory/production-state.md).

## Nicht tun

- Gesamtes `applications/php-rest-api/src/` hochladen (enthält lokal `.env.dev`)
- `.env.dev` manuell auf Server legen
- API-`.htaccess` mit `Header`/`SetEnv` erweitern
- `deploy.config.local.json` oder `.env.prod` committen
