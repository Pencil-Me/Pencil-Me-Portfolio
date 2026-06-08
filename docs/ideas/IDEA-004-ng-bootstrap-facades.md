# IDEA-004 — ng-bootstrap Facades

| Feld | Wert |
|------|------|
| Priority | P2 |
| Status | open |
| Impact | D-20 umsetzen; Vendor-Austausch ohne Feature-Refactor |
| Risk | Low–Medium — schrittweise Migration |
| Effort | M |
| Source | D-20 third-party facade |

## Beschreibung

Direkte `Ngb*`-Imports in `modules/` identifizieren und in `shared/components/pm-*` wrappen (z. B. `PmModalComponent`).

## Nächste Aktion

- Grep `@ng-bootstrap` in `applications/frontend/src/app/modules/`
- Facade pro Widget-Typ anlegen
