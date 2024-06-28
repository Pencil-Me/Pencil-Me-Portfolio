from flask import make_response
import logging
from module.techstack.techstack_helper import TechStackHelper
from module.techstack.techstack import TechStack
from module.helper.helper import Helper

logging.basicConfig(level=logging.DEBUG)

techstack_helper = TechStackHelper()
helper = Helper()

class TechStackRepository():
    def insert(self, data):
        #logging.debug('###### insert ########')

        new_techstack = TechStack(data)
        techstack_obj = new_techstack.to_dict()
        #logging.debug('data: %s', data)
        #logging.debug('techstack_obj: %s', techstack_obj)

        insert_techstack = techstack_helper.insert_techstack(techstack_obj)

        response = make_response({"message":"CREATED_SUCCESSFULLY"})
        response.status_code = 201
        response.mimetype = 'application/json'
        return response

    def get_types(self):
        #logging.debug('###### get_types ########')

        results = techstack_helper.get_techstack_types()
        #logging.debug('results %s', results)

        if results is not None and len(results) > 0:
            return_object = [{
                "id": result.get('id',''),
                "type": result.get('type',''),
            } for result in results]

            # Erstelle die Antwort mit dem Rückgabeobjekt
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

    def get(self, techstack_uuid):
        #logging.debug('###### get ########')
        #logging.debug('techstack_uuid: %s', techstack_uuid)

        result = techstack_helper.get_techstack(techstack_uuid)

        if result is not None:
            return_object = [TechStack(result).to_disp()]

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

        results = techstack_helper.get_all_techstacks()
        #logging.debug('results get_all_techstacks: %s', results)

        if results is not None and len(results) > 0:
            return_object = [
                TechStack(result).to_disp()
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
        #logging.debug('###### get_all ########')

        results = techstack_helper.get_all_techstacks_fe()
        #logging.debug('results get_all_techstacks_fe: %s', results)

        if results is not None and len(results) > 0:
            return_object = [
                TechStack(result).to_disp()
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

    def update(self, techstack_uuid, data):
        #logging.debug('###### update ########')

        update_techstack = TechStack(data)
        #logging.debug('Cleaned data: %s', update_techstack.to_dict())

        update_techstack = techstack_helper.update_techstack(update_techstack.to_dict())
        affected_rows = update_techstack['affected_rows']

        # logging.debug('Result: %s', affected_rows)

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

    def delete(self, techstack_uuid):
        #logging.debug('###### delete ########')

        affected_rows = techstack_helper.delete_techstack(techstack_uuid)

        # logging.debug('Result techstacks: %s', affected_rows['techstack'])

        if affected_rows["techstack"] > 0:
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
