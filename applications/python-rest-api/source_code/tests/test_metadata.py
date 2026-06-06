from flask import make_response


def test_project_types_requires_api_key(client):
    response = client.get('/project_types')

    assert response.status_code == 401


def test_project_types_with_valid_key(client, monkeypatch):
    from app import project

    def fake_get_types():
        response = make_response([{'id': 1, 'type': 'Web'}])
        response.status_code = 200
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(project, 'get_types', fake_get_types)

    response = client.get('/project_types', headers={'API-Key': 'test-be-key'})

    assert response.status_code == 200
    assert response.get_json()[0]['type'] == 'Web'


def test_techstack_types_requires_api_key(client):
    response = client.get('/techstack_types')

    assert response.status_code == 401


def test_techstack_types_with_valid_key(client, monkeypatch):
    from app import techstack

    def fake_get_types():
        response = make_response([{'id': 1, 'type': 'Backend'}])
        response.status_code = 200
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(techstack, 'get_types', fake_get_types)

    response = client.get('/techstack_types', headers={'API-Key': 'test-be-key'})

    assert response.status_code == 200
    assert response.get_json()[0]['type'] == 'Backend'
