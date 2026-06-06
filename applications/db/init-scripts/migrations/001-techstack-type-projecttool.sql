-- Fix truncated techstack type (PROJECTTOO -> PROJECTTOOL)
-- Bash:  mysql -u user -p portfolio_db < 001-techstack-type-projecttool.sql
-- PowerShell (Repo-Root):
--   Get-Content applications\db\init-scripts\migrations\001-techstack-type-projecttool.sql -Raw |
--     docker compose exec -T db mysql -u user -ptest portfolio_db

USE portfolio_db;

ALTER TABLE `techstack_type`
  MODIFY COLUMN `type` varchar(12) NOT NULL;

UPDATE `techstack_type`
SET `type` = 'PROJECTTOOL'
WHERE `type` = 'PROJECTTOO';
