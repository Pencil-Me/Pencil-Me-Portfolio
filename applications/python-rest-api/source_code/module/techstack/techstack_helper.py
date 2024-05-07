from module.db.db import SqlBase
from configs.config import dbconfig
import logging

logging.basicConfig(level=logging.DEBUG)

class TechStackHelper(SqlBase):
    def __init__(self):
        SqlBase.__init__(self, host=dbconfig['host'],user=dbconfig['username'],password=dbconfig['password'],database=dbconfig['database'])

    def get_all_techstacks(self):
        #logging.debug('###### get_all_techstacks ########')

        query = """
            SELECT
                BIN_TO_UUID(t.uuid) AS uuid,
                t.name,
                t.type,
                t.expertise_level,
                t.flag_important,
                (
                 SELECT
                    MAX(p.end_date)
                 FROM
                    project_dates p
                 JOIN
                    project_techstack pt ON p.project_id = pt.project_id
                 WHERE
                    pt.techstack_id = t.uuid
                ) AS last_usage_date,
                COUNT(DISTINCT pt.project_id) AS project_count
            FROM
                techstack t
            LEFT JOIN
                project_techstack pt ON t.uuid = pt.techstack_id
            GROUP BY
                t.uuid, t.name, t.type, t.expertise_level, t.flag_important;
        """
        return self.select_all(query)

    def get_all_techstacks_fe(self):
        #logging.debug('###### get_all_techstacks_fe ########')

        # SQL-Abfrage, um Projektinformationen abzurufen
        query = """
            SELECT
                BIN_TO_UUID(t.uuid) as uuid,
                t.name,
                (
                    SELECT
                        tt.type
                    FROM
                        techstack_type tt
                    WHERE
                        id=t.type
                ) as type,
                t.expertise_level,
                t.flag_important,
                (
                    SELECT
                        MAX(COALESCE(p.end_date, CURDATE()))
                    FROM
                        project_dates p
                    JOIN
                        project_techstack pt ON p.project_id = pt.project_id
                    WHERE
                        pt.techstack_id = t.uuid
                ) AS last_usage_date,
                COUNT(DISTINCT pt.project_id) AS project_count
            FROM
                techstack t
            LEFT JOIN
                project_techstack pt ON t.uuid = pt.techstack_id
            GROUP BY
                t.uuid, t.name, type, t.expertise_level, t.flag_important;
        """
        return self.select_all(query)

    def get_techstack(self, techstack_uuid):
        #logging.debug('###### get_techstack ########')

        # SQL-Abfrage, um Projektinformationen abzurufen
        query = """
            SELECT
                BIN_TO_UUID(t.uuid) as uuid,
                t.name,
                t.type,
                t.expertise_level,
                t.flag_important
            FROM
                techstack t
            WHERE
                t.uuid = UUID_TO_BIN(%s)
        """
        return self.select_one(query, [techstack_uuid])

    def get_techstack_types(self):
        #logging.debug('###### get_techstack_types ########')

        # SQL-Abfrage, um Projektinformationen abzurufen
        query = """
            SELECT
                t.id,
                t.type
            FROM
                techstack_type t
        """
        return self.select_all(query)

    def insert_techstack(self, data):
        #logging.debug('###### insert_techstack ########')
        #logging.debug('data: %s', data)

        if data is not None and len(data) <= 0:
            return 0

        data_to_save = [{
           'uuid': data['uuid'],
           'name': data['name'],
           'type': data['type'],
           'expertise_level': data['expertise_level'],
           'flag_important': data['flag_important'],
        }]
        uuid_keys = ['uuid']
        table_name = 'techstack'
        execute_result = self.insert(table_name, data_to_save, uuid_keys)
        return execute_result

    def update_techstack(self, data):
        #logging.debug('###### update_techstack ########')

        data_to_save = [{
           'name': data['name'],
           'type': data['type'],
           'expertise_level': data['expertise_level'],
           'flag_important': data['flag_important'],
        }]
        uuid_keys = ['uuid']
        table_name = 'techstack'
        filters = [{'uuid': data['uuid']}]
        affected_rows = self.update(table_name, filters, data_to_save, uuid_keys)

        return {
            'affected_rows': affected_rows
        }

    def delete_techstack(self, techstack_uuid):
        #logging.debug('###### delete_techstack ########')

        uuid_keys = ['uuid']
        data_to_delete = [{'uuid': techstack_uuid}]
        affected_rows_techstack = self.delete('techstack', data_to_delete, uuid_keys)

        uuid_keys = ['techstack_id']
        data_to_delete = [{'techstack_id': techstack_uuid}]
        affected_rows_projects_techstacks = self.delete('project_techstack', data_to_delete, uuid_keys)

        return {
          "techstack": affected_rows_techstack,
          "project_techstack": affected_rows_projects_techstacks
        }
