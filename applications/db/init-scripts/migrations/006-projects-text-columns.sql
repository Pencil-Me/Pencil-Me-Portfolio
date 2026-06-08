-- projects: grosse Textfelder von VARCHAR auf TEXT (MySQL #1118 bei utf8mb4)
-- Grund: mehrere VARCHAR(4000/2000) ueberschreiten die max. Zeilenlaenge (65535).
-- phpMyAdmin / Hosting: vor Voll-Import ausfuehren, wenn projects schon mit VARCHAR existiert.
-- Docker: docker cp + mysql --default-character-set=utf8mb4 … source /tmp/006-projects-text-columns.sql

SET NAMES utf8mb4;

ALTER TABLE `projects`
  MODIFY COLUMN `content` text DEFAULT NULL,
  MODIFY COLUMN `content_long` text DEFAULT NULL,
  MODIFY COLUMN `content_short` text DEFAULT NULL,
  MODIFY COLUMN `featured_problem` text DEFAULT NULL,
  MODIFY COLUMN `featured_role` text DEFAULT NULL,
  MODIFY COLUMN `featured_outcome` text DEFAULT NULL;
