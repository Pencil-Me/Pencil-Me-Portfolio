# Technische Schulden (kompakt)

Vollständige Refactoring-Notizen: lokal `docs/refactoring/` (gitignored).  
Kern aus Roadmap 2026-05-29 — Status ✅ = abgearbeitet laut Docs.

## Bewusste Architektur-Trade-offs

| Thema | Status | Hinweis |
|-------|--------|---------|
| Statische API-Keys (kein JWT) | offen | FE-Key im Bundle sichtbar — Scope read-only |
| Admin nur Docker + Basic Auth | offen | Shared Hosting ohne Vue/Python |
| Python API Sunset Reads | ✅ | ADR-001, deprecated routes entfernt |

## Abgeschlossene Blöcke (P0–P3 + Follow-ups)

- ✅ P0 Security, P1 CI, P1 Vue-Admin Cleanup
- ✅ P2 Architektur/API-Konsolidierung, PHP/Python härten
- ✅ P3 Docker/DevOps
- ✅ Vue Admin Follow-ups (08–15)
- ✅ PHP REST Follow-up (16), Python Sunset (17), Python Quality (18)
- ✅ Cross-Stack CI (19), Angular Quality (20), Mailer Quality (21)
- ✅ Security Audit (22) + Remediation (23)

## Offen / laufend (Production)

| Item | Priorität | Ort |
|------|-----------|-----|
| Mailer Production-Deploy | hoch | `production-state.md` |
| Frontend Bundle mit `API_KEY_IN_QUERY` | hoch | verify-frontend-deploy skill |
| `ping.php`/`test.php` vom Server | mittel | nach Smoke |
| API-Key-Rotation (Historie `backend/.env`) | mittel | `.ai-brain/sops/secrets-and-git.md` |
| Rate-Limit `/api2` (Gateway) | niedrig | nur Docker-Pfad |

## Shared-Hosting-spezifisch (neu gelöst)

- ✅ CORS + `.env.prod`-Priorität
- ✅ Schlankes REST-Paket (~41 Dateien)
- ✅ `.env.dev` nicht in `deploy/out`

## Bei neuer Schuld

1. Eintrag hier (1 Zeile + Priorität)
2. Optional Detail in `docs/refactoring/` (lokal)
3. Architektur-Entscheidung → `decisions.md` + `docs/adr/`
