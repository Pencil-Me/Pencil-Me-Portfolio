from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS, cross_origin
from module.projects.projects_repository import ProjectsRepository
from module.techstack.techstack_repository import TechStackRepository
from module.customers.customers_repository import CustomersRepository
from configs.config import baseurl
from configs.config import mailconfig
from configs.config import api_keys
from functools import wraps
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__, static_url_path=baseurl)

app.config['MAIL_SERVER'] = mailconfig['host']
app.config['MAIL_PORT'] = mailconfig['port']
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = mailconfig['username']
app.config['MAIL_PASSWORD'] = mailconfig['password']

mail = Mail(app)

API_KEYS = api_keys

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

project = ProjectsRepository()
customer = CustomersRepository()
techstack = TechStackRepository()

def authenticate_api_key(required_key):
    api_key = request.headers.get('API-Key')
    if not api_key:
        return False
    return api_key == API_KEYS.get(required_key)

def protected_route(required_key):
    def decorator(route_func):
        @wraps(route_func)
        def wrapper(*args, **kwargs):
            if not authenticate_api_key(required_key):
                return jsonify({'message': 'Ungültiger API-Key'}), 401
            return route_func(*args, **kwargs)
        return wrapper
    return decorator

@app.route(baseurl + "/project", methods=["GET", "POST"])
@cross_origin()
@protected_route('be_key')
def project_route():
    if request.method == "GET":
        return project.get_all()
    elif request.method == "POST":
        data = request.get_json()
        return project.insert(data)

@app.route(baseurl + "/customer", methods=["GET", "POST"])
@cross_origin()
@protected_route('be_key')
def customer_route():
    if request.method == "GET":
        return customer.get_all()
    elif request.method == "POST":
        data = request.get_json()
        return customer.insert(data)

@app.route(baseurl + "/techstack", methods=["GET", "POST"])
@cross_origin()
@protected_route('be_key')
def techstack_route():
    if request.method == "GET":
        return techstack.get_all()
    elif request.method == "POST":
        data = request.get_json()
        return techstack.insert(data)

@app.route(baseurl + "/all_projects", methods=["GET"])
@cross_origin()
@protected_route('fe_key')
def get_all_projects_fe():
    return project.get_all_fe()

@app.route(baseurl + "/get_project/<id>", methods=["GET"])
@cross_origin()
@protected_route('fe_key')
def get_fe_project(id):
    return project.get(id)

@app.route(baseurl + "/all_customers", methods=["GET"])
@cross_origin()
@protected_route('fe_key')
def get_all_customers_fe():
    return customer.get_all_fe()

@app.route(baseurl + "/all_techstacks", methods=["GET"])
@cross_origin()
@protected_route('fe_key')
def get_all_techstacks_fe():
    return techstack.get_all_fe()

@app.route(baseurl + "/techstack_types", methods=["GET"])
@cross_origin()
@protected_route('be_key')
def get_all_techstacktypes():
    return techstack.get_types()

@app.route(baseurl + "/project_types", methods=["GET"])
@cross_origin()
@protected_route('be_key')
def get_all_projecttypes():
    return project.get_types()

@app.route(baseurl + "/customer/<id>", methods=["GET","PUT","DELETE"])
@cross_origin()
@protected_route('be_key')
def get_customer(id):
    if request.method == "GET":
        return customer.get(id)
    elif request.method == "PUT":
        data = request.get_json()
        return customer.update(id, data)
    elif request.method == "DELETE":
        return customer.delete(id)

@app.route(baseurl + "/project/<id>", methods=["GET","PUT","DELETE"])
@cross_origin()
@protected_route('be_key')
def get_project(id):
    if request.method == "GET":
        return project.get(id)
    elif request.method == "PUT":
        data = request.get_json()
        return project.update(id, data)
    elif request.method == "DELETE":
        return project.delete(id)

@app.route(baseurl + "/techstack/<id>", methods=["GET","PUT","DELETE"])
@cross_origin()
@protected_route('be_key')
def get_techstack(id):
    if request.method == "GET":
        return techstack.get(id)
    elif request.method == "PUT":
        data = request.get_json()
        return techstack.update(id, data)
    elif request.method == "DELETE":
        return techstack.delete(id)

@app.route(baseurl + '/send_email', methods=["PUT"])
@cross_origin()
@protected_route('fe_key')
def send_test_email():
    # logging.debug('###### send_test_email ########')
    data = request.get_json()
    # logging.debug('data: %s', data)

    # Bedingung 2: Überprüfen, ob 'contactByFax' etwas anderes als null ist
    if data.get('contactByFax') is not None:
        message = {
            'status': 400,
            'message': 'Fax contact is not allowed.',
        }
        resp = jsonify(message)
        resp.status_code = 400
        return resp

    subject = "Contact Form Email"
    sender = mailconfig['sender']
    recipients = [mailconfig['recipient']]

    # Bedingung 1: Überprüfen, ob 'sendCopy' true ist und 'email' in data vorhanden ist
    if data.get('sendCopy') and 'email' in data:
        recipients.append(data.get('email'))

    name = data.get('name', 'No Name given')
    email = data.get('email', 'No Email given')
    message = data.get('message', 'No Message given.')
    body = f'EMAIL FROM CONTACT FORM\n\nNAME:\n{name}\n\nEMAIL:\n{email}\n\nMESSAGE:\n{message}'

    # Senden einer separaten E-Mail an jeden Empfänger
    for recipient in recipients:
        recipient_email = recipient
        msg = Message(subject, sender=sender, recipients=[recipient_email])
        msg.body = body
        msg.extra_headers = {'X-Mailer': 'Flask-Mail', 'X-Priority': '1'}
        mail.send(msg)

    message = {
        'status': 200,
        'message': 'email send',
    }
    resp = jsonify(message)
    resp.status_code = 200
    return resp

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404
    return resp

if __name__ == '__main__':
    app.run(port=8181, host="0.0.0.0")
