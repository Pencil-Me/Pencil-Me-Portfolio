"""Flask logging configuration."""

from __future__ import annotations

import logging
import os


def configure_logging() -> None:
    app_env = os.getenv('APP_ENV', 'development').lower()
    configured_level = os.getenv('LOG_LEVEL', '')

    if configured_level:
        level_name = configured_level.upper()
    elif app_env == 'production':
        level_name = 'INFO'
    else:
        level_name = 'DEBUG'

    level = getattr(logging, level_name, logging.INFO)
    logging.basicConfig(level=level, format='%(levelname)s %(name)s: %(message)s')

    if app_env == 'production':
        logging.getLogger('werkzeug').setLevel(logging.WARNING)
        logging.getLogger('flask').setLevel(logging.WARNING)
