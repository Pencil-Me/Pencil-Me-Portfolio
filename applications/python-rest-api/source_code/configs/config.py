"""Application configuration loaded from environment variables."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

_ENV_FILE = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(_ENV_FILE)


def _require(name: str) -> str:
    value = os.getenv(name)
    if value is None or value.strip() == '':
        raise RuntimeError(f'Missing required environment variable: {name}')
    return value


def _optional(name: str, default: str = '') -> str:
    return os.getenv(name, default)


dbconfig = {
    'host': _require('DB_HOST'),
    'port': _optional('DB_PORT', '3306'),
    'username': _require('DB_USERNAME'),
    'password': _require('DB_PASSWORD'),
    'database': _require('DB_DATABASE'),
}

api_keys = {
    'be_key': _require('API_KEY_BE'),
}

baseurl = _optional('BASE_URL', '')


def is_production() -> bool:
    return _optional('APP_ENV', 'development').lower() == 'production'
