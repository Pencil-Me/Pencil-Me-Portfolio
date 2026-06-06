from flask import make_response

CUSTOMER_UUID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'


def test_customer_list_requires_api_key(client):
    response = client.get('/customer')

    assert response.status_code == 401


def test_create_customer_with_valid_key(client, monkeypatch):
    from app import customer

    def fake_insert(_data):
        response = make_response({'message': 'CREATED_SUCCESSFULLY'})
        response.status_code = 201
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(customer, 'insert', fake_insert)

    response = client.post(
        '/customer',
        headers={'API-Key': 'test-be-key'},
        json={'name': 'ACME', 'location': 'Berlin'},
    )

    assert response.status_code == 201


def test_get_customer_with_valid_key(client, monkeypatch):
    from app import customer

    def fake_get(_customer_uuid):
        response = make_response([{'uuid': CUSTOMER_UUID, 'name': 'ACME'}])
        response.status_code = 200
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(customer, 'get', fake_get)

    response = client.get(
        f'/customer/{CUSTOMER_UUID}',
        headers={'API-Key': 'test-be-key'},
    )

    assert response.status_code == 200


def test_update_customer_with_valid_key(client, monkeypatch):
    from app import customer

    def fake_update(_customer_uuid, _data):
        response = make_response({'message': 'UPDATED_SUCCESSFULLY'})
        response.status_code = 202
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(customer, 'update', fake_update)

    response = client.put(
        f'/customer/{CUSTOMER_UUID}',
        headers={'API-Key': 'test-be-key'},
        json={'uuid': CUSTOMER_UUID, 'name': 'ACME GmbH', 'location': 'Hamburg'},
    )

    assert response.status_code == 202


def test_delete_customer_with_valid_key(client, monkeypatch):
    from app import customer

    def fake_delete(_customer_uuid):
        response = make_response({'message': 'DELETED_SUCCESSFULLY'})
        response.status_code = 202
        response.mimetype = 'application/json'
        return response

    monkeypatch.setattr(customer, 'delete', fake_delete)

    response = client.delete(
        f'/customer/{CUSTOMER_UUID}',
        headers={'API-Key': 'test-be-key'},
    )

    assert response.status_code == 202
