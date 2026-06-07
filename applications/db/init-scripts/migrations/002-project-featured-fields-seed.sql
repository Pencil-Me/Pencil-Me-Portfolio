-- Highlight-Seed fuer bestehende DB (UTF-8). Idempotent: nur UPDATE.
-- Bash:  mysql --default-character-set=utf8mb4 -u user -p portfolio_db < 002-project-featured-fields-seed.sql
-- PowerShell (Repo-Root, UTF-8 sicher via docker cp):
--   docker cp applications/db/init-scripts/migrations/002-project-featured-fields-seed.sql pm-db:/tmp/
--   docker exec pm-db mysql --default-character-set=utf8mb4 -u user -ptest portfolio_db -e "source /tmp/002-project-featured-fields-seed.sql"

SET NAMES utf8mb4;

UPDATE `projects` SET
  `featured_rank` = 1,
  `featured_tag` = 'Enterprise · Angular · Nx',
  `featured_problem` = 'Tausende Nutzer, internationale Programme — und eine Angular-Basis, die mitwachsen musste. Ohne Releases zu blockieren oder das Team auszubremsen.',
  `featured_role` = 'Senior Frontend im Nx-Monorepo: Angular-17-Migration geplant und umgesetzt, Jest/Cypress-Testpipeline, Mentoring für eigenständige Weiterentwicklung.',
  `featured_outcome` = 'Release-fähige Modernisierung live — das interne Team liefert heute auf der neuen Basis, testgesichert und ohne Dauerabhängigkeit von extern.'
WHERE `name` LIKE 'NetworX, als zentrales Verwaltungstool%';

UPDATE `projects` SET
  `featured_rank` = 2,
  `featured_tag` = 'GovTech · Interpol · Lead',
  `featured_problem` = 'An der Grenze zählt jede Sekunde: Reisepässe prüfen, Interpol-Abgleich für vermisste Dokumente — unter Last, mit sensiblen Behördendaten.',
  `featured_role` = 'Technical Lead Frontend: Interpol-Workflow designt und gebaut, Reporting ausgebaut, Architektur, Schulung vor Ort, direkter Kundenkontakt.',
  `featured_outcome` = 'Schnellere Grenzkontrollen, belastbares Reporting für Behörden — lokales Team geschult und betriebsbereit.'
WHERE `name` LIKE 'Weiterentwicklung Bordercontrol System für Kambodscha%';

UPDATE `projects` SET
  `featured_rank` = 3,
  `featured_tag` = 'Industrial IoT · SPS · Web',
  `featured_problem` = 'Steuerung am Schaltschrank reichte nicht: SPS, Python-Backend und Produktionsdruck verlangten eine bedienbare Web-Oberfläche — für Technik und Schicht verständlich.',
  `featured_role` = 'Frontend und Architektur: Angular-UI für die Anlage, Python-Anbindung, Live-Werksdarstellung mit Echtzeitdaten direkt vom Band.',
  `featured_outcome` = 'Bedienung am Band, Anlagenstatus auf einen Blick — weniger Wege zum Schaltschrank, mehr Transparenz für Produktion und Technik.'
WHERE `name` LIKE 'Produktion-Manager direkt im Werk%';
