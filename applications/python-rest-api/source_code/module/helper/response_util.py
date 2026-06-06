"""Einheitliche JSON-Fehlerantworten fuer Flask-Repositories."""

from flask import jsonify, make_response


def error_response(message: str, status_code: int):
    response = make_response(jsonify({'message': message}))
    response.status_code = status_code
    response.mimetype = 'application/json'
    return response


def not_found_response(message: str = 'No Data Found'):
    return error_response(message, 404)
