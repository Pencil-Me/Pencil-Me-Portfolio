-- Story-Felder (Tag, Ausgangslage, Rolle, Ergebnis) fuer oeffentliche Projekte ab 2016.
-- featured_rank bleibt unberuehrt (nur Startseite 1-3). UTF-8 via docker cp.

SET NAMES utf8mb4;

UPDATE `projects` SET
  `featured_tag` = 'Enterprise · Angular · NgRx',
  `featured_problem` = 'Neues Data-Intake neben dem etablierten Verwaltungstool — strukturierte Erfassung musste schnell produktionsreif werden.',
  `featured_role` = 'Senior Frontend: Angular 15, NgRx, PrimeNG, Jest/Cypress und Deployment über Kubernetes/Argo.',
  `featured_outcome` = 'MVP live im Azure-Stack — validierte Erfassungs-UI für internationale Programme.'
WHERE `id` = 2;

UPDATE `projects` SET
  `featured_tag` = 'Fintech · Angular · Lead',
  `featured_problem` = 'Finanzprodukt mit wachsenden Anforderungen — Frontend musste stabil bleiben und testbar weiterentwickelt werden.',
  `featured_role` = 'Frontendentwickler und Technical Lead: Angular 13, UI-Patterns, automatisierte Tests, Schulung im Team.',
  `featured_outcome` = 'Belastbare Release-Basis — das Team liefert eigenständig weiter.'
WHERE `id` = 21;

UPDATE `projects` SET
  `featured_tag` = 'PropTech · AngularJS',
  `featured_problem` = 'Legacy-Makler-Tool unter Feature-Druck — Erweiterungen ohne Rewrite, aber mit sauberer UI.',
  `featured_role` = 'Senior Frontend/Webdesign: AngularJS-Weiterentwicklung, konsistente Oberflächen, Abstimmung mit Produkt.',
  `featured_outcome` = 'Neue Funktionen im Bestandssystem — ohne Betriebsunterbrechung.'
WHERE `id` = 22;

UPDATE `projects` SET
  `featured_tag` = 'Social · Vue · Architecture',
  `featured_problem` = 'Plattform-Modernisierung unter Traffic und Design-Ansprüchen — die Frontend-Architektur musste tragfähig werden.',
  `featured_role` = 'Frontendarchitekt und Technical Lead: Vue 2.5, UI-Systeme, Design-Support, Symfony-Nebenpfad.',
  `featured_outcome` = 'Wartbare Frontend-Basis — Design und Entwicklung auf gemeinsamen Patterns.'
WHERE `id` = 23;

UPDATE `projects` SET
  `featured_tag` = 'GovTech · Vue · Border',
  `featured_problem` = 'Grenzkontrolle Thailand — Workflows und Offline-Fähigkeit mussten unter Feldbedingungen zuverlässiger werden.',
  `featured_role` = 'Frontend: Vue-Workflows, Refactoring der Kamera- und Gesichtserkennungs-Pipeline, Offline-Mode.',
  `featured_outcome` = 'Stabilere Grenzprozesse — weniger Ausfälle bei der Dokumentenbearbeitung.'
WHERE `id` = 24;

UPDATE `projects` SET
  `featured_tag` = 'GovTech · Biometrics',
  `featured_problem` = 'Import von Latent-Karten in ein biometrisches Behörden-System — UI und Deployment mussten zusammenpassen.',
  `featured_role` = 'Frontend: spezialisierte Import-View, Deployment-Pipeline mit APEX Nitro.',
  `featured_outcome` = 'Reproduzierbare Releases — Import-Workflow produktiv im Einsatz.'
WHERE `id` = 26;

UPDATE `projects` SET
  `featured_tag` = 'Enterprise · Java · Webpack',
  `featured_problem` = 'Interner Showcase sollte Technologie und UX überzeugend demonstrieren — von Mockup bis lauffähiger Demo.',
  `featured_role` = 'Technischer Berater und Entwickler: Mockups, Spring/Thymeleaf, Webpack-Frontend.',
  `featured_outcome` = 'Überzeugende Demo-Oberfläche — Brücke zwischen Designvorstellung und Umsetzung.'
WHERE `id` = 28;

UPDATE `projects` SET
  `featured_tag` = 'Banking · White-Label · C#',
  `featured_problem` = 'Mehrere Banken, ein Framework — individuelle Markenauftritte ohne parallele Codebasen pflegen.',
  `featured_role` = 'Frontend/Webdesign: C#-Framework-Anpassung, responsive UI, Mockups, PDF-Automatisierung.',
  `featured_outcome` = 'Skalierbare White-Label-Oberflächen — schnellere Rollouts pro Bank.'
WHERE `id` = 29;

UPDATE `projects` SET
  `featured_tag` = 'Marketing · Grunt · PHP',
  `featured_problem` = 'Multilinguale Kampagnen und HTML-Emails — manuelle Prozesse sollten automatisierbar werden.',
  `featured_role` = 'Frontend und Technischer Berater: Landingpages, Grunt/Gulp-Pipelines, Gemini-API mit OAuth2.',
  `featured_outcome` = 'Wiederholbare Build-Prozesse — Marketing kann Kampagnen schneller ausrollen.'
WHERE `id` = 30;

UPDATE `projects` SET
  `featured_tag` = 'Private · Game Dev · AI',
  `featured_problem` = 'Bewusste Vertiefung in Game AI und Simulation — Lernfeld ohne Kundenprojekt, aber mit hohem Architektur-Nutzen.',
  `featured_role` = 'Entwickler: Unity, State Machines bis GOAP/Utility AI, Smart Objects, Ökosystem-Simulation.',
  `featured_outcome` = 'Tieferes Verständnis für Systemarchitektur — übertragbar auf Web- und IoT-Projekte.'
WHERE `id` = 33;

UPDATE `projects` SET
  `featured_tag` = 'DevOps · Homelab · Docker',
  `featured_problem` = 'DevOps- und Infrastruktur-Themen brauchen eine sichere Sandbox — nicht im Kundenprojekt experimentieren.',
  `featured_role` = 'Architekt und Betreiber: Proxmox, Docker, Pi-hole, Home Assistant, GitLab, IaC-Experimente.',
  `featured_outcome` = 'Laufende Lernumgebung — direkter Nutzen für Portfolio und Infrastruktur-Entscheidungen.'
WHERE `id` = 40;

UPDATE `projects` SET
  `featured_tag` = 'Music · PHP · Fullstack',
  `featured_problem` = 'Die Band brauchte eine professionelle Online-Präsenz — schlank, pflegbar, mit Backend für Inhalte.',
  `featured_role` = 'Webdesign und Fullstack: Frontend, PHP/MySQL-API für die Vorstellungspage.',
  `featured_outcome` = 'Live-Auftritt hiddentracks-berlin.de — Grundlage für den Relaunch 2024.'
WHERE `id` = 41;

UPDATE `projects` SET
  `featured_tag` = 'Banking · White-Label · C#',
  `featured_problem` = 'Kontowechsel für diverse Banken — ein Framework, viele Marken, mobile Nutzer im Fokus.',
  `featured_role` = 'Frontend-Berater: responsive C#-UI, Mockups, Landingpages, PDF-Formulare mit Auto-Befüllung.',
  `featured_outcome` = 'Einheitliche UX über Banken hinweg — weniger Einzelentwicklung pro Institut.'
WHERE `id` = 42;

UPDATE `projects` SET
  `featured_tag` = 'Automotive · Realtime · Socket.io',
  `featured_problem` = 'Webspecial mit Roboterkamera — Echtzeitsteuerung und Premium-Präsentation unter Live-Druck.',
  `featured_role` = 'Frontend/Webdesign: interaktive Page, Steuerungs-UI, Socket.io-Basis für Remotesteuerung.',
  `featured_outcome` = 'Interaktives Special live — stabile Kamera-Anbindung für den Marketing-Einsatz.'
WHERE `id` = 43;

UPDATE `projects` SET
  `featured_tag` = 'Music · Fullstack · Relaunch',
  `featured_problem` = 'Legacy-Bandpage technisch und optisch am Limit — Pflege und Erweiterung kaum noch möglich.',
  `featured_role` = 'Fullstack-Relaunch: Frontend, API und Backend neu, Content-Trennung für die Band.',
  `featured_outcome` = 'Moderne, wartbare Site — die Band kann Inhalte eigenständig pflegen.'
WHERE `id` = 44;
