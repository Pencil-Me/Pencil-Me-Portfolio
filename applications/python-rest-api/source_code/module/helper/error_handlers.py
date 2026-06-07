"""Register global JSON error handlers on the Flask app."""

from __future__ import annotations

from flask import Flask, jsonify


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(400)
    def bad_request(_error=None):
        return jsonify({'message': 'Bad request'}), 400

    @app.errorhandler(401)
    def unauthorized(_error=None):
        return jsonify({'message': 'Ungültiger API-Key'}), 401

    @app.errorhandler(404)
    def not_found(_error=None):
        return jsonify({'message': 'Not Found'}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error=None):
        return jsonify({'message': 'Method not allowed'}), 405

    @app.errorhandler(500)
    def internal_error(_error=None):
        return jsonify({'message': 'An unexpected error occurred. Please try again later.'}), 500
