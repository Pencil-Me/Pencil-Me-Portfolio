# Setup — Project Layer

Dieses Verzeichnis ist **committet** und dient als Template.

## Initialisierung

```powershell
# Im Repo-Root (einmalig pro Maschine)
Copy-Item -Recurse .agent.example .agent

# Optional: Production-URLs in .agent/memory/production-state.md anpassen
# Optional: deploy.config.local.json aus deploy.config.example.json
```

`.agent/` ist **gitignored** — lokaler Agent-Kontext.

## Symlink Portable Brain

```powershell
cmd /c mklink /D .ai-brain %USERPROFILE%\.ai-brain
```

Globaler Inhalt: `%USERPROFILE%\.ai-brain\` (einmal pflegen, alle Projekte nutzen Symlink).

## Nach Klon

1. `AGENTS.md` lesen
2. Symlink `.ai-brain` prüfen
3. `.agent` aus diesem Template kopieren
4. Nie Secrets in `.agent/` eintragen
