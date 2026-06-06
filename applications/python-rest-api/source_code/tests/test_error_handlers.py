def test_unknown_route_returns_404(client):
    response = client.get('/does-not-exist', headers={'API-Key': 'test-be-key'})

    assert response.status_code == 404
    assert 'message' in response.get_json()


def test_wrong_method_on_healthcheck_returns_405(client):
    response = client.post('/healthcheck')

    assert response.status_code == 405
    assert response.get_json()['message'] == 'Method not allowed'


def test_project_route_without_key_returns_401(client):
    response = client.get('/project')

    assert response.status_code == 401
    assert response.get_json()['message'] == 'Ungültiger API-Key'
