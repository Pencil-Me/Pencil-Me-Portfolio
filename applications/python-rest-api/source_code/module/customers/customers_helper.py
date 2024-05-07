from module.db.db import SqlBase, SqlError
from configs.config import dbconfig
from datetime import datetime
import logging

logging.basicConfig(level=logging.DEBUG)

class CustomerHelper(SqlBase):
    def __init__(self):
        SqlBase.__init__(self, host=dbconfig['host'],user=dbconfig['username'],password=dbconfig['password'],database=dbconfig['database'])

    def get_all_customers(self):
        #logging.debug('###### get_all_customers ########')

        query = """
            SELECT
                BIN_TO_UUID(c.uuid) as uuid,
                c.name,
                c.location
            FROM
                customers c
            GROUP BY
                c.uuid,
                c.name,
                c.location
        """
        return self.select_all(query)

    def get_all_customers_fe(self):
        #logging.debug('###### get_all_customers_fe ########')

        query = """
            SELECT
                BIN_TO_UUID(c.uuid) as uuid,
                c.name,
                c.location,
                MAX(pd.end_date) AS last_used_date
            FROM
                customers c
            LEFT JOIN
                project_customer pc ON c.uuid = pc.customer_id
            LEFT JOIN
                project_dates pd ON pc.project_id = pd.project_id
            GROUP BY
                c.uuid,
                c.name,
                c.location
        """
        return self.select_all(query)

    def get_customer(self, customer_uuid):
        #logging.debug('###### get_customer ########')

        # SQL-Abfrage, um Projektinformationen abzurufen
        query = """
            SELECT
                c.id,
                BIN_TO_UUID(c.uuid) as uuid,
                c.name,
                c.location
            FROM
                customers c
            WHERE
                c.uuid = UUID_TO_BIN(%s)
            GROUP BY
                c.id,
                c.uuid,
                c.name,
                c.location
        """
        # Führe die SQL-Abfrage aus und erhalte das Ergebnis
        return self.select_one(query, [customer_uuid])

    def insert_customer(self, data):
        #logging.debug('###### insert_customer ########')
        #logging.debug('data: %s', data)

        if data is not None and len(data) <= 0:
            return 0

        data_to_save = [data]
        uuid_keys = ['uuid']
        table_name = 'customers'
        ignore_keys = []
        execute_result = 'No Data'
        if data_to_save is not None and len(data_to_save) > 0:
            execute_result = self.insert(table_name, data_to_save, uuid_keys, ignore_keys)
        #logging.debug('execute_result: %s', execute_result)
        return execute_result

    def update_customer(self, data):
        #logging.debug('###### update_customer ########')

        if data is not None and len(data) <= 0:
            return 0

        data_to_save = [{
            'name': data['name'],
            'location': data['location']
        }]

        uuid_keys = ['uuid']
        table_name = 'customers'
        filters = [{'uuid': data['uuid']}]
        ignore_keys = []
        affected_rows = self.update(table_name, filters, data_to_save, uuid_keys, ignore_keys)
        #logging.debug('execute_result: %s', execute_result)
        return {
            'affected_rows': affected_rows
        }

    def delete_customer(self, customer_uuid):
        #logging.debug('###### delete_customer ########')

        uuid_keys = ['uuid']
        data_to_delete = [{'uuid': customer_uuid}]

        affected_rows_customers = self.delete('customers', data_to_delete, uuid_keys)

        return {
          "customers": affected_rows_customers
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
