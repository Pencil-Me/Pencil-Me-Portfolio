import logging

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_mail import Mail, Message

from configs.config import api_keys, baseurl, is_production, mailconfig
from configs.logging_config import configure_logging
from module.customers.customers_repository import CustomersRepository
from module.helper.auth import require_api_key
from module.helper.deprecation import deprecated_fe_read_route, deprecated_send_email_route
from module.helper.error_handlers import register_error_handlers
from module.projects.projects_repository import ProjectsRepository
from module.techstack.techstack_repository import TechStackRepository

configure_logging()
logger = logging.getLogger(__name__)

app = Flask(__name__, static_url_path=baseurl)
app.config['PROPAGATE_EXCEPTIONS'] = not is_production()

app.config['MAIL_SERVER'] = mailconfig['host']
app.config['MAIL_PORT'] = mailconfig['port']
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = mailconfig['username']
app.config['MAIL_PASSWORD'] = mailconfig['password']

mail = Mail(app)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

register_error_handlers(app)

project = ProjectsRepository()
customer = CustomersRepository()
techstack = TechStackRepository()

require_be_key = require_api_key(api_keys, 'be_key')
require_fe_key = require_api_key(api_keys, 'fe_key')


@app.route(baseurl + '/project', methods=['GET', 'POST'])
@cross_origin()
@require_be_key
def project_route():
    if request.method == 'GET':
        return project.get_all()
    data = request.get_json()
    return project.insert(data)


@app.route(baseurl + '/customer', methods=['GET', 'POST'])
@cross_origin()
@require_be_key
def customer_route():
    if request.method == 'GET':
        return customer.get_all()
    data = request.get_json()
    return customer.insert(data)


@app.route(baseurl + '/techstack', methods=['GET', 'POST'])
@cross_origin()
@require_be_key
def techstack_route():
    if request.method == 'GET':
        return techstack.get_all()
    data = request.get_json()
    return techstack.insert(data)


@app.route(baseurl + '/all_projects', methods=['GET'])
@cross_origin()
@deprecated_fe_read_route
@require_fe_key
def get_all_projects_fe():
    """Deprecated: use PHP GET /api2/all_projects (ADR-001)."""
    return project.get_all_fe()


@app.route(baseurl + '/get_project/<id>', methods=['GET'])
@cross_origin()
@deprecated_fe_read_route
@require_fe_key
def get_fe_project(id):
    """Deprecated: use PHP GET /api2/get_project/{id} (ADR-001)."""
    return project.get(id)


@app.route(baseurl + '/all_customers', methods=['GET'])
@cross_origin()
@deprecated_fe_read_route
@require_fe_key
def get_all_customers_fe():
    """Deprecated: use PHP GET /api2/all_customers (ADR-001)."""
    return customer.get_all_fe()


@app.route(baseurl + '/all_techstacks', methods=['GET'])
@cross_origin()
@deprecated_fe_read_route
@require_fe_key
def get_all_techstacks_fe():
    """Deprecated: use PHP GET /api2/all_techstacks (ADR-001)."""
    return techstack.get_all_fe()


@app.route(baseurl + '/techstack_types', methods=['GET'])
@cross_origin()
@require_be_key
def get_all_techstacktypes():
    return techstack.get_types()


@app.route(baseurl + '/project_types', methods=['GET'])
@cross_origin()
@require_be_key
def get_all_projecttypes():
    return project.get_types()


@app.route(baseurl + '/customer/<id>', methods=['GET', 'PUT', 'DELETE'])
@cross_origin()
@require_be_key
def get_customer(id):
    if request.method == 'GET':
        return customer.get(id)
    if request.method == 'PUT':
        return customer.update(id, request.get_json())
    return customer.delete(id)


@app.route(baseurl + '/project/<id>', methods=['GET', 'PUT', 'DELETE'])
@cross_origin()
@require_be_key
def get_project(id):
    if request.method == 'GET':
        return project.get(id)
    if request.method == 'PUT':
        return project.update(id, request.get_json())
    return project.delete(id)


@app.route(baseurl + '/techstack/<id>', methods=['GET', 'PUT', 'DELETE'])
@cross_origin()
@require_be_key
def get_techstack(id):
    if request.method == 'GET':
        return techstack.get(id)
    if request.method == 'PUT':
        return techstack.update(id, request.get_json())
    return techstack.delete(id)


@app.route(baseurl + '/send_email', methods=['PUT'])
@cross_origin()
@deprecated_send_email_route
@require_fe_key
def send_test_email():
    """Deprecated: use PHP POST /api2/send_email -> Mailer (ADR-001)."""
    logger.warning(
        'Deprecated route PUT /send_email called — use PHP POST /api2/send_email'
    )

    data = request.get_json() or {}

    if data.get('contactByFax') is not None:
        return jsonify({'message': 'Fax contact is not allowed.'}), 400

    subject = 'Contact Form Email'
    sender = mailconfig['sender']
    recipients = [mailconfig['recipient']]

    if data.get('sendCopy') and 'email' in data:
        recipients.append(data.get('email'))

    name = data.get('name', 'No Name given')
    email = data.get('email', 'No Email given')
    message = data.get('message', 'No Message given.')
    body = (
        f'EMAIL FROM CONTACT FORM\n\nNAME:\n{name}\n\nEMAIL:\n{email}\n\nMESSAGE:\n{message}'
    )

    for recipient in recipients:
        msg = Message(subject, sender=sender, recipients=[recipient])
        msg.body = body
        msg.extra_headers = {'X-Mailer': 'Flask-Mail', 'X-Priority': '1'}
        mail.send(msg)

    return jsonify({'message': 'email send'}), 200


@app.route(baseurl + '/healthcheck', methods=['GET'])
@cross_origin()
def healthcheck():
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    app.run(port=8181, host='0.0.0.0')
