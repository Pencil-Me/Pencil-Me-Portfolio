from flask import make_response
import logging
from module.customers.customers_helper import CustomerHelper
from module.customers.customers import Customer
from module.helper.helper import Helper

logging.basicConfig(level=logging.DEBUG)

customer_helper = CustomerHelper()
helper = Helper()

class CustomersRepository():
    def insert(self, data):
        #logging.debug('###### insert ########')

        new_customer = Customer(data)
        customer_obj = new_customer.to_dict()
        #logging.debug('customer_obj: %s', customer_obj)

        insert_customer = customer_helper.insert_customer(customer_obj)
        #logging.debug('insert_customer: %s', insert_customer)

        # Erstelle die Antwort und setze den Statuscode
        response = make_response({"message":"CREATED_SUCCESSFULLY"})
        response.status_code = 201
        response.mimetype = 'application/json'
        return response

    def get(self, customer_uuid):
        #logging.debug('###### get ########')
        #logging.debug('customer_uuid: %s', customer_uuid)

        result = customer_helper.get_customer(customer_uuid)

        if result is not None:
            # Erstelle das Rückgabeobjekt mit den Projektinformationen
            return_object = [Customer(result).to_disp()]

            # Erstelle die Antwort mit dem Rückgabeobjekt
            response = make_response(return_object)
            response.status_code = 200
            response.mimetype = 'application/json'
            return response
        else:
            # Rückgabe, falls keine Daten gefunden wurden
            response = make_response("No Data Found")
            response.status_code = 404
            response.mimetype = 'application/json'
            return response

    def get_all(self):
        #logging.debug('###### get_all ########')

        results = customer_helper.get_all_customers()
        #logging.debug('results get_all_customers: %s', results)

        if results is not None and len(results) > 0:

            return_object = [
                Customer(result).to_disp()
                for result in results
            ]
            #logging.debug('return_object: %s', return_object)

            response = make_response(return_object)
            response.status_code = 200
            response.mimetype = 'application/json'
            return response
        else:
            # Rückgabe, falls keine Daten gefunden wurden
            response = make_response([])
            response.status_code = 200
            response.mimetype = 'application/json'
            return response

    def get_all_fe(self):
        # logging.debug('###### get_all_fe ########')

        results = customer_helper.get_all_customers_fe()
        # logging.debug('results get_all_customers: %s', results)

        if results is not None and len(results) > 0:
            return_object = [
                Customer(result).to_disp()
                for result in results
            ]
            # logging.debug('return_object: %s', return_object)

            response = make_response(return_object)
            response.status_code = 200
            response.mimetype = 'application/json'
            return response
        else:
            # Rückgabe, falls keine Daten gefunden wurden
            response = make_response([])
            response.status_code = 200
            response.mimetype = 'application/json'
            return response

    def update(self, customer_uuid, data):
        #logging.debug('###### update ########')

        customer_to_update = Customer(data)
        #logging.debug('Cleaned update data: %s', customer_to_update.to_dict())

        update_customer = customer_helper.update_customer(customer_to_update.to_dict())
        affected_rows = update_customer['affected_rows']

        if affected_rows > 0:
            response_data = {"message": "UPDATED_SUCCESSFULLY"}
            response = make_response(response_data)
            response.status_code = 202
            response.mimetype = 'application/json'
            return response
        else:
            response_data = {"message": "NOTHING_TO_UPDATE"}
            response = make_response(response_data)
            response.status_code = 204
            response.mimetype = 'application/json'
            return response

    def delete(self, customer_uuid):
        #logging.debug('###### delete ########')

        affected_rows = customer_helper.delete_customer(customer_uuid)

        #logging.debug('Result customers: %s', affected_rows['customers'])
        #logging.debug('Result techstack: %s', affected_rows['techstack'])
        #logging.debug('Result dates: %s', affected_rows['dates'])

        if affected_rows['customers'] > 0:
            response_data = {"message": "DELETED_SUCCESSFULLY"}
            response = make_response(response_data)
            response.status_code = 202
            response.mimetype = 'application/json'
            return response
        else:
            response_data = {"message": "NOTHING_TO_DELETE"}
            response = make_response(response_data)
            response.status_code = 204
            response.mimetype = 'application/json'
            return response
