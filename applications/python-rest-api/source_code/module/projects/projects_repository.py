from flask import make_response
import logging
from module.projects.projects_helper import ProjectHelper
from module.projects.projects import Project
from module.helper.helper import Helper

logging.basicConfig(level=logging.DEBUG)

project_helper = ProjectHelper()
helper = Helper()

class ProjectsRepository():
    def insert(self, data):
        #logging.debug('###### insert ########')

        new_project = Project(data)
        project_obj = new_project.to_dict()
        #logging.debug('project_obj: %s', project_obj)

        insert_project = project_helper.insert_project(project_obj)
        project_helper.insert_project_techstack(project_obj)
        project_helper.insert_project_dates(project_obj)
        project_helper.insert_project_customers(project_obj)

        # Erstelle die Antwort und setze den Statuscode
        response = make_response({"message":"CREATED_SUCCESSFULLY"})
        response.status_code = 201
        response.mimetype = 'application/json'
        return response

    def get_types(self):
        #logging.debug('###### get_types ########')

        results = project_helper.get_project_types()
        #logging.debug('results %s', results)

        if results is not None and len(results) > 0:
            return_object = [{
                "id": result.get('id',''),
                "type": result.get('type','')
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

    def get(self, project_uuid):
        #logging.debug('###### get ########')
        #logging.debug('project_uuid: %s', project_uuid)

        result = project_helper.get_project(project_uuid)

        if result is not None:
            # Initialisiere das Rückgabearray für das Ergebnis
            result['tech'] = []
            techstack_uuids = result.get('techstack_uuids',[])

            if techstack_uuids is not None and len(techstack_uuids) > 0:
                result['tech'] = project_helper.get_all_techstacks_per_project(techstack_uuids)

            result['dates'] = project_helper.get_all_dates_per_project(result)

            result['customers'] = []
            customers_uuids = result.get('customer_uuids',[])

            if customers_uuids is not None and len(customers_uuids) > 0:
                result['customers'] = project_helper.get_all_customers_per_project(customers_uuids)

            # Erstelle das Rückgabeobjekt mit den Projektinformationen
            return_object = Project(result).to_disp()

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

        results = project_helper.get_all_projects()
        #logging.debug('results get_all_projects: %s', results)

        if results is not None and len(results) > 0:
            for row in results:
                row['tech'] = []
                techstack_uuids = row.get('techstack_uuids',[])

                if techstack_uuids is not None and len(techstack_uuids) > 0:
                    row['tech'] = project_helper.get_all_techstacks_per_project(techstack_uuids)

                row['dates'] = project_helper.get_all_dates_per_project(row)

                row['customers'] = []
                customer_uuids = row.get('customer_uuids',[])

                if customer_uuids is not None and len(customer_uuids) > 0:
                    row['customers'] = project_helper.get_all_customers_per_project(customer_uuids)

            return_object = [
                Project(result).to_disp()
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

    def get_all_fe(self):
        # logging.debug('###### get_all_fe ########')

        results = project_helper.get_all_projects_fe()
        # logging.debug('results get_all_projects: %s', results)

        if results is not None and len(results) > 0:
            for row in results:
                row['tech'] = []
                techstack_uuids = row.get('techstack_uuids',[])

                if techstack_uuids is not None and len(techstack_uuids) > 0:
                    row['tech'] = project_helper.get_all_techstacks_per_project(techstack_uuids)

                row['dates'] = project_helper.get_all_dates_per_project(row)

                row['customers'] = []
                customer_uuids = row.get('customer_uuids',[])

                if customer_uuids is not None and len(customer_uuids) > 0:
                    row['customers'] = project_helper.get_all_customers_per_project(customer_uuids)

            return_object = [
                Project(result).to_disp()
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

    def update(self, project_uuid, data):
        #logging.debug('###### update ########')

        project_to_update = Project(data)
        #logging.debug('Cleaned update data: %s', project_to_update.to_dict())

        update_project = project_helper.update_project(project_to_update.to_dict())
        affected_rows = update_project['affected_rows']

        project_helper.update_techstack_for_project(project_to_update.to_dict())
        project_helper.update_dates_for_project(project_to_update.to_dict())
        project_helper.update_customers_for_project(project_to_update.to_dict())

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

    def delete(self, project_uuid):
        #logging.debug('###### delete ########')

        affected_rows = project_helper.delete_project(project_uuid)

        #logging.debug('Result projects: %s', affected_rows['projects'])
        #logging.debug('Result techstack: %s', affected_rows['techstack'])
        #logging.debug('Result dates: %s', affected_rows['dates'])

        if affected_rows['projects'] > 0:
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
