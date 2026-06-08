# IDEA-007 — Vue Admin `http-client` testen

| Feld | Wert |
|------|------|
| Priority | P2 |
| Status | open |
| Impact | Service-Coverage; optional wieder in Vitest-Scope |
| Risk | Medium — Fallow health + Vitest v8 JSON |
| Effort | S |
| Source | vue-admin-fallow-vitest Phase 2 |

## Beschreibung

Integration-Test für `http-client.ts` an Service-Grenze; prüfen ob Coverage-Exclude in `vitest.config.ts` noch nötig ist.

## Nächste Aktion

- Spec mit `vi.mock` axios oder Test-Double
- `npm run quality:ci` inkl. Fallow health
