# Roadmap (Projekt)

## Kurzfristig (Production)

- [ ] Mailer auf `mapi.*` deployen + Healthcheck
- [ ] Frontend neu deployen (Query-API-Key, CORS-Parität)
- [ ] Diagnose-Dateien vom API-Server entfernen
- [ ] Kontaktformular E2E auf Production

## Code Quality (Frontend)

- [ ] Phase A: Fallow dead-code, Featured-Filter, zentrale Error-Konstante
- [ ] Phase B: Branch-Coverage ≥ 78 %
- [ ] Phase C: PHP BaseController-Doku + Quality-Gates

## Mittelfristig

- [ ] API-Key-Rotation (nach Git-Historie-Review)
- [ ] Optional: Same-Origin `/api2`-Proxy auf Hauptdomain evaluieren
- [ ] OpenAPI Spectral in CI dauerhaft grün halten

## Langfristig / optional

- [ ] Vue Admin: Pinia-Migration (Follow-up 11)
- [ ] Python API: weiter reduzieren wenn Admin out-of-scope
- [ ] JWT nur wenn Shared Hosting + Admin Anforderung ändert sich

## Abgeschlossen (Referenz)

Große Refactoring-Welle 2026-05-29 — Details in `tech-debt.md`.

## AI-Wissenssystem

- [x] `.ai-brain/` global + Symlink
- [x] `.agent.example/` Template
- [x] `AGENTS.md` Bootstrap
- [ ] Team-Sync: `.agent.example` nach Klon ausfüllen → `.agent/`
