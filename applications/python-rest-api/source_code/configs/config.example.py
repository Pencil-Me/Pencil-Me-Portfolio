"""Deprecated: use `.env` (see `.env.example`) — config loads from environment via config.py."""

dbconfig = {
    'host': 'DB_HOST',
    'port': 'DB_PORT',
    'username': 'DB_USERNAME',
    'password': 'DB_PASSWORD',
    'database': 'DB_DATABASE',
}

mailconfig = {
    'host': 'MAIL_HOST',
    'port': 'MAIL_PORT',
    'username': 'MAIL_USERNAME',
    'password': 'MAIL_PASSWORD',
    'sender': 'MAIL_SENDER',
    'recipient': 'MAIL_RECIPIENT',
}

api_keys = {
    'fe_key': 'API_KEY_FE',
    'be_key': 'API_KEY_BE',
}

baseurl = 'BASE_URL'
