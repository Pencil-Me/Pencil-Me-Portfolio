from flask import make_response


def test_project_route_requires_api_key(client):
    response = client.get('/project')

    assert response.status_code == 401
    assert response.get_json()['message'] == 'Ungültiger API-Key'


def test_project_route_rejects_invalid_api_key(client):
    response = client.get('/project', headers={'API-Key': 'wrong-key'})

    assert response.status_code == 401


def test_project_route_accepts_valid_be_key(client, monkeypatch):
    from app import project

    def fake_get_all():
        response = make_response([])
        response.status_code = 200
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(project, 'get_all', fake_get_all)

    response = client.get('/project', headers={'API-Key': 'test-be-key'})

    assert response.status_code == 200
