import logging

from flask import Flask, request
from flask_cors import CORS

from configs.config import allowed_origins, api_keys, baseurl, is_production
from configs.logging_config import configure_logging
from module.customers.customers_repository import CustomersRepository
from module.helper.auth import require_api_key
from module.helper.error_handlers import register_error_handlers
from module.projects.projects_repository import ProjectsRepository
from module.techstack.techstack_repository import TechStackRepository

configure_logging()
logger = logging.getLogger(__name__)

app = Flask(__name__, static_url_path=baseurl)
app.config['PROPAGATE_EXCEPTIONS'] = not is_production()

CORS(app, origins=allowed_origins, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

register_error_handlers(app)

project = ProjectsRepository()
customer = CustomersRepository()
techstack = TechStackRepository()

require_be_key = require_api_key(api_keys, 'be_key')


@app.route(baseurl + '/project', methods=['GET', 'POST'])
@require_be_key
def project_route():
    if request.method == 'GET':
        return project.get_all()
    data = request.get_json()
    return project.insert(data)


@app.route(baseurl + '/customer', methods=['GET', 'POST'])
@require_be_key
def customer_route():
    if request.method == 'GET':
        return customer.get_all()
    data = request.get_json()
    return customer.insert(data)


@app.route(baseurl + '/techstack', methods=['GET', 'POST'])
@require_be_key
def techstack_route():
    if request.method == 'GET':
        return techstack.get_all()
    data = request.get_json()
    return techstack.insert(data)


@app.route(baseurl + '/techstack_types', methods=['GET'])
@require_be_key
def get_all_techstacktypes():
    return techstack.get_types()


@app.route(baseurl + '/project_types', methods=['GET'])
@require_be_key
def get_all_projecttypes():
    return project.get_types()


@app.route(baseurl + '/customer/<id>', methods=['GET', 'PUT', 'DELETE'])
@require_be_key
def get_customer(id):
    if request.method == 'GET':
        return customer.get(id)
    if request.method == 'PUT':
        return customer.update(id, request.get_json())
    return customer.delete(id)


@app.route(baseurl + '/project/<id>', methods=['GET', 'PUT', 'DELETE'])
@require_be_key
def get_project(id):
    if request.method == 'GET':
        return project.get(id)
    if request.method == 'PUT':
        return project.update(id, request.get_json())
    return project.delete(id)


@app.route(baseurl + '/techstack/<id>', methods=['GET', 'PUT', 'DELETE'])
@require_be_key
def get_techstack(id):
    if request.method == 'GET':
        return techstack.get(id)
    if request.method == 'PUT':
        return techstack.update(id, request.get_json())
    return techstack.delete(id)


@app.route(baseurl + '/healthcheck', methods=['GET'])
def healthcheck():
    from flask import jsonify

    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    app.run(port=8181, host='0.0.0.0')
