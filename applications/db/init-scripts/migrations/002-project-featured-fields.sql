-- Highlight-Projekte (Startseite): Spalten anlegen
-- Bash:  mysql --default-character-set=utf8mb4 -u user -p portfolio_db < 002-project-featured-fields.sql
-- PowerShell (Repo-Root, UTF-8 sicher via docker cp — kein Get-Content-Pipe):
--   docker cp applications/db/init-scripts/migrations/002-project-featured-fields.sql pm-db:/tmp/
--   docker exec pm-db mysql --default-character-set=utf8mb4 -u user -ptest portfolio_db -e "source /tmp/002-project-featured-fields.sql"
-- Seed-Daten danach: 002-project-featured-fields-seed.sql (gleiches Vorgehen)

SET NAMES utf8mb4;

ALTER TABLE `projects`
  ADD COLUMN `featured_rank` tinyint UNSIGNED DEFAULT NULL COMMENT '1-3 = Highlight auf Startseite, NULL = nicht featured' AFTER `public`,
  ADD COLUMN `featured_tag` varchar(128) DEFAULT NULL AFTER `featured_rank`,
  ADD COLUMN `featured_problem` varchar(2000) DEFAULT NULL AFTER `featured_tag`,
  ADD COLUMN `featured_role` varchar(2000) DEFAULT NULL AFTER `featured_problem`,
  ADD COLUMN `featured_outcome` varchar(2000) DEFAULT NULL AFTER `featured_role`;
