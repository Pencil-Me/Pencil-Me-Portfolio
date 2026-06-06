# Frontend-Test — Statisches HTML

Minimaler Docker-Container mit Nginx und einer statischen HTML-Seite. Dient zum schnellen Testen der Container-Pipeline, **nicht** als Ersatz für das Angular-Frontend.

## Tech-Stack

- Statisches HTML (`index.html`)
- **Nginx** (Alpine)
- Docker

## Inhalt

`index.html` enthält nur einen Platzhalter (`STATIC TEST`). Keine API-Anbindung, kein Build-Schritt.

## Verwendung

```bash
docker build -t pm-frontend-test .
docker run -p 8081:80 pm-frontend-test
```

Der Container ist **nicht** Teil des Standard-`docker-compose.yml` im Repo-Root. Bei Bedarf manuell starten oder als separaten Service in Compose ergänzen.

## Wann nutzen?

- Nginx-/Docker-Setup verifizieren, ohne Angular-Build abzuwarten
- CI-Smoke-Test für „Container startet und liefert HTTP 200“

Für die eigentliche Portfolio-Website siehe [Frontend README](../frontend/README.md).

## Autor

**Johannes Kromer** — [github.com/Pencil-Me](https://github.com/Pencil-Me)
