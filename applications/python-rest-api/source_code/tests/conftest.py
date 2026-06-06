import os

import pytest

# Env must be set before config/app imports in tests.
os.environ.setdefault('APP_ENV', 'test')
os.environ.setdefault('BASE_URL', '')

_TEST_ENV_DEFAULTS = {
    'DB_HOST': 'localhost',
    'DB_PORT': '3306',
    'DB_USERNAME': 'test',
    'DB_PASSWORD': 'test',
    'DB_DATABASE': 'portfolio_db_test',
    'MAIL_HOST': 'smtp.example.com',
    'MAIL_PORT': '587',
    'MAIL_USERNAME': 'mail@example.com',
    'MAIL_PASSWORD': 'test',
    'MAIL_SENDER': 'mail@example.com',
    'MAIL_RECIPIENT': 'mail@example.com',
    'API_KEY_FE': 'test-fe-key',
    'API_KEY_BE': 'test-be-key',
}

for _key, _value in _TEST_ENV_DEFAULTS.items():
    os.environ.setdefault(_key, _value)


@pytest.fixture
def app_context():
    from app import app

    with app.app_context():
        yield app


@pytest.fixture
def client():
    from app import app

    app.config['TESTING'] = True
    with app.test_client() as test_client:
        yield test_client
