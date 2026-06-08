# IDEA-005 — `modules/` → `views/` + `@views/*`

| Feld | Wert |
|------|------|
| Priority | P2 |
| Status | open |
| Impact | D-19 Zielstruktur; klarere Frontend-Architektur |
| Risk | Medium — viele Imports, Route-Loader |
| Effort | M |
| Source | D-19 frontend architecture |

## Beschreibung

Umbenennung `src/app/modules/` → `src/app/views/`, Path-Alias `@views/*`, `route-loaders` und Tests anpassen.

## Nächste Aktion

- Spec-driven Plan in `docs/plans/` anlegen
- Nicht mit kleinen Feature-Moves mischen
