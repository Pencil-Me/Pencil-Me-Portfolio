"""Deprecation-Helfer fuer legacy Python Read-Routen."""

from functools import wraps

from flask import make_response

DEPRECATION_SUNSET = '2026-08-01'


def _normalize_response(response):
    if isinstance(response, tuple):
        body = response[0]
        status = response[1] if len(response) > 1 else 200
        headers = response[2] if len(response) > 2 else {}
        normalized = make_response(body, status)
        if isinstance(headers, dict):
            normalized.headers.update(headers)
        return normalized
    return response


def _mark_deprecated(response, link: str):
    response = _normalize_response(response)
    response.headers['Deprecation'] = 'true'
    response.headers['Sunset'] = DEPRECATION_SUNSET
    response.headers['Link'] = link
    return response


def deprecated_fe_read_route(route_func):
    """Markiert Frontend-Read-Endpunkte als deprecated (ADR-001)."""

    @wraps(route_func)
    def wrapper(*args, **kwargs):
        return _mark_deprecated(
            route_func(*args, **kwargs),
            '</docs/adr/001-api-responsibilities.md>; rel="deprecation"; type="text/markdown"'
        )

    return wrapper


def deprecated_send_email_route(route_func):
    """Markiert Flask-Mail send_email als deprecated (ADR-001)."""

    @wraps(route_func)
    def wrapper(*args, **kwargs):
        return _mark_deprecated(
            route_func(*args, **kwargs),
            '</api2/send_email>; rel="successor-version"'
        )

    return wrapper
