"""Central API-key authentication for Flask routes."""

from __future__ import annotations

import hmac
from functools import wraps
from typing import Callable, TypeVar

from flask import jsonify, request

F = TypeVar('F', bound=Callable)


def is_api_key_valid(api_keys: dict[str, str], required_key: str) -> bool:
    provided = request.headers.get('API-Key')
    expected = api_keys.get(required_key)

    if not provided or not expected:
        return False

    return hmac.compare_digest(
        provided.encode('utf-8'),
        expected.encode('utf-8'),
    )


def require_api_key(api_keys: dict[str, str], required_key: str) -> Callable[[F], F]:
    """Decorator factory — timing-safe key check (PHP hash_equals equivalent)."""

    def decorator(route_func: F) -> F:
        @wraps(route_func)
        def wrapper(*args, **kwargs):
            if not is_api_key_valid(api_keys, required_key):
                return jsonify({'message': 'Ungültiger API-Key'}), 401
            return route_func(*args, **kwargs)

        return wrapper  # type: ignore[return-value]

    return decorator
