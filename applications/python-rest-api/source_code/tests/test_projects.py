from flask import make_response


def test_create_project_requires_api_key(client):
    response = client.post('/project', json={'name': 'Test Project'})

    assert response.status_code == 401
    assert response.get_json()['message'] == 'Ungültiger API-Key'


def test_create_project_with_valid_key(client, monkeypatch):
    from app import project

    def fake_insert(_data):
        response = make_response({'message': 'CREATED_SUCCESSFULLY'})
        response.status_code = 201
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(project, 'insert', fake_insert)

    response = client.post(
        '/project',
        headers={'API-Key': 'test-be-key'},
        json={'name': 'Test Project'},
    )

    assert response.status_code == 201
    assert response.get_json()['message'] == 'CREATED_SUCCESSFULLY'
