-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Erstellungszeit: 28. Jun 2024 um 12:11
-- Server-Version: 8.4.0
-- PHP-Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `portfolio_db`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `uuid` binary(16) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `customers`
--

INSERT INTO `customers` (`id`, `uuid`, `name`, `location`) VALUES
(4, 0x624bf1692d75426db2bda02656c559ba, 'HDLabs', 'Wildau'),
(5, 0x6af66706514c4ed9b236fe6ab7dce4fc, 'Hidden-Tracks', 'Berlin'),
(6, 0x5584efc3ffe34878b4e110d3ca739195, 'D&amp;D Bildungsagentur GmbH', 'Berlin'),
(7, 0xae818307ff854a94b386dd42119caaae, 'D&amp;G Bildungszentrum GmbH', 'Berlin'),
(8, 0xa56d579349d7442aab215867abe2ce05, 'PROFILA Akademie GmbH', 'Berlin'),
(9, 0x168373faaf5a49d6b5e2009addfcc4a3, 'BPM GmbH', 'Berlin'),
(10, 0x4bd0ab45a4454ed0b4580ee946c509e0, 'PKW1.de GmbH', 'Berlin'),
(11, 0xaaa417e0038842a483146a312035b860, 'arvato Bertelsmann', 'Gütersloh'),
(12, 0xf0173d74faaf4659ac77615871a40259, 'DERMALOG Identification Systems GmbH', 'Hamburg'),
(13, 0x93c63da166de42668dd16c4cb12c44e2, 'OneStep GmbH', 'Berlin'),
(14, 0xd5771329fbd74ea3a0bc94f9374db21a, 'Health AG', 'Hamburg'),
(15, 0xce3b088cd22a447d811ccc5968352088, 'carmudi.com', 'Berlin'),
(16, 0x1086e8aa21ba496abfa13529d4c63cea, 'Objektkultur Software GmbH', 'Karlsruhe'),
(17, 0xe11217670a2a4da79afb53246d3c9092, 'HDI Global', 'Hannover'),
(18, 0xd3edd219349a486c83810016e6f5a337, 'Real Estate Pilot AG', 'Leipzig'),
(19, 0x0d76b2b496744a73954a93e26adf14fe, 'Fest GmbH', 'Bergisch Gladbach'),
(20, 0x4c0e5f7f80504734b6ae12971fc141c7, 'UDG Ludwigsburg GmbH', 'Hamburg'),
(21, 0x394a96039568479c8f680fdc9128de4b, 'Die Propheten', 'Berlin'),
(22, 0xab729bd4192d4ec9b6efe8a6be54d6ce, 'CASU', 'Berlin'),
(23, 0x6fe10ca61bd348ea9483b5fc40ffb018, 'JCP', 'Berlin'),
(24, 0x7ce59ceb2e5b474ca1d11812e27318ca, 'Digital Solutions', 'Berlin'),
(25, 0xd301bea6a2a24082801858374c44415d, 'Berliner Bildungsverbund', 'Berlin'),
(26, 0x92baf708d0f742f5b8ecafe301570f27, 'Frenzel Design', 'Berlin'),
(27, 0x30faa1a982d54f7aab14317474a5f542, 'MoKoh Music', 'Berlin'),
(28, 0xbd49cfa33fd5456a99071be86f6c1dc5, 'Konsolenkost', 'Berlin'),
(29, 0x261dcbf72a1a4aaab03ed466d3534719, 'Rockbüro', 'Berlin'),
(30, 0x06800e7ec3fc42dd828e9d9b3f471c12, 'Youngblood Music', 'Berlin'),
(31, 0x61fa3228c9134ab5ad2e031b1f3ab4f1, 'Rotkäppchen-Apotheke', 'Berlin'),
(32, 0x2414014353c34aaeb216d51a132b1d29, 'Pflegeengel', 'Berlin'),
(33, 0x91d126116157491794dacaedd9b43b32, 'Alex-Guitars', 'Berlin'),
(34, 0x6f9aaf4409dc441aab1261e1d2a79715, 'Bowlero', 'Berlin'),
(35, 0x704697ff613348acad115fa5439c27e7, 'Grossstadtgesichter', 'Berlin'),
(36, 0x2a915b2df06441cc9f1660b0ee9a645f, 'café revolution', 'Berlin'),
(37, 0x8d4d5ff682f5474f938ed9f852bd9140, 'Playlabs', 'Berlin'),
(38, 0x15fc77d6a21b4dabb39a7f537fb5cf37, 'Save-Events', 'Berlin'),
(39, 0xafb57b731eb948dfb340adc658c90246, 'Concierge Card', 'Berlin'),
(40, 0x337a26fc868d406199313f583ad407a5, 'BB-Concierge', 'Berlin'),
(41, 0x073c484dc120442fb85b0d2253791f72, 'Royal Ticket', 'Berlin'),
(42, 0xe9d3f4d7b0664c50a511582e3409d749, 'Systemdienst', 'Berlin'),
(43, 0x98c599350b814f79a49c8236c339c8b2, 'Jugendclub “die Klinke”', 'Berlin'),
(44, 0x29200ff1076b4b71a11a561c038a215b, 'Kino Kiste', 'Berlin'),
(45, 0xe2305500ce97407dbba3749e827dc88e, 'MoKi - Moabiter Kiez Zeitung', 'Berlin'),
(46, 0x92598e7e9f48434b9c9c821e821869f7, 'Age of Pinetrees', 'Berlin'),
(47, 0xbb9b4b6413f64f778b22df86bbdfc924, 'Tanga Elektra', 'Berlin'),
(48, 0x60af9e8512614dfaa7b07d9b9c7f643f, 'Verlaine', 'Berlin'),
(49, 0xb0bceb6e492a420a912de7eb89c12e38, 'HERZ!G', 'Nürnberg'),
(50, 0x49b13461991d4d69a722e5125bff55d5, 'Die Pädagogen', 'Berlin'),
(51, 0x3c46bb1147684c17b74f3af69378d891, 'Nicht der Rede wert', 'Berlin'),
(52, 0x40453e4ca1b349279dc22cab910ca49e, 'poetrYclub', 'Berlin'),
(53, 0x0acd7ad7f5e44fea9579c8f3f1d3df57, 'Do I smell Cupcakes?', 'Berlin'),
(54, 0xf1b67949b6fe43e4a2735a98f859b0b0, 'Billy Nick', 'Österreich'),
(55, 0x356edc04ee524b9e9ab24bc9a8963751, 'Alltagsdasein', 'Berlin'),
(56, 0x2dae1541c7c7440cb704247f267e0b19, 'Band-Salat', 'Berlin'),
(57, 0x954f15baa01c4c518f1be7bf833d08be, 'Betsy', 'Berlin'),
(58, 0x4de256d10e844a509637348066829fdb, 'HaPaMa', 'Berlin'),
(59, 0x50a5e6cd64364fc992d3f78ae400e9c6, 'Joachim Deutschland', 'Berlin'),
(60, 0x976b02dc3abf4dfc82cf7ee5539e0086, 'Cheaps', 'Berlin'),
(62, 0xe27f0e9f1267467bbe5fd24c0c2c9d1e, 'Restaurant Ledi', 'Berlin'),
(63, 0xf8abd08f221144b9ad967a9d08fbf73d, 'NoName', 'Berlin'),
(64, 0x7e74c5e6cb774a7d959899e4edc5e42b, 'Machs Maul auf Festival', 'Berlin'),
(65, 0x894f7d8a2589462fa18c24ef0d1bf44f, 'Planet der Affen', 'Berlin'),
(66, 0x84847d04760b41c493e4cb8758111cd8, 'Querbeat', 'Berlin'),
(67, 0xf3266b96c32f48b8be5c33f2a6e06639, 'Berlin Thunderbirds', 'Berlin'),
(69, 0xb846b343876944eb91ae5b0dc4bbafbb, 'Volley Devils', 'Berlin'),
(71, 0x2ac2cb5675964328996aa902fed2615f, 'AC-Berlin', 'Berlin');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projects`
--

CREATE TABLE `projects` (
  `id` int NOT NULL,
  `uuid` binary(16) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `position` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `content` varchar(4000) DEFAULT NULL,
  `content_long` varchar(4000) DEFAULT NULL,
  `content_short` varchar(4000) DEFAULT NULL,
  `type` int NOT NULL,
  `public` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `projects`
--

INSERT INTO `projects` (`id`, `uuid`, `name`, `location`, `position`, `content`, `content_long`, `content_short`, `type`, `public`) VALUES
(1, 0xaab5d5fd70c111e5a4fbb026b977eb28, 'NetworX, als zentrales Verwaltungstool für Internationale Programme', 'Hannover', 'Senior Frontend-Entwickler', '•Frontend-Entwicklung in Nx Monorepo\n•Planung und Testen zur Umstellung auf Angular 17\n•Schulung und Mentoring von internen Mitarbeitern\n•Unit Tests mit Jest, E2E-Tests mit Cypress\n•Arbeitsumgebung Octane, Azure und Deployment Kubernetes Cluster in Argo', NULL, NULL, 2, 1),
(2, 0xaab5d5fd70c111e5a4fbb026b977eb29, 'NetworX MVP, ein Data Intake Tool für Internationale Programme', 'Hannover', 'Senior Frontend-Entwickler', '•Frontend-Entwicklung auf Basis Angular 15 mit NgRx und PrimeNg\n•Customize PrimeNg components\n•Unit Tests mit Jest, E2E-Tests mit Cypress\n•Arbeitsumgebung Azure und Deployment Kubernetes Cluster in Argo', NULL, NULL, 2, 1),
(21, 0xa52fcc587c964c0aa5159a472aaab345, 'Weiterentwicklung eines Tools für Ratenzahlungsankauf', 'Hamburg', 'Frontendentwickler/Technical Lead Frontend', '•Frontendgestaltung und Entwicklung auf Basis Angular 13\n•Unit Testing, Automatisiertes Testing\n•Schulung von Mitarbeitern', NULL, NULL, 2, 1),
(22, 0xdf8ebb1e2c304b1dab168868868ecc25, 'Weiterentwicklung eines Tools für Immobilienmakler', 'Leipzig', 'Senior Frontendentwickler/Webdesigner', '•Frontendgestaltung und Entwicklung auf Basis AngularJS', NULL, NULL, 2, 1),
(23, 0x957e1a5a578d46aba430bb989748f060, 'Modernisierung der Social Media Plattform Sexdo', 'Berlin', 'Frontendentwickler/Webdesigner/Frontendarchitekt/Technical Lead Frontend', '•Architekturverantwortung des Frontends\n•Frontendgestaltung und Entwicklung auf Basis Vue 2.5\n•Support Backendentwicklung in Symphony\n•Support und Anleitung der Designabteilung in UI und UX', NULL, NULL, 2, 1),
(24, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 'Weiterentwicklung Bordercontrol System für Thailand', 'Hamburg', 'Frontendentwickler/Webdesigner', '•Verschiedene Verbesserungen im Workflow, um Borderdocumente zu prozessieren\n•Refactor der Pipeline für Kamerastream und Gesichtserkennung\n•Support und Development für Offline-Mode in Vue', NULL, NULL, 2, 1),
(25, 0xe2ad0b428b40450096ac430098beec88, 'Weiterentwicklung Bordercontrol System für Kambodscha', 'Hamburg', 'Frontendentwickler/Webdesigner/Softwarearchitekt/Technical Lead', '•Verschiedene Verbesserungen im Workflow, um Borderdocumente zu prozessieren\n•Design und Implementierung eines Workflows, um mit der Datenbank von Interpol Borderdocumente zu checken, ob sie als lost or stolen gemeldet sind\n•Verbesserungen und Weiterentwicklungen im Reportingsystem\n•Entwicklungerpläne gestalten, Softwarearchitektur, Prozessoptimierung\n•Training und Schulung von Mitarbeitern\n•Kundenkontakt zur Featureentwicklung', NULL, NULL, 2, 1),
(26, 0x8957feab89b44defb7a9d28ad68f8a86, 'Weiterentwicklung eines Criminal Automatic Biometrical Identification Systems für Kroatien', 'Hamburg', 'Frontendentwickler/Webdesigner', '•Design und Entwicklung einer View für den Import von Latent-Karten\n•Entwicklung einer Deployment Pipeline mit APEX Nitro', NULL, NULL, 2, 1),
(27, 0xf00c0bc3da1045d3bf879759112652a0, 'Produktion-Manager direkt im Werk als AngularCLI Applikation', 'Bergisch Gladbach', 'Frontendentwickler/Webdesigner/Technischer Berater', '•Umsetzen von verschiedenen Screens in Angular inkl. Datenverknüpfung\n•Softwarearchitektur und Umsetzung in einer vielschichtigen Daten-Architektur Steuerung der Produktions-Anlage über Python-Schnittstelle via Weboberfläche\n•Darstellung der Werksanlage mit aktuellen Daten aus den anliegenden SPS', NULL, NULL, 2, 1),
(28, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 'Internes Showcase', 'Gütersloh', 'Frontendentwickler/Webdesigner/Technischer Berater', '•Erstellen von Mockups und Webdesign mit Entwicklung\n•Softwarearchitektur und Umsetzung eines Webshowcases basierend auf Java mit Spring und Timeleave und Webpack als Frontendbundler', NULL, NULL, 2, 1),
(29, 0xea9afeb1be7c4677800b213848df118c, 'Depotwechselservice', 'Gütersloh', 'Frontendentwickler/Webdesigner', '•Individualisierung des Frontends einer Webapplikation basierend auf einem\nC#-Framework für diverse Banken, Responsive für Desktop bis Mobile\n•Erstellen von Mockups für eine neue Webapplikation\n•Erstellen von diversen Landingpages für internen und externen Gebrauch\n•Erstellen von PDF-Formularen für die automatische Daten Befüllung', NULL, NULL, 2, 1),
(30, 0x02645043a6ec463ea9c02a3914acdbd8, 'Landingpages und HTML-Emails', 'Berlin', 'Frontendentwickler/Technischer Berater', '•Webentwicklung für Landingpages einer multilingualen Webapplikation, Entwicklung eines Grunt-Projektes zur modularen Erstellung von CSV-Dateien für den Upload, Responsive für Desktop bis Mobile\n•Bearbeitung und Weiterentwicklung eines Gulp-Projektes zur Generierung von adaptive und responsive HTML-Emails für die Marketingabteilung\n•Entwicklung einer PHP-API zur Verwaltung von Gemini-Kampagnen via OAuth2 mit einem CronJob', NULL, NULL, 2, 1),
(31, 0xa8fc46b2518447dfafdb754f274e61d3, 'Landingpages, API-Entwicklung und HTML-Emails', 'Berlin', 'Frontendentwickler', '•Webentwicklung für eine multilinguale Webapplikation (auch RTL-Umgebungen), Frontend-Entwicklung auf Basis einer internen CMS-Lösung, Responsive\n•Entwicklung von responsive HTML-Emails für CR und Marketingabteilung', NULL, NULL, 2, 1),
(32, 0xe04b1d855b8e4afea26932939b730d9d, 'Diverse Projekte', 'Wildau', 'Webdesigner und -entwickler', '•Corporate Design u.a. in Form von Logos, Briefpapier, Visitenkarten, Infomaterial\n•Verschiedene Webpages als Firmenauftritt, Visitenkarte oder Landingpages. Umgesetzt mit Drupal 6, Contao und hauseigener CMS-Lösung', NULL, NULL, 2, 0),
(33, 0x776b2d03c9ea4c4b95e9442f75c5be62, 'Spieleentwicklung in Unity', '', '', '•Lernprojekte für:\noSpiele-KI (von einfachen State-Machines zu Behaviour Trees und GOAP oder Utility AI und deren verschiedenen Kombinationen)\noSims-linke Smart Objects\noSimulierung von Ökosystemen\noAnimation', NULL, NULL, 3, 1),
(36, 0xa439bd5bad634e2191fb628413e79aad, 'Öffentlichkeitsarbeit für einen Verbund von Bildungseinrichtungen', 'Berlin', 'Leiter Öffentlichkeitsarbeit mit Personalverantwortung', '•	Projektmanagement für Marketing\n•	Design und Umsetzungen von Webseiten, Printmedien, Logodesign, Grafikdesign, allgemeine Werbemaßnahmen', NULL, NULL, 1, 1),
(38, 0x7680d3d650104a56b8f824753e496b2e, 'Webdesign und -entwicklung', 'Wildau', 'Leitender Mediendesigner mit Personalverantwortung', '•	Webdesign/-entwicklung, Printdesign, Logodesign, Grafikdesign', NULL, NULL, 1, 1),
(39, 0x89da80b4b3a74424b6ed367da4220dfc, 'Freelancer für verschiedene Direktkunden', 'Berlin', 'Fullstack-Entwickler und Designer', '•	Webdesign/-entwicklung, Printdesign, Logodesign, Grafikdesign', NULL, NULL, 1, 0),
(40, 0xf63782d3f3b041818416aeab1f10f7ac, 'HomeLab', '', '', '•	Lern-Plattform für DevOps, Infostructure as Code, Networking, Hypervisors, Virtualisierung und Container\n•	Laufende Applikationen u.a.:\no	Proxmox-Cluster\no	Pi-Hole mit Unbound als Docker\no	Microservice Webapplication in Docker\no	Homeassistent in Docker\no	Tmux mit Monerominer\no	GitLabs', NULL, NULL, 3, 1),
(41, 0x5e509e5fa25142f3aa46a35145de3eeb, 'Bandpage Hidden-Tracks', '', '', 'http://www.hiddentracks-berlin.de\n•	Webdesign und Entwicklung einer Vorstellungsseite für die Band Hidden Tracks\n•	Entwicklung einer Backend-API in PHP und MySQL', NULL, NULL, 3, 1),
(42, 0xceefd397b7614cd993c252af6bcc15bc, 'Kontowechselservice', 'Gütersloh', 'Frontendentwickler/Webdesigner/Technischer Berater', '•	Individualisierung des Frontends einer Webapplikation basierend auf einem C#-Framework für diverse Banken, Responsive für Desktop bis Mobile\n•	Erstellen von Mockups für eine neue Webapplikation\n•	Erstellen von diversen Landingpages für internen und externen Gebrauch\n•	Erstellen von PDF-Formularen für die automatische Daten Befüllung', NULL, NULL, 2, 1),
(43, 0x0d853adf7ff540b09d389c06d15250bf, 'Webapplikation für Porsche – Roboterkamerasteuerung via Webinterface', 'Hamburg', 'Frontendentwickler/Webdesign', '•	Webentwicklung eines Webspecials für Porsche, welches den exklusiven 911 vorstellen sollte sowie remote Roboterkameras steuern ließ\n•	Umsetzung der Steuerungs-UI sowie der Page selbst\n•	Aufbau der Basis der Remotesteuerung via Socket.io', NULL, NULL, 2, 1),
(44, 0xf38e882709c04cd5a9e281deabb62897, 'Redesign und Relaunch der Bandpage Hidden Tracks', '', '', 'Aktualisierung der Bandpage auf moderne Technologien mit Neugestaltung von API, Frontend und Backend von Grund auf.', '', '', 3, 1),
(45, 0x800f199b48d344ce9474df0b491c650c, 'Redesign und Relaunch Pencil&amp;Me Portfolio', '', '', 'Neuaufbau des Pencil&amp;Me Portfolios auf modernere Technologien mit Neugestaltung von API, Frontend und Backend von Grund auf.', '', '', 3, 0),
(46, 0x4985ff3d0e03436c89039b8222d24c76, 'Diverse Werbemaßnahmen für Musiker und Bands', 'Berlin', 'Mediengestalter, Webdesigner und Webentwickler', 'Verantwortlich für Gestaltung und Umsetzung diverser Werbemaßnahmen und Webauftritten von Musikern und Bands.', '', '', 2, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `project_customer`
--

CREATE TABLE `project_customer` (
  `id` int NOT NULL,
  `project_id` binary(16) NOT NULL,
  `customer_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `project_customer`
--

INSERT INTO `project_customer` (`id`, `project_id`, `customer_id`) VALUES
(1, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x1086e8aa21ba496abfa13529d4c63cea),
(2, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0xe11217670a2a4da79afb53246d3c9092),
(3, 0xa439bd5bad634e2191fb628413e79aad, 0xa56d579349d7442aab215867abe2ce05),
(4, 0xa439bd5bad634e2191fb628413e79aad, 0x5584efc3ffe34878b4e110d3ca739195),
(5, 0xa439bd5bad634e2191fb628413e79aad, 0x168373faaf5a49d6b5e2009addfcc4a3),
(6, 0xa439bd5bad634e2191fb628413e79aad, 0xae818307ff854a94b386dd42119caaae),
(7, 0x7680d3d650104a56b8f824753e496b2e, 0x624bf1692d75426db2bda02656c559ba),
(8, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0xe11217670a2a4da79afb53246d3c9092),
(9, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x1086e8aa21ba496abfa13529d4c63cea),
(10, 0xa52fcc587c964c0aa5159a472aaab345, 0xd5771329fbd74ea3a0bc94f9374db21a),
(11, 0xdf8ebb1e2c304b1dab168868868ecc25, 0xd3edd219349a486c83810016e6f5a337),
(12, 0x957e1a5a578d46aba430bb989748f060, 0x93c63da166de42668dd16c4cb12c44e2),
(13, 0xe2ad0b428b40450096ac430098beec88, 0xf0173d74faaf4659ac77615871a40259),
(14, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0xf0173d74faaf4659ac77615871a40259),
(15, 0x8957feab89b44defb7a9d28ad68f8a86, 0xf0173d74faaf4659ac77615871a40259),
(16, 0xf00c0bc3da1045d3bf879759112652a0, 0x0d76b2b496744a73954a93e26adf14fe),
(17, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0xaaa417e0038842a483146a312035b860),
(18, 0xea9afeb1be7c4677800b213848df118c, 0xaaa417e0038842a483146a312035b860),
(19, 0x02645043a6ec463ea9c02a3914acdbd8, 0x4bd0ab45a4454ed0b4580ee946c509e0),
(20, 0xa8fc46b2518447dfafdb754f274e61d3, 0xce3b088cd22a447d811ccc5968352088),
(21, 0x5e509e5fa25142f3aa46a35145de3eeb, 0x6af66706514c4ed9b236fe6ab7dce4fc),
(22, 0xe04b1d855b8e4afea26932939b730d9d, 0x624bf1692d75426db2bda02656c559ba),
(23, 0xceefd397b7614cd993c252af6bcc15bc, 0xaaa417e0038842a483146a312035b860),
(24, 0x0d853adf7ff540b09d389c06d15250bf, 0x4c0e5f7f80504734b6ae12971fc141c7),
(25, 0x4985ff3d0e03436c89039b8222d24c76, 0x704697ff613348acad115fa5439c27e7),
(26, 0x4985ff3d0e03436c89039b8222d24c76, 0x50a5e6cd64364fc992d3f78ae400e9c6),
(27, 0x4985ff3d0e03436c89039b8222d24c76, 0xb0bceb6e492a420a912de7eb89c12e38);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `project_dates`
--

CREATE TABLE `project_dates` (
  `id` int NOT NULL,
  `project_id` binary(16) NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `project_dates`
--

INSERT INTO `project_dates` (`id`, `project_id`, `start_date`, `end_date`) VALUES
(1, 0xaab5d5fd70c111e5a4fbb026b977eb28, '2022-07-01 00:00:00', '2023-12-22 00:00:00'),
(2, 0xaab5d5fd70c111e5a4fbb026b977eb29, '2022-10-01 00:00:00', '2023-06-30 00:00:00'),
(3, 0xa52fcc587c964c0aa5159a472aaab345, '2022-04-01 00:00:00', '2022-06-30 00:00:00'),
(4, 0xdf8ebb1e2c304b1dab168868868ecc25, '2022-01-01 00:00:00', '2022-03-30 00:00:00'),
(5, 0x957e1a5a578d46aba430bb989748f060, '2021-06-01 00:00:00', '2022-01-30 00:00:00'),
(6, 0xf68b13fc790a4cc1a991ecef8ad1ffae, '2018-12-01 00:00:00', '2020-11-30 00:00:00'),
(7, 0xe2ad0b428b40450096ac430098beec88, '2018-06-01 00:00:00', '2021-05-30 00:00:00'),
(8, 0x8957feab89b44defb7a9d28ad68f8a86, '2018-07-01 00:00:00', '2018-12-30 00:00:00'),
(9, 0xf00c0bc3da1045d3bf879759112652a0, '2017-11-01 00:00:00', '2018-03-30 00:00:00'),
(10, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, '2017-06-01 00:00:00', '2018-01-30 00:00:00'),
(12, 0x02645043a6ec463ea9c02a3914acdbd8, '2016-06-01 00:00:00', '2016-06-30 00:00:00'),
(13, 0xa8fc46b2518447dfafdb754f274e61d3, '2014-12-01 00:00:00', '2015-03-30 00:00:00'),
(14, 0xe04b1d855b8e4afea26932939b730d9d, '2009-01-01 00:00:00', '2012-12-30 00:00:00'),
(15, 0x776b2d03c9ea4c4b95e9442f75c5be62, '2018-01-01 00:00:00', NULL),
(16, 0xa439bd5bad634e2191fb628413e79aad, '2013-11-01 00:00:00', '2014-10-30 00:00:00'),
(17, 0x7680d3d650104a56b8f824753e496b2e, '2009-08-01 00:00:00', '2012-01-30 00:00:00'),
(18, 0x89da80b4b3a74424b6ed367da4220dfc, '2005-01-01 00:00:00', NULL),
(19, 0xf63782d3f3b041818416aeab1f10f7ac, '2018-01-01 00:00:00', NULL),
(20, 0x5e509e5fa25142f3aa46a35145de3eeb, '2018-01-01 00:00:00', '2019-12-30 00:00:00'),
(21, 0xceefd397b7614cd993c252af6bcc15bc, '2016-04-01 00:00:00', '2017-02-25 00:00:00'),
(22, 0xea9afeb1be7c4677800b213848df118c, '2017-02-01 00:00:00', '2017-05-25 00:00:00'),
(23, 0x0d853adf7ff540b09d389c06d15250bf, '2017-04-01 00:00:00', '2017-05-30 00:00:00'),
(24, 0xf38e882709c04cd5a9e281deabb62897, '2024-04-01 00:00:00', '2024-06-30 00:00:00'),
(25, 0x800f199b48d344ce9474df0b491c650c, '2024-04-01 00:00:00', '2024-06-30 00:00:00'),
(26, 0x4985ff3d0e03436c89039b8222d24c76, '2012-02-01 00:00:00', '2013-12-30 00:00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `project_techstack`
--

CREATE TABLE `project_techstack` (
  `id` int NOT NULL,
  `project_id` binary(16) NOT NULL,
  `techstack_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `project_techstack`
--

INSERT INTO `project_techstack` (`id`, `project_id`, `techstack_id`) VALUES
(1, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(21, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(22, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x0b46a062140441d5be6c6766a99bfea9),
(23, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x38eec4bbe908475da73f47c3390be309),
(24, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x374c1546b59a420f9b7dce9f1c82e428),
(25, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0xac4928a93b5b404599e5b0b6b0dac75a),
(26, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x22c5f3c3eef04b0da57ab6716ab3e0f7),
(27, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0xe671c707baa640c49126d0f97564305f),
(28, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x69b8a15864824bdf8e5ded562b999267),
(29, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x0558be3b6ac84ed883cf77f93c619638),
(30, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0xffc1dc31d52241598b51ad21826aaa88),
(31, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x502a80a2e6064562af3d84883754d762),
(32, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x3bf89adaef2d46dcb8c886a721023666),
(33, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x1fa2269d750b4bea9cb2cab650d4d101),
(34, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(35, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x0b46a062140441d5be6c6766a99bfea9),
(36, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x38eec4bbe908475da73f47c3390be309),
(37, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x374c1546b59a420f9b7dce9f1c82e428),
(38, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0xac4928a93b5b404599e5b0b6b0dac75a),
(39, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x22c5f3c3eef04b0da57ab6716ab3e0f7),
(40, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0xe671c707baa640c49126d0f97564305f),
(41, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x69b8a15864824bdf8e5ded562b999267),
(42, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x0558be3b6ac84ed883cf77f93c619638),
(43, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0xffc1dc31d52241598b51ad21826aaa88),
(44, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x502a80a2e6064562af3d84883754d762),
(45, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0x3bf89adaef2d46dcb8c886a721023666),
(46, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(47, 0xa52fcc587c964c0aa5159a472aaab345, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(48, 0xa52fcc587c964c0aa5159a472aaab345, 0x0b46a062140441d5be6c6766a99bfea9),
(49, 0xa52fcc587c964c0aa5159a472aaab345, 0x38eec4bbe908475da73f47c3390be309),
(50, 0xa52fcc587c964c0aa5159a472aaab345, 0x374c1546b59a420f9b7dce9f1c82e428),
(51, 0xa52fcc587c964c0aa5159a472aaab345, 0x22c5f3c3eef04b0da57ab6716ab3e0f7),
(52, 0xa52fcc587c964c0aa5159a472aaab345, 0x678a888502fc4206ad8847013ef98aef),
(53, 0xa52fcc587c964c0aa5159a472aaab345, 0x9e3a46b300b44483a1965495afaacf0f),
(54, 0xa52fcc587c964c0aa5159a472aaab345, 0x8efbe8574aed47fcb12abb139354acfd),
(55, 0xa52fcc587c964c0aa5159a472aaab345, 0x3bf89adaef2d46dcb8c886a721023666),
(56, 0xa52fcc587c964c0aa5159a472aaab345, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(57, 0xa52fcc587c964c0aa5159a472aaab345, 0xffc1dc31d52241598b51ad21826aaa88),
(58, 0xa52fcc587c964c0aa5159a472aaab345, 0xbeff45af68194f649cc8e3e2bae215db),
(59, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0xc7fa7e09b6804aa48a9bbc68026eb77b),
(60, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0xc7fa7e09b6804aa48a9bbc68026eb77b),
(61, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0x55459835a3604af1901bb38aae1bde1a),
(62, 0xa52fcc587c964c0aa5159a472aaab345, 0x6d4e0b7eaa10447ca228528efdf72411),
(63, 0xdf8ebb1e2c304b1dab168868868ecc25, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(64, 0xdf8ebb1e2c304b1dab168868868ecc25, 0x0b46a062140441d5be6c6766a99bfea9),
(65, 0xdf8ebb1e2c304b1dab168868868ecc25, 0x26311862b80d4ea18437f77e3316f0b4),
(66, 0xdf8ebb1e2c304b1dab168868868ecc25, 0x91c8913a561e495ebb571a0109d5bb98),
(67, 0xdf8ebb1e2c304b1dab168868868ecc25, 0x678a888502fc4206ad8847013ef98aef),
(68, 0xdf8ebb1e2c304b1dab168868868ecc25, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(69, 0xdf8ebb1e2c304b1dab168868868ecc25, 0xffc1dc31d52241598b51ad21826aaa88),
(70, 0x957e1a5a578d46aba430bb989748f060, 0x0b46a062140441d5be6c6766a99bfea9),
(71, 0x957e1a5a578d46aba430bb989748f060, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(72, 0x957e1a5a578d46aba430bb989748f060, 0x38eec4bbe908475da73f47c3390be309),
(73, 0x957e1a5a578d46aba430bb989748f060, 0x6705012a1a054985bcfe3df2415c0478),
(74, 0x957e1a5a578d46aba430bb989748f060, 0xe7aebabdd4924490b067e2bbd3020832),
(75, 0x957e1a5a578d46aba430bb989748f060, 0x678a888502fc4206ad8847013ef98aef),
(76, 0x957e1a5a578d46aba430bb989748f060, 0xb5f41b0e827944e6974f882bd696d227),
(77, 0x957e1a5a578d46aba430bb989748f060, 0x9b796fc120f14c529363aeb6752795f1),
(78, 0x957e1a5a578d46aba430bb989748f060, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(79, 0x957e1a5a578d46aba430bb989748f060, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(80, 0x957e1a5a578d46aba430bb989748f060, 0x69b8a15864824bdf8e5ded562b999267),
(81, 0x957e1a5a578d46aba430bb989748f060, 0xf206527b3a714a6fbfe58d0252cd47f5),
(82, 0x957e1a5a578d46aba430bb989748f060, 0xad5c567e65014ed2bff58183acdbdbda),
(83, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0xc860c6a4f1c3471c89d954f46cd449ee),
(84, 0xaab5d5fd70c111e5a4fbb026b977eb29, 0xad5c567e65014ed2bff58183acdbdbda),
(85, 0xaab5d5fd70c111e5a4fbb026b977eb28, 0xad5c567e65014ed2bff58183acdbdbda),
(86, 0x957e1a5a578d46aba430bb989748f060, 0x7dcba7298c2c4543ae30619a6e86280c),
(87, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(88, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0x0b46a062140441d5be6c6766a99bfea9),
(89, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0x38eec4bbe908475da73f47c3390be309),
(90, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0x6705012a1a054985bcfe3df2415c0478),
(91, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0xf206527b3a714a6fbfe58d0252cd47f5),
(92, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0x23a6623c72ef48fbbae6b0a3e359f3af),
(93, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(94, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0xe7aebabdd4924490b067e2bbd3020832),
(95, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0x52e04cdc74a4491bae80eda3a5ca3d89),
(96, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0x6ca2022ad6c349408ccd653e3efa1139),
(97, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0xe261b82f158940428e40ecfd6488b1df),
(98, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0x83acc5c0d110465dabe346e5352ac6cc),
(99, 0xe2ad0b428b40450096ac430098beec88, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(100, 0xe2ad0b428b40450096ac430098beec88, 0x0b46a062140441d5be6c6766a99bfea9),
(101, 0xe2ad0b428b40450096ac430098beec88, 0x38eec4bbe908475da73f47c3390be309),
(102, 0xe2ad0b428b40450096ac430098beec88, 0xe261b82f158940428e40ecfd6488b1df),
(103, 0xe2ad0b428b40450096ac430098beec88, 0x83acc5c0d110465dabe346e5352ac6cc),
(104, 0xe2ad0b428b40450096ac430098beec88, 0x52e04cdc74a4491bae80eda3a5ca3d89),
(105, 0xe2ad0b428b40450096ac430098beec88, 0x6ca2022ad6c349408ccd653e3efa1139),
(106, 0xe2ad0b428b40450096ac430098beec88, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(107, 0xe2ad0b428b40450096ac430098beec88, 0xf206527b3a714a6fbfe58d0252cd47f5),
(108, 0xe2ad0b428b40450096ac430098beec88, 0x23a6623c72ef48fbbae6b0a3e359f3af),
(109, 0xe2ad0b428b40450096ac430098beec88, 0xffc1dc31d52241598b51ad21826aaa88),
(110, 0xe2ad0b428b40450096ac430098beec88, 0x3c8c60bb317347ad9fb061ce828dafb2),
(111, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0x3c8c60bb317347ad9fb061ce828dafb2),
(112, 0xe2ad0b428b40450096ac430098beec88, 0x43eb03f48ec5466892b1fe45ee360b5e),
(113, 0x8957feab89b44defb7a9d28ad68f8a86, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(114, 0x8957feab89b44defb7a9d28ad68f8a86, 0x0b46a062140441d5be6c6766a99bfea9),
(115, 0x8957feab89b44defb7a9d28ad68f8a86, 0x38eec4bbe908475da73f47c3390be309),
(116, 0x8957feab89b44defb7a9d28ad68f8a86, 0xe261b82f158940428e40ecfd6488b1df),
(117, 0x8957feab89b44defb7a9d28ad68f8a86, 0x52e04cdc74a4491bae80eda3a5ca3d89),
(118, 0x8957feab89b44defb7a9d28ad68f8a86, 0x6ca2022ad6c349408ccd653e3efa1139),
(119, 0x8957feab89b44defb7a9d28ad68f8a86, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(120, 0x8957feab89b44defb7a9d28ad68f8a86, 0xf206527b3a714a6fbfe58d0252cd47f5),
(121, 0x8957feab89b44defb7a9d28ad68f8a86, 0xbeff45af68194f649cc8e3e2bae215db),
(122, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0xbeff45af68194f649cc8e3e2bae215db),
(123, 0xe2ad0b428b40450096ac430098beec88, 0xbeff45af68194f649cc8e3e2bae215db),
(124, 0xf00c0bc3da1045d3bf879759112652a0, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(125, 0xf00c0bc3da1045d3bf879759112652a0, 0x0b46a062140441d5be6c6766a99bfea9),
(126, 0xf00c0bc3da1045d3bf879759112652a0, 0x38eec4bbe908475da73f47c3390be309),
(127, 0xf00c0bc3da1045d3bf879759112652a0, 0x22c5f3c3eef04b0da57ab6716ab3e0f7),
(128, 0xf00c0bc3da1045d3bf879759112652a0, 0xe671c707baa640c49126d0f97564305f),
(129, 0xf00c0bc3da1045d3bf879759112652a0, 0x374c1546b59a420f9b7dce9f1c82e428),
(130, 0xf00c0bc3da1045d3bf879759112652a0, 0x6705012a1a054985bcfe3df2415c0478),
(131, 0xf00c0bc3da1045d3bf879759112652a0, 0xac4928a93b5b404599e5b0b6b0dac75a),
(132, 0xf00c0bc3da1045d3bf879759112652a0, 0x3bf28f8e0566442ca24f0fb46491fe2f),
(133, 0xf00c0bc3da1045d3bf879759112652a0, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(134, 0xf00c0bc3da1045d3bf879759112652a0, 0xf206527b3a714a6fbfe58d0252cd47f5),
(135, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0x0b46a062140441d5be6c6766a99bfea9),
(136, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0x38eec4bbe908475da73f47c3390be309),
(137, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0xe671c707baa640c49126d0f97564305f),
(138, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0xe261b82f158940428e40ecfd6488b1df),
(139, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0xf5e9ac56f1c54e9babcbad30a8fe4564),
(140, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0x6972aaeb2fe744759cfd3e03d76593d1),
(141, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0x6705012a1a054985bcfe3df2415c0478),
(142, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0x04686f6920584138a9da585492b003b1),
(143, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(144, 0x7a3a6e89b5e64b209dc6ae9a91b1ea9e, 0xf206527b3a714a6fbfe58d0252cd47f5),
(146, 0xea9afeb1be7c4677800b213848df118c, 0x23a6623c72ef48fbbae6b0a3e359f3af),
(147, 0xea9afeb1be7c4677800b213848df118c, 0xf206527b3a714a6fbfe58d0252cd47f5),
(148, 0x02645043a6ec463ea9c02a3914acdbd8, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(149, 0x02645043a6ec463ea9c02a3914acdbd8, 0x0b46a062140441d5be6c6766a99bfea9),
(150, 0x02645043a6ec463ea9c02a3914acdbd8, 0x26311862b80d4ea18437f77e3316f0b4),
(151, 0x02645043a6ec463ea9c02a3914acdbd8, 0xe671c707baa640c49126d0f97564305f),
(152, 0x02645043a6ec463ea9c02a3914acdbd8, 0xe261b82f158940428e40ecfd6488b1df),
(153, 0x02645043a6ec463ea9c02a3914acdbd8, 0xf5e9ac56f1c54e9babcbad30a8fe4564),
(154, 0x02645043a6ec463ea9c02a3914acdbd8, 0x83acc5c0d110465dabe346e5352ac6cc),
(155, 0x02645043a6ec463ea9c02a3914acdbd8, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(156, 0x02645043a6ec463ea9c02a3914acdbd8, 0xb5f41b0e827944e6974f882bd696d227),
(157, 0x02645043a6ec463ea9c02a3914acdbd8, 0x678a888502fc4206ad8847013ef98aef),
(158, 0x02645043a6ec463ea9c02a3914acdbd8, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(159, 0x02645043a6ec463ea9c02a3914acdbd8, 0xf206527b3a714a6fbfe58d0252cd47f5),
(160, 0x02645043a6ec463ea9c02a3914acdbd8, 0xf95126fcf83e4f9abfdea6164f057c86),
(161, 0xa8fc46b2518447dfafdb754f274e61d3, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(162, 0xa8fc46b2518447dfafdb754f274e61d3, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(163, 0xa8fc46b2518447dfafdb754f274e61d3, 0x0b46a062140441d5be6c6766a99bfea9),
(164, 0xa8fc46b2518447dfafdb754f274e61d3, 0x38eec4bbe908475da73f47c3390be309),
(165, 0xa8fc46b2518447dfafdb754f274e61d3, 0xe671c707baa640c49126d0f97564305f),
(166, 0xa8fc46b2518447dfafdb754f274e61d3, 0xe261b82f158940428e40ecfd6488b1df),
(167, 0xa8fc46b2518447dfafdb754f274e61d3, 0x7f54346c24e943238358b02b32c9c5c5),
(168, 0xa8fc46b2518447dfafdb754f274e61d3, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(169, 0xa8fc46b2518447dfafdb754f274e61d3, 0xf206527b3a714a6fbfe58d0252cd47f5),
(170, 0xa8fc46b2518447dfafdb754f274e61d3, 0xbeff45af68194f649cc8e3e2bae215db),
(171, 0xdf8ebb1e2c304b1dab168868868ecc25, 0xbeff45af68194f649cc8e3e2bae215db),
(172, 0xe04b1d855b8e4afea26932939b730d9d, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(173, 0xe04b1d855b8e4afea26932939b730d9d, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(174, 0xe04b1d855b8e4afea26932939b730d9d, 0x0b46a062140441d5be6c6766a99bfea9),
(175, 0xe04b1d855b8e4afea26932939b730d9d, 0xf206527b3a714a6fbfe58d0252cd47f5),
(176, 0xe04b1d855b8e4afea26932939b730d9d, 0x23a6623c72ef48fbbae6b0a3e359f3af),
(177, 0xe04b1d855b8e4afea26932939b730d9d, 0x884a03b4f303402f89dbc9e61624c00a),
(178, 0xe04b1d855b8e4afea26932939b730d9d, 0xbf07cadf4ec64c7481a3b56e50074819),
(179, 0xe04b1d855b8e4afea26932939b730d9d, 0xeeade68a080c4b36a3053cf35634f74f),
(180, 0xf63782d3f3b041818416aeab1f10f7ac, 0xeb2862032bcf4cc5807864afdcd994fc),
(181, 0xf63782d3f3b041818416aeab1f10f7ac, 0x69b8a15864824bdf8e5ded562b999267),
(182, 0xf63782d3f3b041818416aeab1f10f7ac, 0x9957764a613f4213965f6e7704793c54),
(183, 0x5e509e5fa25142f3aa46a35145de3eeb, 0x22c5f3c3eef04b0da57ab6716ab3e0f7),
(184, 0x5e509e5fa25142f3aa46a35145de3eeb, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(185, 0x5e509e5fa25142f3aa46a35145de3eeb, 0x374c1546b59a420f9b7dce9f1c82e428),
(186, 0x5e509e5fa25142f3aa46a35145de3eeb, 0x38eec4bbe908475da73f47c3390be309),
(187, 0x5e509e5fa25142f3aa46a35145de3eeb, 0xb5f41b0e827944e6974f882bd696d227),
(188, 0x5e509e5fa25142f3aa46a35145de3eeb, 0x83acc5c0d110465dabe346e5352ac6cc),
(189, 0x5e509e5fa25142f3aa46a35145de3eeb, 0x678a888502fc4206ad8847013ef98aef),
(190, 0x5e509e5fa25142f3aa46a35145de3eeb, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(191, 0x5e509e5fa25142f3aa46a35145de3eeb, 0x0b46a062140441d5be6c6766a99bfea9),
(193, 0x776b2d03c9ea4c4b95e9442f75c5be62, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(194, 0x776b2d03c9ea4c4b95e9442f75c5be62, 0xda4dcf689e3d4c328dfb577fe3fee37e),
(195, 0x957e1a5a578d46aba430bb989748f060, 0x13996ef521614e889a3d608f3af8ff7c),
(196, 0x776b2d03c9ea4c4b95e9442f75c5be62, 0x0925f242b21846f8befee4ac3fc5c5fd),
(197, 0xceefd397b7614cd993c252af6bcc15bc, 0x0b46a062140441d5be6c6766a99bfea9),
(198, 0xceefd397b7614cd993c252af6bcc15bc, 0x23a6623c72ef48fbbae6b0a3e359f3af),
(199, 0xceefd397b7614cd993c252af6bcc15bc, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(200, 0xceefd397b7614cd993c252af6bcc15bc, 0xb5f41b0e827944e6974f882bd696d227),
(201, 0xceefd397b7614cd993c252af6bcc15bc, 0x678a888502fc4206ad8847013ef98aef),
(202, 0xceefd397b7614cd993c252af6bcc15bc, 0xda4dcf689e3d4c328dfb577fe3fee37e),
(203, 0xceefd397b7614cd993c252af6bcc15bc, 0xe261b82f158940428e40ecfd6488b1df),
(204, 0xceefd397b7614cd993c252af6bcc15bc, 0x83acc5c0d110465dabe346e5352ac6cc),
(205, 0xceefd397b7614cd993c252af6bcc15bc, 0xf206527b3a714a6fbfe58d0252cd47f5),
(206, 0xceefd397b7614cd993c252af6bcc15bc, 0x22c5f3c3eef04b0da57ab6716ab3e0f7),
(207, 0xceefd397b7614cd993c252af6bcc15bc, 0xe671c707baa640c49126d0f97564305f),
(208, 0xceefd397b7614cd993c252af6bcc15bc, 0x26311862b80d4ea18437f77e3316f0b4),
(209, 0x0d853adf7ff540b09d389c06d15250bf, 0x6972aaeb2fe744759cfd3e03d76593d1),
(210, 0x0d853adf7ff540b09d389c06d15250bf, 0x0b46a062140441d5be6c6766a99bfea9),
(211, 0x0d853adf7ff540b09d389c06d15250bf, 0x23a6623c72ef48fbbae6b0a3e359f3af),
(212, 0x0d853adf7ff540b09d389c06d15250bf, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(213, 0x0d853adf7ff540b09d389c06d15250bf, 0xf5e9ac56f1c54e9babcbad30a8fe4564),
(214, 0x0d853adf7ff540b09d389c06d15250bf, 0x04686f6920584138a9da585492b003b1),
(215, 0x0d853adf7ff540b09d389c06d15250bf, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(216, 0x0d853adf7ff540b09d389c06d15250bf, 0xe261b82f158940428e40ecfd6488b1df),
(217, 0x0d853adf7ff540b09d389c06d15250bf, 0xb9f16e33573a4a30be98d189d702d583),
(218, 0x0d853adf7ff540b09d389c06d15250bf, 0xf206527b3a714a6fbfe58d0252cd47f5),
(219, 0x0d853adf7ff540b09d389c06d15250bf, 0xe671c707baa640c49126d0f97564305f),
(220, 0x0d853adf7ff540b09d389c06d15250bf, 0x26311862b80d4ea18437f77e3316f0b4),
(221, 0xa439bd5bad634e2191fb628413e79aad, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(222, 0xa439bd5bad634e2191fb628413e79aad, 0x38eec4bbe908475da73f47c3390be309),
(223, 0xa439bd5bad634e2191fb628413e79aad, 0xe671c707baa640c49126d0f97564305f),
(224, 0xa439bd5bad634e2191fb628413e79aad, 0x0b46a062140441d5be6c6766a99bfea9),
(225, 0xa439bd5bad634e2191fb628413e79aad, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(226, 0x7680d3d650104a56b8f824753e496b2e, 0x23a6623c72ef48fbbae6b0a3e359f3af),
(227, 0x7680d3d650104a56b8f824753e496b2e, 0xbf07cadf4ec64c7481a3b56e50074819),
(228, 0x7680d3d650104a56b8f824753e496b2e, 0x0b46a062140441d5be6c6766a99bfea9),
(229, 0x7680d3d650104a56b8f824753e496b2e, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(230, 0x7680d3d650104a56b8f824753e496b2e, 0xf206527b3a714a6fbfe58d0252cd47f5),
(231, 0x7680d3d650104a56b8f824753e496b2e, 0xe671c707baa640c49126d0f97564305f),
(232, 0x7680d3d650104a56b8f824753e496b2e, 0xe261b82f158940428e40ecfd6488b1df),
(233, 0x7680d3d650104a56b8f824753e496b2e, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(234, 0xa439bd5bad634e2191fb628413e79aad, 0xe261b82f158940428e40ecfd6488b1df),
(235, 0x89da80b4b3a74424b6ed367da4220dfc, 0x0b46a062140441d5be6c6766a99bfea9),
(236, 0x89da80b4b3a74424b6ed367da4220dfc, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(237, 0xf38e882709c04cd5a9e281deabb62897, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(238, 0xf38e882709c04cd5a9e281deabb62897, 0x83acc5c0d110465dabe346e5352ac6cc),
(239, 0xf38e882709c04cd5a9e281deabb62897, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(240, 0xf38e882709c04cd5a9e281deabb62897, 0x22c5f3c3eef04b0da57ab6716ab3e0f7),
(241, 0xf38e882709c04cd5a9e281deabb62897, 0x38eec4bbe908475da73f47c3390be309),
(242, 0xf38e882709c04cd5a9e281deabb62897, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(243, 0xf38e882709c04cd5a9e281deabb62897, 0x69b8a15864824bdf8e5ded562b999267),
(244, 0xf38e882709c04cd5a9e281deabb62897, 0x0b46a062140441d5be6c6766a99bfea9),
(245, 0xf38e882709c04cd5a9e281deabb62897, 0x13996ef521614e889a3d608f3af8ff7c),
(246, 0xf38e882709c04cd5a9e281deabb62897, 0x678a888502fc4206ad8847013ef98aef),
(247, 0xf38e882709c04cd5a9e281deabb62897, 0x7dcba7298c2c4543ae30619a6e86280c),
(248, 0xf38e882709c04cd5a9e281deabb62897, 0xe7aebabdd4924490b067e2bbd3020832),
(249, 0xf38e882709c04cd5a9e281deabb62897, 0xd9abad66b8fc494892530bb3b797f74b),
(250, 0x800f199b48d344ce9474df0b491c650c, 0xb5f41b0e827944e6974f882bd696d227),
(251, 0x800f199b48d344ce9474df0b491c650c, 0x22c5f3c3eef04b0da57ab6716ab3e0f7),
(252, 0x800f199b48d344ce9474df0b491c650c, 0x38eec4bbe908475da73f47c3390be309),
(253, 0x800f199b48d344ce9474df0b491c650c, 0x0b46a062140441d5be6c6766a99bfea9),
(254, 0x800f199b48d344ce9474df0b491c650c, 0x3bf28f8e0566442ca24f0fb46491fe2f),
(255, 0x800f199b48d344ce9474df0b491c650c, 0x678a888502fc4206ad8847013ef98aef),
(256, 0x800f199b48d344ce9474df0b491c650c, 0xd9abad66b8fc494892530bb3b797f74b),
(257, 0x800f199b48d344ce9474df0b491c650c, 0xc93e53fae1a7476199ef8d8ae195deaf),
(258, 0x800f199b48d344ce9474df0b491c650c, 0x7dcba7298c2c4543ae30619a6e86280c),
(259, 0x800f199b48d344ce9474df0b491c650c, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(260, 0x800f199b48d344ce9474df0b491c650c, 0xe7aebabdd4924490b067e2bbd3020832),
(261, 0x800f199b48d344ce9474df0b491c650c, 0x374c1546b59a420f9b7dce9f1c82e428),
(262, 0x800f199b48d344ce9474df0b491c650c, 0xaab5d5fd70c111e5a4fbb026b977eb20),
(263, 0x800f199b48d344ce9474df0b491c650c, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(264, 0x800f199b48d344ce9474df0b491c650c, 0x69b8a15864824bdf8e5ded562b999267),
(265, 0x800f199b48d344ce9474df0b491c650c, 0x13996ef521614e889a3d608f3af8ff7c),
(266, 0x4985ff3d0e03436c89039b8222d24c76, 0xeeade68a080c4b36a3053cf35634f74f),
(267, 0x4985ff3d0e03436c89039b8222d24c76, 0xe671c707baa640c49126d0f97564305f),
(268, 0x4985ff3d0e03436c89039b8222d24c76, 0xe261b82f158940428e40ecfd6488b1df),
(269, 0x4985ff3d0e03436c89039b8222d24c76, 0x15e1c928ea5a4ee2844da5c8ec92e073),
(270, 0x4985ff3d0e03436c89039b8222d24c76, 0x0b46a062140441d5be6c6766a99bfea9),
(271, 0x4985ff3d0e03436c89039b8222d24c76, 0xf206527b3a714a6fbfe58d0252cd47f5),
(272, 0x4985ff3d0e03436c89039b8222d24c76, 0xf48bec1cf44f4d7795a499e3aa9167a5),
(273, 0x4985ff3d0e03436c89039b8222d24c76, 0x23a6623c72ef48fbbae6b0a3e359f3af),
(274, 0xa439bd5bad634e2191fb628413e79aad, 0x8d6ce3f3430a4309aedfcc8d13d3afe1),
(275, 0xe2ad0b428b40450096ac430098beec88, 0xd9abad66b8fc494892530bb3b797f74b),
(276, 0xf68b13fc790a4cc1a991ecef8ad1ffae, 0xa9ca144cc970406fac61f00a7e3d1013),
(277, 0xe2ad0b428b40450096ac430098beec88, 0xa9ca144cc970406fac61f00a7e3d1013);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `project_type`
--

CREATE TABLE `project_type` (
  `id` int NOT NULL,
  `type` varchar(10) CHARACTER SET latin1 COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `project_type`
--

INSERT INTO `project_type` (`id`, `type`) VALUES
(1, 'FEST'),
(2, 'CUST'),
(3, 'PRIV');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `techstack`
--

CREATE TABLE `techstack` (
  `id` int NOT NULL,
  `uuid` binary(16) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` int NOT NULL,
  `expertise_level` int DEFAULT NULL,
  `flag_important` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `techstack`
--

INSERT INTO `techstack` (`id`, `uuid`, `name`, `type`, `expertise_level`, `flag_important`) VALUES
(1, 0xaab5d5fd70c111e5a4fbb026b977eb20, 'Git', 10, 95, 0),
(21, 0x15e1c928ea5a4ee2844da5c8ec92e073, 'HTML5', 1, 95, 0),
(22, 0x0b46a062140441d5be6c6766a99bfea9, 'CSS3', 1, 95, 0),
(23, 0x38eec4bbe908475da73f47c3390be309, 'SCSS', 1, 90, 0),
(24, 0x374c1546b59a420f9b7dce9f1c82e428, 'Angular', 3, 90, 0),
(25, 0xac4928a93b5b404599e5b0b6b0dac75a, 'PrimeNg', 3, 80, 0),
(26, 0x22c5f3c3eef04b0da57ab6716ab3e0f7, 'Typescript', 1, 85, 0),
(27, 0xe671c707baa640c49126d0f97564305f, 'Javascript', 1, 90, 0),
(28, 0x69b8a15864824bdf8e5ded562b999267, 'Docker', 6, 85, 0),
(29, 0x0558be3b6ac84ed883cf77f93c619638, 'PostgreSQL', 7, 80, 0),
(30, 0xffc1dc31d52241598b51ad21826aaa88, 'Java', 2, 70, 0),
(31, 0x502a80a2e6064562af3d84883754d762, 'Jest', 9, 85, 0),
(32, 0x3bf89adaef2d46dcb8c886a721023666, 'Cypress', 9, 80, 0),
(33, 0x1fa2269d750b4bea9cb2cab650d4d101, 'TailwindCSS', 3, 75, 0),
(34, 0x678a888502fc4206ad8847013ef98aef, 'Bootstrap', 3, 80, 0),
(35, 0x9e3a46b300b44483a1965495afaacf0f, 'Karma', 9, 70, 0),
(36, 0x8efbe8574aed47fcb12abb139354acfd, 'Jasmine', 9, 70, 0),
(37, 0xbeff45af68194f649cc8e3e2bae215db, 'Jira', 10, 80, 0),
(38, 0xc7fa7e09b6804aa48a9bbc68026eb77b, 'Azure', 10, 80, 0),
(39, 0x55459835a3604af1901bb38aae1bde1a, 'Octane', 10, 70, 0),
(40, 0x6d4e0b7eaa10447ca228528efdf72411, 'Bamboo', 6, 60, 0),
(41, 0x26311862b80d4ea18437f77e3316f0b4, 'LESS', 1, 80, 0),
(42, 0x91c8913a561e495ebb571a0109d5bb98, 'AngularJS', 3, 80, 0),
(43, 0x6705012a1a054985bcfe3df2415c0478, 'Webpack', 5, 80, 0),
(44, 0x5e8567bba61547f4a02850d6523cd535, 'Yarn', 5, 80, 0),
(45, 0xe7aebabdd4924490b067e2bbd3020832, 'Vue', 3, 85, 0),
(46, 0xb5f41b0e827944e6974f882bd696d227, 'MySQL', 7, 85, 0),
(47, 0x9b796fc120f14c529363aeb6752795f1, 'Symphony', 4, 80, 0),
(48, 0xf48bec1cf44f4d7795a499e3aa9167a5, 'PHP', 2, 80, 0),
(49, 0xf206527b3a714a6fbfe58d0252cd47f5, 'Adobe Photoshop', 12, 85, 0),
(50, 0xad5c567e65014ed2bff58183acdbdbda, 'Adobe XD', 12, 80, 0),
(51, 0xc860c6a4f1c3471c89d954f46cd449ee, 'Figma', 12, 70, 0),
(52, 0x7dcba7298c2c4543ae30619a6e86280c, 'VueX', 3, 80, 0),
(53, 0x23a6623c72ef48fbbae6b0a3e359f3af, 'Adobe Indesign', 12, 80, 0),
(54, 0x52e04cdc74a4491bae80eda3a5ca3d89, 'Oracle APEX', 4, 80, 0),
(55, 0x6ca2022ad6c349408ccd653e3efa1139, 'APEX Nitro', 3, 80, 0),
(56, 0xe261b82f158940428e40ecfd6488b1df, 'JQuery', 1, 80, 0),
(57, 0x83acc5c0d110465dabe346e5352ac6cc, 'Gulp', 5, 80, 0),
(58, 0x3c8c60bb317347ad9fb061ce828dafb2, 'PL/SQL', 7, 80, 0),
(59, 0x43eb03f48ec5466892b1fe45ee360b5e, 'JASPER Report', 4, 70, 0),
(60, 0x3bf28f8e0566442ca24f0fb46491fe2f, 'Python', 2, 80, 0),
(61, 0xf5e9ac56f1c54e9babcbad30a8fe4564, 'Grunt', 5, 75, 0),
(62, 0x6972aaeb2fe744759cfd3e03d76593d1, 'Socket.io', 2, 60, 0),
(63, 0xb9f16e33573a4a30be98d189d702d583, 'Websocket', 2, 60, 0),
(64, 0x04686f6920584138a9da585492b003b1, 'Backbone', 1, 60, 0),
(65, 0xf95126fcf83e4f9abfdea6164f057c86, 'OAuth2', 2, 70, 0),
(66, 0x7f54346c24e943238358b02b32c9c5c5, 'ZURB Foundation', 3, 80, 0),
(67, 0x884a03b4f303402f89dbc9e61624c00a, 'Drupal', 8, 70, 0),
(68, 0xbf07cadf4ec64c7481a3b56e50074819, 'Contao', 8, 75, 0),
(69, 0xeeade68a080c4b36a3053cf35634f74f, 'Macromedia Freehand', 12, 85, 0),
(70, 0xda4dcf689e3d4c328dfb577fe3fee37e, 'C#', 2, 80, 0),
(72, 0xeb2862032bcf4cc5807864afdcd994fc, 'Ansible', 6, 70, 0),
(73, 0x9957764a613f4213965f6e7704793c54, 'Proxmox', 6, 70, 0),
(74, 0x13996ef521614e889a3d608f3af8ff7c, 'Docker Compose', 6, 75, 0),
(78, 0x0925f242b21846f8befee4ac3fc5c5fd, 'Unity', 11, 85, 0),
(79, 0xd9abad66b8fc494892530bb3b797f74b, 'nginx', 6, 70, 0),
(80, 0xc93e53fae1a7476199ef8d8ae195deaf, 'Flask', 4, 60, 0),
(81, 0x8d6ce3f3430a4309aedfcc8d13d3afe1, 'Silverstripe CMS', 8, 50, 0),
(82, 0xa9ca144cc970406fac61f00a7e3d1013, 'VMWare', 6, 70, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `techstack_type`
--

CREATE TABLE `techstack_type` (
  `id` int NOT NULL,
  `type` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `techstack_type`
--

INSERT INTO `techstack_type` (`id`, `type`) VALUES
(1, 'FEDEV'),
(2, 'BEDEV'),
(3, 'FEFRAME'),
(4, 'BEFRAME'),
(5, 'FEBT'),
(6, 'DEVOPS'),
(7, 'DB'),
(8, 'CMS'),
(9, 'TEST'),
(10, 'PROJECTTOO'),
(11, 'MISC'),
(12, 'DESIGN'),
(13, 'LANG');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_project_uuid` (`uuid`);

--
-- Indizes für die Tabelle `project_customer`
--
ALTER TABLE `project_customer`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `project_dates`
--
ALTER TABLE `project_dates`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `project_techstack`
--
ALTER TABLE `project_techstack`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `project_type`
--
ALTER TABLE `project_type`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `techstack`
--
ALTER TABLE `techstack`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `techstack_type`
--
ALTER TABLE `techstack_type`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT für Tabelle `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT für Tabelle `project_customer`
--
ALTER TABLE `project_customer`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT für Tabelle `project_dates`
--
ALTER TABLE `project_dates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT für Tabelle `project_techstack`
--
ALTER TABLE `project_techstack`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=278;

--
-- AUTO_INCREMENT für Tabelle `project_type`
--
ALTER TABLE `project_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `techstack`
--
ALTER TABLE `techstack`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT für Tabelle `techstack_type`
--
ALTER TABLE `techstack_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
