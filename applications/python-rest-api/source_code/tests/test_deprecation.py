"""Tests fuer deprecated Frontend-Read-Routen (ADR-001)."""

from flask import make_response


def test_all_projects_fe_returns_deprecation_header(client, monkeypatch):
    from app import project

    def fake_get_all_fe():
        response = make_response([])
        response.status_code = 200
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(project, 'get_all_fe', fake_get_all_fe)

    response = client.get('/all_projects', headers={'API-Key': 'test-fe-key'})

    assert response.status_code == 200
    assert response.headers.get('Deprecation') == 'true'
    assert response.headers.get('Sunset') == '2026-08-01'


def test_send_email_returns_deprecation_header(client, monkeypatch):
    from app import mail

    monkeypatch.setattr(mail, 'send', lambda msg: None)

    response = client.put(
        '/send_email',
        headers={'API-Key': 'test-fe-key'},
        json={
            'name': 'Test',
            'email': 'test@example.com',
            'message': 'Hello',
            'contactByFax': None
        }
    )

    assert response.status_code == 200
    assert response.headers.get('Deprecation') == 'true'
    assert 'successor-version' in response.headers.get('Link', '')
