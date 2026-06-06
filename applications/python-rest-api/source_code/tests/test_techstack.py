from flask import make_response

TECHSTACK_UUID = 'cccccccc-cccc-cccc-cccc-cccccccccccc'


def test_techstack_list_requires_api_key(client):
    response = client.get('/techstack')

    assert response.status_code == 401


def test_create_techstack_with_valid_key(client, monkeypatch):
    from app import techstack

    def fake_insert(_data):
        response = make_response({'message': 'CREATED_SUCCESSFULLY'})
        response.status_code = 201
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(techstack, 'insert', fake_insert)

    response = client.post(
        '/techstack',
        headers={'API-Key': 'test-be-key'},
        json={'name': 'PHP', 'type': 1, 'expertise_level': 5, 'flag_important': 1},
    )

    assert response.status_code == 201


def test_get_techstack_with_valid_key(client, monkeypatch):
    from app import techstack

    def fake_get(_techstack_uuid):
        response = make_response([{'uuid': TECHSTACK_UUID, 'name': 'PHP'}])
        response.status_code = 200
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(techstack, 'get', fake_get)

    response = client.get(
        f'/techstack/{TECHSTACK_UUID}',
        headers={'API-Key': 'test-be-key'},
    )

    assert response.status_code == 200


def test_update_techstack_with_valid_key(client, monkeypatch):
    from app import techstack

    def fake_update(_techstack_uuid, _data):
        response = make_response({'message': 'UPDATED_SUCCESSFULLY'})
        response.status_code = 202
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(techstack, 'update', fake_update)

    response = client.put(
        f'/techstack/{TECHSTACK_UUID}',
        headers={'API-Key': 'test-be-key'},
        json={
            'uuid': TECHSTACK_UUID,
            'name': 'PHP 8',
            'type': 1,
            'expertise_level': 5,
            'flag_important': 1,
        },
    )

    assert response.status_code == 202


def test_delete_techstack_with_valid_key(client, monkeypatch):
    from app import techstack

    def fake_delete(_techstack_uuid):
        response = make_response({'message': 'DELETED_SUCCESSFULLY'})
        response.status_code = 202
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(techstack, 'delete', fake_delete)

    response = client.delete(
        f'/techstack/{TECHSTACK_UUID}',
        headers={'API-Key': 'test-be-key'},
    )

    assert response.status_code == 202
