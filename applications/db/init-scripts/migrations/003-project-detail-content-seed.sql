-- Kurz- und Langtexte fuer Projektdetail (UTF-8). Idempotent: nur UPDATE.
-- PowerShell: docker cp ... pm-db:/tmp/ && mysql --default-character-set=utf8mb4 ... source

SET NAMES utf8mb4;

UPDATE `projects` SET
  `content_short` = 'Zentrales Verwaltungstool für internationale Programme — Angular-Modernisierung im Nx-Monorepo mit Kubernetes-Deployment.',
  `content_long` = 'NetworX bündelt internationale Programme in einem zentralen Verwaltungstool — mit wachsendem Nutzerkreis und einem Team, das parallel weiterliefern musste. Mein Fokus lag auf der Frontend-Modernisierung im Nx-Monorepo: Planung und Umsetzung der Angular-17-Migration, Einführung einer belastbaren Teststrategie mit Jest und Cypress sowie Mentoring interner Entwickler. Die Applikation läuft in einer Azure-/Octane-Umgebung mit Deployment über Kubernetes und Argo — Releases durften den laufenden Betrieb nicht bremsen.'
WHERE `name` LIKE 'NetworX, als zentrales Verwaltungstool%';

UPDATE `projects` SET
  `content_short` = 'Bordercontrol-System mit Interpol-Anbindung — Technical Lead für Frontend, Architektur und Einsatz vor Ort.',
  `content_long` = 'Das Bordercontrol-System verarbeitet Grenzdokumente unter hohem Zeitdruck — für Behörden mit sensiblen Daten und klaren Anforderungen an Verfügbarkeit. Als Technical Lead Frontend habe ich Workflow-Optimierungen umgesetzt, die Interpol-Integration zur Prüfung lost/stolen-Dokumente designt und gebaut, das Reporting ausgebaut und Architekturentscheidungen begleitet. Vor Ort habe ich das lokale Team geschult und Features eng mit dem Kunden abgestimmt.'
WHERE `name` LIKE 'Weiterentwicklung Bordercontrol System für Kambodscha%';

UPDATE `projects` SET
  `content_short` = 'Steuerung einer Produktionsanlage per Web — Angular-Frontend mit Python-Anbindung und Live-SPS-Daten.',
  `content_long` = 'In der Produktion zählt jede Sekunde — Steuerung und Überblick mussten aus dem Browser bedienbar sein, nicht nur am Schaltschrank. Ich habe die Angular-Oberfläche mit Screens für Anlagensteuerung und Werksdarstellung umgesetzt, die Python-Schnittstelle zur SPS eingebunden und eine vielschichtige Datenarchitektur für Echtzeitwerte am Band aufgebaut. Produktion und Technik sehen den Status heute zentral — ohne Umwege über die Maschinenlogik.'
WHERE `name` LIKE 'Produktion-Manager direkt im Werk%';
