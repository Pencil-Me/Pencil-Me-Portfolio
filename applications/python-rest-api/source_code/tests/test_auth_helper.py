from module.helper.auth import is_api_key_valid


def test_is_api_key_valid_uses_timing_safe_compare():
    from flask import Flask

    app = Flask(__name__)
    api_keys = {'be_key': 'secret-be-key'}

    with app.test_request_context('/', headers={'API-Key': 'wrong-key'}):
        assert is_api_key_valid(api_keys, 'be_key') is False

    with app.test_request_context('/', headers={'API-Key': 'secret-be-key'}):
        assert is_api_key_valid(api_keys, 'be_key') is True

    with app.test_request_context('/'):
        assert is_api_key_valid(api_keys, 'be_key') is False


def test_is_api_key_valid_rejects_empty_expected():
    from flask import Flask

    app = Flask(__name__)

    with app.test_request_context('/', headers={'API-Key': 'any-key'}):
        assert is_api_key_valid({'be_key': ''}, 'be_key') is False
