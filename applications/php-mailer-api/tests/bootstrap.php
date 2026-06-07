<?php

define('PROJECT_ROOT_PATH', dirname(__DIR__) . '/src/');

require_once dirname(__DIR__) . '/vendor/autoload.php';

$envDev = PROJECT_ROOT_PATH . 'Inc/.env.dev';
if (!is_file($envDev)) {
    copy(PROJECT_ROOT_PATH . 'Inc/.env.example', $envDev);
}

putenv('APP_ENV=development');
