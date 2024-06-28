from module.db.db import SqlBase, SqlError
from configs.config import dbconfig
from datetime import datetime
import logging

logging.basicConfig(level=logging.DEBUG)

class ProjectHelper(SqlBase):
    def __init__(self):
        SqlBase.__init__(self, host=dbconfig['host'],user=dbconfig['username'],password=dbconfig['password'],database=dbconfig['database'])

    def get_all_projects(self):
        #logging.debug('###### get_all_projects ########')

        query = """
            SELECT
                BIN_TO_UUID(p.uuid) as uuid,
                p.type,
                p.name,
                p.public,
                p.location,
                p.position,
                p.content,
                GROUP_CONCAT(DISTINCT BIN_TO_UUID(pt.techstack_id)) as techstack_uuids,
                GROUP_CONCAT(DISTINCT BIN_TO_UUID(pc.customer_id)) as customer_uuids
            FROM
                projects p
            LEFT JOIN
                project_techstack pt ON p.uuid = pt.project_id
            LEFT JOIN
                project_customer pc ON p.uuid = pc.project_id
            GROUP BY
                uuid,
                p.type,
                p.public,
                p.name,
                p.location,
                p.position,
                p.content
        """
        return self.select_all(query)

    def get_all_projects_fe(self):
        #logging.debug('###### get_all_projects_fe ########')

        query = """
            SELECT
                BIN_TO_UUID(p.uuid) as uuid,
                (
                SELECT
                    pt.type
                FROM
                    project_type pt
                WHERE
                    id=p.type
                ) as type,
                p.name,
                p.public,
                p.location,
                p.position,
                p.content,
                GROUP_CONCAT(DISTINCT BIN_TO_UUID(pt.techstack_id)) as techstack_uuids,
                GROUP_CONCAT(DISTINCT BIN_TO_UUID(pc.customer_id)) as customer_uuids
            FROM
                projects p
            LEFT JOIN
                project_techstack pt ON p.uuid = pt.project_id
            LEFT JOIN
                project_customer pc ON p.uuid = pc.project_id
            GROUP BY
                p.uuid,
                p.type,
                p.name,
                p.location,
                p.position,
                p.content
        """
        return self.select_all(query)

    def get_all_techstacks_per_project(self, techstack_uuids):
        #logging.debug('###### get_all_techstacks_per_project ########')
        #logging.debug('techstack_uuids: %s', techstack_uuids)

        techstack_uuids = techstack_uuids.split(',')
        techstack_query = "SELECT BIN_TO_UUID(uuid) as uuid, name, type, expertise_level FROM techstack WHERE uuid IN (%s)" % ','.join(['UUID_TO_BIN(%s)'] * len(techstack_uuids))
        techstack_results = self.select_all(techstack_query, techstack_uuids)

        #logging.debug('techstack_results: %s', techstack_results)

        return [{
           "uuid": techstack_result['uuid'],
           "name": techstack_result['name'],
           "type": techstack_result['type'],
           "expertise_level": techstack_result['expertise_level']
        } for techstack_result in techstack_results]

    def get_all_customers_per_project(self, customer_uuids):
        #logging.debug('###### get_all_customers_per_project ########')
        #logging.debug('customer_uuids: %s', customer_uuids)

        customer_uuids = customer_uuids.split(',')
        customer_query = "SELECT BIN_TO_UUID(uuid) as uuid, name, location FROM customers WHERE uuid IN (%s)" % ','.join(['UUID_TO_BIN(%s)'] * len(customer_uuids))
        customer_results = self.select_all(customer_query, customer_uuids)

        #logging.debug('customer_results: %s', customer_results)

        return [{
           "uuid": customer_result['uuid'],
           "name": customer_result['name'],
           "location": customer_result['location']
        } for customer_result in customer_results]

    def get_all_dates_per_project(self, data):
        #logging.debug('###### get_all_dates_per_project ########')
        #logging.debug('data: %s', data)

        dates_query = "SELECT start_date, end_date FROM project_dates WHERE project_id=UUID_TO_BIN(%s)"
        dates_results = self.select_all(dates_query, data['uuid'])

        #logging.debug('dates_results: %s', dates_results)

        return [{
           "start_date": dates_entry['start_date'],
           "end_date": dates_entry['end_date']
        } for dates_entry in dates_results]

    def get_project(self, project_uuid):
        #logging.debug('###### get_project ########')
        #logging.debug('project_uuid: %s', project_uuid)

        # SQL-Abfrage, um Projektinformationen abzurufen
        query = """
            SELECT
                p.id,
                BIN_TO_UUID(p.uuid) as uuid,
                p.name,
                p.public,
                p.location,
                p.position,
                p.content,
                p.type,
                GROUP_CONCAT(DISTINCT BIN_TO_UUID(pt.techstack_id)) as techstack_uuids,
                GROUP_CONCAT(DISTINCT BIN_TO_UUID(pc.customer_id)) as customer_uuids
            FROM
                projects p
            LEFT JOIN
                project_techstack pt ON p.uuid = pt.project_id
            LEFT JOIN
                project_customer pc ON p.uuid = pc.project_id
            WHERE
                p.uuid = UUID_TO_BIN(%s)
            GROUP BY
                p.id,
                uuid,
                p.name,
                p.type,
                p.location,
                p.position,
                p.content
        """
        # Führe die SQL-Abfrage aus und erhalte das Ergebnis
        return self.select_one(query, [project_uuid])

    def get_project_types(self):
        #logging.debug('###### get_project_types ########')

        # SQL-Abfrage, um Projektinformationen abzurufen
        query = """
            SELECT
                p.id,
                p.type
            FROM
                project_type p
        """
        return self.select_all(query)

    def insert_project(self, data):
        #logging.debug('###### insert_project ########')
        #logging.debug('data: %s', data)

        if data is not None and len(data) <= 0:
            return 0

        data_to_save = [data]
        uuid_keys = ['uuid']
        ignore_keys = ['tech', 'customers', 'dates']
        table_name = 'projects'
        execute_result = 'No Data'
        if data_to_save is not None and len(data_to_save) > 0:
            execute_result = self.insert(table_name, data_to_save, uuid_keys, ignore_keys)
        #logging.debug('execute_result: %s', execute_result)
        return execute_result

    def insert_project_techstack(self, data):
        #logging.debug('###### insert_project_dates ########')
        #logging.debug('data: %s', data)

        if data is not None and len(data) <= 0:
            return 0

        data_to_save = []
        project_id = data['uuid']
        techstack_ids = data['tech']
        data_to_save = [{'project_id': project_id, 'techstack_id': techstack_id} for techstack_id in techstack_ids]

        uuid_keys = ['project_id', 'techstack_id']
        table_name = 'project_techstack'
        execute_result = 'No Data'
        if data_to_save is not None and len(data_to_save) > 0:
            execute_result = self.insert(table_name, data_to_save, uuid_keys)
        #logging.debug('execute_result: %s', execute_result)
        return execute_result

    def insert_project_dates(self, data):
        # logging.debug('###### insert_project_dates ########')
        # logging.debug('data: %s', data)

        if data is not None and len(data) <= 0:
            return 0

        project_id = data['uuid']
        dates = data['dates']
        data_to_save = [{'project_id': project_id,
                         'start_date': date['start_date'],
                         'end_date': None if date['end_date'] == '' else date['end_date']} for date in dates]

        uuid_keys = ['project_id']
        table_name = 'project_dates'
        execute_result = 'No Data'
        if data_to_save is not None and len(data_to_save) > 0:
            execute_result = self.insert(table_name, data_to_save, uuid_keys)
        #logging.debug('execute_result: %s', execute_result)
        return execute_result

    def insert_project_customers(self, data):
        #logging.debug('###### insert_project_dates ########')
        #logging.debug('data: %s', data)

        if data is not None and len(data) <= 0:
            return 0

        data_to_save = []
        project_id = data['uuid']
        customers_ids = data['tech']
        data_to_save = [{'project_id': project_id, 'customer_id': customer_id} for customer_id in customers_ids]

        uuid_keys = ['project_id', 'customer_id']
        table_name = 'project_customer'
        execute_result = 'No Data'
        if data_to_save is not None and len(data_to_save) > 0:
            execute_result = self.insert(table_name, data_to_save, uuid_keys)
        #logging.debug('execute_result: %s', execute_result)
        return execute_result

    def update_project(self, data):
        #logging.debug('###### update_project ########')
        #logging.debug('data: %s', data)

        if data is not None and len(data) <= 0:
            return 0

        data_to_save = [{
            'name': data['name'],
            'location': data['location'],
            'position': data['position'],
            'content': data['content'],
            'type': data['type'],
            'public': data['public']
        }]

        uuid_keys = ['uuid']
        table_name = 'projects'
        filters = [{'uuid': data['uuid']}]
        ignore_keys = []
        affected_rows = self.update(table_name, filters, data_to_save, uuid_keys, ignore_keys)
        #logging.debug('execute_result: %s', execute_result)
        return {
            'affected_rows': affected_rows
        }

    def update_customers_for_project(self, data):
        #logging.debug('###### update_customers_for_project ########')
        #logging.debug('data: %s', data)

        if data.get('customers') is not None and data['customers']:
            # Aktuelle Techstack-IDs abrufen, die mit dem Projekt verknüpft sind
            current_customer_ids_query = "SELECT BIN_TO_UUID(customer_id) as customer_id FROM project_customer WHERE project_id=UUID_TO_BIN(%s)"
            existing_customer_ids_set = set([row['customer_id'] for row in self.select_all(current_customer_ids_query, [data['uuid']])])

            # Konvertiere die Kombinationen aus dem Input in ein Set für einfacheren Vergleich
            input_customer_ids_set = set([customer['id'] for customer in data['customers']])

            uuid_keys = ['project_id','customer_id']
            table_name = 'project_customer'

            # Ungenutzte Verknüpfungen für das Projekt löschen
            # Finde Kombinationen, die gelöscht werden sollen
            customers_to_delete = existing_customer_ids_set - input_customer_ids_set
            #logging.debug('customers_to_delete: %s', customers_to_delete)
            data_to_delete = [{
                'project_id': data['uuid'],
                'customer_id': customer
            } for customer in customers_to_delete]
            if customers_to_delete is not None and len(customers_to_delete) > 0:
                self.delete(table_name, data_to_delete, uuid_keys)

            # Neue Verknüpfungen für das Projekt einfügen
            # Finde Kombinationen, die hinzugefügt werden sollen
            customers_to_add = input_customer_ids_set - existing_customer_ids_set
            #logging.debug('customers_to_add: %s', customers_to_add)
            data_to_insert = [{
                'project_id': data['uuid'],
                'customer_id': customer
            } for customer in customers_to_add]
            if customers_to_add is not None and len(customers_to_add) > 0:
                self.insert(table_name, data_to_insert, uuid_keys)

    def update_techstack_for_project(self, data):
        #logging.debug('###### update_techstack_for_project ########')
        #logging.debug('data: %s', data)

        if data.get('tech') is not None and data['tech']:
            # Aktuelle Techstack-IDs abrufen, die mit dem Projekt verknüpft sind
            current_techstack_ids_query = "SELECT BIN_TO_UUID(techstack_id) as techstack_id FROM project_techstack WHERE project_id=UUID_TO_BIN(%s)"
            existing_techstack_ids_set = set([row['techstack_id'] for row in self.select_all(current_techstack_ids_query, [data['uuid']])])

            # Konvertiere die Kombinationen aus dem Input in ein Set für einfacheren Vergleich
            input_techstack_ids_set = set([tech['id'] for tech in data['tech']])

            uuid_keys = ['project_id','techstack_id']
            table_name = 'project_techstack'

            # Ungenutzte Verknüpfungen für das Projekt löschen
            # Finde Kombinationen, die gelöscht werden sollen
            techs_to_delete = existing_techstack_ids_set - input_techstack_ids_set
            #logging.debug('techs_to_delete: %s', techs_to_delete)
            data_to_delete = [{
                'project_id': data['uuid'],
                'techstack_id': tech
            } for tech in techs_to_delete]
            if techs_to_delete is not None and len(techs_to_delete) > 0:
                self.delete(table_name, data_to_delete, uuid_keys)

            # Neue Verknüpfungen für das Projekt einfügen
            # Finde Kombinationen, die hinzugefügt werden sollen
            techs_to_add = input_techstack_ids_set - existing_techstack_ids_set
            #logging.debug('techs_to_add: %s', techs_to_add)
            data_to_insert = [{
                'project_id': data['uuid'],
                'techstack_id': tech
            } for tech in techs_to_add]
            if techs_to_add is not None and len(techs_to_add) > 0:
                self.insert(table_name, data_to_insert, uuid_keys)

    def update_dates_for_project(self, data):
        #logging.debug('###### update_dates_for_project ########')
        #logging.debug('data: %s', data)

        if data.get('dates') is not None and data['dates']:
            # Konvertiere die Datums-Kombinationen aus der Datenbank in ein Set für einfacheren Vergleich
            current_dates_ids_query = "SELECT id, start_date, end_date FROM project_dates WHERE project_id=UUID_TO_BIN(%s)"
            existing_dates_set = set([(row['start_date'], row['end_date']) for row in self.select_all(current_dates_ids_query, [data['uuid']])])

            # Konvertiere die Datums-Kombinationen aus dem Input in ein Set für einfacheren Vergleich
            input_dates_set = set([(self.convertStrToDate(date['start_date']), self.convertStrToDate(date['end_date'])) for date in data['dates']])

            #logging.debug('data["uuid"]: %s', data['uuid'])
            #logging.debug('existing_dates_set: %s', existing_dates_set)
            #logging.debug('input_dates_set: %s', input_dates_set)

            uuid_keys = ['project_id']
            table_name = 'project_dates'

            # Ungenutzte Dates-Verknüpfungen für das Projekt löschen
            # Finde Datums-Kombinationen, die gelöscht werden sollen
            dates_to_delete = existing_dates_set - input_dates_set
            #logging.debug('dates_to_delete: %s', dates_to_delete)
            data_to_delete = [{
                'project_id': data['uuid'],
                'start_date': date[0],
                'end_date': date[1]
            } for date in dates_to_delete]
            if dates_to_delete is not None and len(dates_to_delete) > 0:
                self.delete(table_name, data_to_delete, uuid_keys)

            # Neue Dates-Verknüpfungen für das Projekt einfügen
            # Finde Datums-Kombinationen, die hinzugefügt werden sollen
            dates_to_add = input_dates_set - existing_dates_set
            #logging.debug('dates_to_add: %s', dates_to_add)
            data_to_insert = [{
                'project_id': data['uuid'],
                'start_date': self.convertDateToStr(date[0]) if date[0] is not None else '',
                'end_date': self.convertDateToStr(date[1]) if date[1] is not None else ''
            } for date in dates_to_add]
            if dates_to_add is not None and len(dates_to_add) > 0:
                self.insert(table_name, data_to_insert, uuid_keys)

    def delete_project(self, project_uuid):
        #logging.debug('###### delete_project ########')
        #logging.debug('project_uuid: %s', project_uuid)

        query_projects = self.delete('projects', [{'uuid': project_uuid}], 'uuid')
        query_techstack = self.delete('project_techstack', [{'project_id': project_uuid}], 'uuid')
        query_dates = self.delete('project_dates', [{'project_id': project_uuid}], 'uuid')

        affected_rows_projects = self.execute(query_projects, [project_uuid])
        affected_rows_techstack = self.execute(query_techstack, [project_uuid])
        affected_rows_dates = self.execute(query_dates, [project_uuid])

        return {
          "projects": affected_rows_projects,
          "techstack": affected_rows_techstack,
          "dates": affected_rows_dates
        }

    def convertStrToDate(self, date_text):
        try:
            if date_text != datetime.strptime(date_text, "%Y-%m-%d").strftime('%Y-%m-%d'):
                raise ValueError
            return datetime.strptime(date_text, '%Y-%m-%d')
        except ValueError:
            return None

    def convertDateToStr(self, date_value):
        try:
            return date_value.strftime('%Y-%m-%d')
        except AttributeError:
            return None
