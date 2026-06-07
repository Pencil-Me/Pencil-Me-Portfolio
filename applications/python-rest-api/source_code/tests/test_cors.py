def test_evil_origin_not_reflected(client):
    response = client.get(
        '/healthcheck',
        headers={'Origin': 'https://evil.example'},
    )

    assert response.status_code == 200
    assert response.headers.get('Access-Control-Allow-Origin') != 'https://evil.example'


def test_allowed_origin_is_reflected(client):
    response = client.get(
        '/healthcheck',
        headers={'Origin': 'http://localhost:8080'},
    )

    assert response.status_code == 200
    assert response.headers.get('Access-Control-Allow-Origin') == 'http://localhost:8080'
