# Skill: Frontend-Architektur (Angular Portfolio)

Zielbild: klare Trennung **layout · view · feature · core · shared**.

Portable Ergänzung: `.ai-brain/skills/angular.md`

## Schichten

```text
app/
├── layout/     # Shell: BasicLayout, Navigation, Footer — kein Business-UI
├── views/      # Route-Seiten (dünn) — Zielordner; Ist: modules/
├── features/   # Domänen-UI/Logik-Slices — colocated oder cross-view
├── core/       # Singleton-Infra: API, Guards, Interceptors, Routing
├── shared/     # Mehrfach genutzte dumb UI, Utils, Directives, Constants
└── state/      # Globales NgRx (z. B. knowledge) — Infra-Nahe core
```

## Verantwortung

| Schicht | Was rein gehört | Was nicht |
|---------|-----------------|-----------|
| **layout** | `<router-outlet>`, Nav, Footer, Theme-Toggle | API-Calls, Feature-Logik, NgRx |
| **view** | Eine Route = eine View; komponiert Features; SEO-`data` am Route-Target | Schwere Mapper, wiederverwendbare Widgets |
| **feature** | Zusammenhängendes UI+Logik (Filter, Featured-Liste, Kontaktformular, Details) | App-weite Singletons |
| **core** | `ApiClientService`, `SeoGuard`, `route-loaders`, Interceptors | Feature-spezifische Models |
| **shared** | `user-messages`, `api-error.util`, generische Directives/Komponenten | Routen, Feature-State |

## Colocation

- **View-only Feature** → `views/<view>/features/<name>/` (oder bis Migration: unter `modules/<view>/`)
- **2+ Views** → `features/<name>/` oder `shared/components/<name>/` wenn rein presentational
- **2+ Apps** → nicht hier — `applications/shared/domain/`

## Ist-Zustand vs. Ziel (2026)

| Ziel | Aktuell (`applications/frontend/src/app/`) |
|------|------------------------------------------|
| `views/` | `modules/` (home, projects, contact, …) |
| `features/` | teils in `modules/.../details`, teils `shared/components/featured-projects` |
| `layout/` | `layout/` ✅ |
| `core/` | `core/` ✅ |
| `shared/` | `shared/` ✅ |

Neue Route-Seiten: bevorzugt unter `views/` anlegen, wenn Ordner existiert; sonst `modules/` konsistent halten bis Umbenennungs-Epic.

## Path-Aliases (`tsconfig`)

| Alias | Pfad |
|-------|------|
| `@layout/*` | `src/app/layout/*` |
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |
| `@modules/*` | `src/app/modules/*` (→ künftig `@views/*`) |

## Discover-first

Neue Seite: zuerst in `shared/`, `features/`, `modules/` suchen — nicht parallele Komponente bauen.

## Third-party facade

Drittparty-UI/Libs **nie** direkt in `modules/` (views) oder Features — immer Facade in `shared/` oder `core/`.

| Bereits Facade | Vendor dahinter |
|----------------|-----------------|
| `ApiClientService` | HTTP / API |
| `ThemeService` | Theme / `data-bs-theme` |
| `TextInput`, `SelectInput` (Vue Admin) | native / future UI kit |

**Neu:** z. B. `PmModalComponent` statt `NgbModal` in `projects.component.ts`.

## Verification

- View importiert Features/Shared — nicht umgekehrt
- Layout importiert nur Core/Shared — keine Feature-Imports
- Feature → Core/Shared/State ok; Feature → andere Feature nur über klare Public API
- Keine neuen `@ng-bootstrap/*` / Vendor-Imports in Views/Features
