-- Kurz- und Langtexte für alle öffentlichen Projekte (UTF-8). Idempotent.
-- Letzte 10 Jahre (ab 2016): ausführliche Texte; ältere: kompaktere Langtexte.
-- PowerShell: docker cp ... pm-db:/tmp/ && mysql --default-character-set=utf8mb4 ... source

SET NAMES utf8mb4;

-- === Letzte 10 Jahre (2016+) — tiefe Beschreibungen ===

UPDATE `projects` SET
  `content_short` = 'MVP für strukturierte Datenerfassung internationaler Programme — Angular 15, NgRx und PrimeNG im Azure/Kubernetes-Stack.',
  `content_long` = 'Das NetworX MVP war das Data-Intake-Frontend für internationale Programme: strukturierte Erfassung, validierte Workflows und wiederverwendbare UI-Bausteine. Ich habe das Frontend auf Angular 15 mit NgRx und PrimeNG umgesetzt, PrimeNG-Komponenten projektspezifisch erweitert und eine Testbasis mit Jest und Cypress aufgebaut. Deployment und Betrieb liefen über Azure und Kubernetes (Argo) — als Ergänzung zum zentralen NetworX-Verwaltungstool.'
WHERE `id` = 2;

UPDATE `projects` SET
  `content_short` = 'Angular-13-Frontend für Finanzprodukt-Ratenzahlungsankauf — mit Testautomatisierung und Team-Schulung.',
  `content_long` = 'Für ein Hamburger Fintech-Umfeld habe ich das Frontend eines Tools zum Ratenzahlungsankauf weiterentwickelt — Angular 13, durchgängige UI-Patterns und automatisierte Tests. Neben der Umsetzung habe ich Mitarbeiter in Testing und Frontend-Workflows eingearbeitet, damit das Team eigenständig weiterliefern kann.'
WHERE `id` = 21;

UPDATE `projects` SET
  `content_short` = 'Weiterentwicklung eines AngularJS-Tools für Immobilienmakler — UI, Patterns und Bestands-Codebase.',
  `content_long` = 'Kurzprojekt in Leipzig: ein bestehendes Makler-Tool auf AngularJS-Basis weiterentwickelt — neue Views, konsistente Oberflächen und enge Abstimmung mit dem Produkteam. Fokus auf wartbare Erweiterungen ohne Big-Bang-Rewrite.'
WHERE `id` = 22;

UPDATE `projects` SET
  `content_short` = 'Frontend-Architektur und Vue-2.5-Modernisierung einer Social-Media-Plattform — inkl. Design-Spur und Symfony-Support.',
  `content_long` = 'Bei der Modernisierung der Plattform Sexdo in Berlin trug ich die Frontend-Architektur: Vue 2.5, UI-Systeme und enge Zusammenarbeit mit Design für UX-Qualität. Ergänzend unterstützte ich Symfony-Backend-Themen und half der Designabteilung bei der Umsetzung konsistenter Oberflächen — in einem Umfeld mit hohen Ansprüchen an Performance und Bedienbarkeit.'
WHERE `id` = 23;

UPDATE `projects` SET
  `content_short` = 'Grenzkontroll-Frontend für Thailand — Workflow-Optimierung, Kamera-Pipeline und Offline-Mode in Vue.',
  `content_long` = 'Im gleichen Produktfamilien-Umfeld wie Kambodscha: Workflow-Verbesserungen für die Dokumentenbearbeitung an der Grenze, Refactoring der Kamera-Stream- und Gesichtserkennungs-Pipeline sowie Offline-Mode in Vue. Ziel war stabilere Prozesse unter Feldbedingungen — weniger Unterbrechungen, klarere Bedienung für Grenzbeamte.'
WHERE `id` = 24;

UPDATE `projects` SET
  `content_short` = 'Biometrie-System Kroatien — Import-UI für Latent-Karten und Deployment-Pipeline mit APEX Nitro.',
  `content_long` = 'Für ein Criminal Automatic Biometrical Identification System in Kroatien habe ich eine spezialisierte Import-View für Latent-Karten entworfen und umgesetzt sowie eine Deployment-Pipeline mit APEX Nitro aufgebaut — damit Releases planbar und wiederholbar wurden.'
WHERE `id` = 26;

UPDATE `projects` SET
  `content_short` = 'Interner Tech-Showcase — Mockups, Webdesign und Spring/Thymeleaf-Frontend mit Webpack.',
  `content_long` = 'Für einen Gütersloher Kunden entstand ein interner Showcase: von Mockups über Webdesign bis zur Umsetzung mit Java/Spring, Thymeleaf und Webpack als Frontend-Bundler. Ich war technischer Berater und Entwickler — Brücke zwischen Designvorstellungen und lauffähiger Demo.'
WHERE `id` = 28;

UPDATE `projects` SET
  `content_short` = 'Banken-Frontend im C#-Framework — White-Label-Oberflächen, responsive von Desktop bis Mobile.',
  `content_long` = 'Individualisierung des Depotwechselservice-Frontends für diverse Banken: responsive Oberflächen auf Basis eines C#-Frameworks, Mockups für eine neue Applikationsgeneration, Landingpages und PDF-Formulare mit automatischer Befüllung — alles aus einem Guss für unterschiedliche Markenauftritte.'
WHERE `id` = 29;

UPDATE `projects` SET
  `content_short` = 'Multilinguale Landingpages, HTML-Email-Build-Pipeline und Gemini-Kampagnen-API mit OAuth2.',
  `content_long` = 'Webentwicklung für Landingpages einer multilingualen Anwendung inkl. Grunt-Workflow für modulare CSV-Erzeugung. Parallel Pflege und Ausbau eines Gulp-Projekts für adaptive HTML-Emails der Marketingabteilung sowie eine PHP-API zur Verwaltung von Gemini-Kampagnen per OAuth2 mit CronJob-Anbindung.'
WHERE `id` = 30;

UPDATE `projects` SET
  `content_short` = 'Lern- und Experimentierprojekte in Unity — Game AI, Smart Objects, Ökosystem-Simulation.',
  `content_long` = 'Privates Lernfeld in Unity: State Machines bis Behaviour Trees, GOAP und Utility AI; Smart Objects im Sims-Stil; Ökosystem-Simulation und Animation. Kein Kundenprojekt, sondern bewusste Vertiefung in Spielelogik und technische Experimente — fließt indirekt in Architektur-Denken und Prototyping ein.'
WHERE `id` = 33;

UPDATE `projects` SET
  `content_short` = 'Persönliches Homelab als DevOps-Lernplattform — Proxmox, Docker, Pi-hole, Home Assistant, GitLab.',
  `content_long` = 'Laufendes Homelab als Sandbox für DevOps und Infrastructure as Code: Proxmox-Cluster, Pi-hole/Unbound, Microservices in Docker, Home Assistant, GitLab und mehr. Dient dem Experimentieren mit Netzwerk, Virtualisierung und Container — und speist reale Erfahrung in Portfolio- und Kundenprojekte ein.'
WHERE `id` = 40;

UPDATE `projects` SET
  `content_short` = 'Erste Bandpage Hidden Tracks — Webdesign, Frontend und PHP/MySQL-API.',
  `content_long` = 'Vorstellungseite für die Band Hidden Tracks (hiddentracks-berlin.de): Webdesign, Umsetzung und eine schlanke Backend-API in PHP/MySQL — Grundlage für den späteren Relaunch 2024.'
WHERE `id` = 41;

UPDATE `projects` SET
  `content_short` = 'White-Label-Bankenfrontend für Kontowechsel — responsive, Mockups und PDF-Automatisierung.',
  `content_long` = 'C#-Framework-Frontend für mehrere Banken, responsive bis Mobile, Mockups für Neugeneration, Landingpages und PDF-Formulare mit automatischer Datenbefüllung — Fokus auf wiederverwendbare White-Label-Komponenten im Kontowechsel-Kontext.'
WHERE `id` = 42;

UPDATE `projects` SET
  `content_short` = 'Porsche-Webspecial — exklusiver 911 und remote Roboterkamerasteuerung per Socket.io.',
  `content_long` = 'Webspecial für Porsche zur Vorstellung des exklusiven 911: interaktive Page plus Steuerungs-UI für remote Roboterkameras. Ich habe die Bedienoberfläche und die Page umgesetzt sowie die Socket.io-Basis für die Remotesteuerung gelegt — hoher Anspruch an Animation, Timing und stabile Echtzeitverbindung.'
WHERE `id` = 43;

UPDATE `projects` SET
  `content_short` = 'Komplett-Relaunch der Bandpage — modernes Frontend, API und Backend von Grund auf neu.',
  `content_long` = 'Aktualisierung der Hidden-Tracks-Bandpage auf aktuelle Technologien: Neugestaltung von Frontend, API und Backend statt kosmetischem Refresh. Ziel war wartbare Architektur, schnelle Ladezeiten und eine Oberfläche, die die Band autonom pflegen kann — inklusive sauberer Trennung von Content und Präsentation.',
  `content` = '•Neugestaltung von Frontend, API und Backend\n•Moderne Technologie-Basis statt Legacy-Stack\n•Performance und wartbare Architektur\n•Content-Trennung für eigenständige Pflege durch die Band'
WHERE `id` = 44;

UPDATE `projects` SET
  `content_short` = 'Neuaufbau des Pencil&Me Portfolios — Angular, Vue Admin, PHP/Python-API und Shared-Hosting-Deploy.',
  `content_long` = 'Kompletter Relaunch des eigenen Portfolios: öffentliches Angular-Frontend, Vue-Admin, PHP-REST- und Python-API, MySQL, Docker-Compose für Dev und Build-Pipeline für Shared Hosting. Fokus auf wartbare Architektur, klare API-Grenzen und ein Deployment, das ohne Cloud-Zwang auf klassischem Webhosting läuft.',
  `content` = '•Angular-Frontend mit NgRx und Feature-Architektur\n•Vue-Admin und duale API-Schicht (PHP/Python)\n•Docker-Compose-Stack und Shared-Hosting-Deploy\n•Portfolio-Inhalte und Tech-Stack als Datenmodell'
WHERE `id` = 45;

-- === Älter als 10 Jahre — etwas mehr Tiefe (kompakter) ===

UPDATE `projects` SET
  `content_short` = 'Multilinguale Webapplikation und responsive HTML-Emails — interne CMS-Lösung inkl. RTL.',
  `content_long` = 'Frontend für eine mehrsprachige Plattform (auch RTL) auf Basis einer internen CMS-Lösung sowie responsive HTML-Emails für CR und Marketing — unter den Responsive- und Email-Client-Beschränkungen der Zeit.'
WHERE `id` = 31;

UPDATE `projects` SET
  `content_short` = 'Leitung Öffentlichkeitsarbeit — Marketing, Web, Print und Corporate Design für Bildungseinrichtungen.',
  `content_long` = 'Mit Personalverantwortung: Projektmanagement für Marketing, Webseiten, Print, Logo- und Grafikdesign für einen Verbund von Bildungseinrichtungen in Berlin.'
WHERE `id` = 36;

UPDATE `projects` SET
  `content_short` = 'Leitender Mediendesigner — Web, Print, Logo und Grafik mit Teamverantwortung in Wildau.',
  `content_long` = 'Über mehrere Jahre als leitender Mediendesigner: Webdesign und -entwicklung, Print, Logos und Grafik — mit Personalverantwortung und enger Kundenbindung.'
WHERE `id` = 38;

UPDATE `projects` SET
  `content_short` = 'Werbemaßnahmen für Musiker und Bands — Web, Print und Markenauftritte aus einer Hand.',
  `content_long` = 'Gestaltung und Umsetzung diverser Werbemaßnahmen und Webauftritte für Musiker und Bands in Berlin — von Konzept bis Live-Schaltung unter engen Timelines.',
  `content` = '•Web- und Print-Werbemaßnahmen für Musiker und Bands\n•Markenauftritte und Landingpages\n•Gestaltung und Umsetzung aus einer Hand'
WHERE `id` = 46;

-- Nicht öffentlich, aber für Admin/Recovery
UPDATE `projects` SET
  `content_short` = 'Freelance Fullstack und Design für Direktkunden in Berlin.',
  `content_long` = 'Eigenständige Projekte für Direktkunden: Webdesign, Webentwicklung, Print, Logo- und Grafikdesign — kombinierte Design- und Entwicklungsleistung.'
WHERE `id` = 39;

UPDATE `projects` SET
  `content_short` = 'Corporate Design und Webauftritte — Drupal, Contao und hauseigenes CMS.',
  `content_long` = 'Corporate Design (Logos, Briefpapier, Infomaterial) und Webpages als Firmenauftritt oder Landingpages mit Drupal 6, Contao und hauseigener CMS-Lösung.'
WHERE `id` = 32;
