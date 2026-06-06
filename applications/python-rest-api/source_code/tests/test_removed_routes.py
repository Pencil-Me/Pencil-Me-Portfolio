import pytest

REMOVED_LEGACY_ROUTES = [
    ('GET', '/all_projects'),
    ('GET', '/get_project/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'),
    ('GET', '/all_customers'),
    ('GET', '/all_techstacks'),
    ('PUT', '/send_email'),
]


@pytest.mark.parametrize(('method', 'path'), REMOVED_LEGACY_ROUTES)
def test_removed_legacy_routes_return_404(client, method, path):
    response = client.open(
        path,
        method=method,
        headers={'API-Key': 'test-be-key'},
    )

    assert response.status_code in (404, 405)
    assert 'message' in response.get_json()
