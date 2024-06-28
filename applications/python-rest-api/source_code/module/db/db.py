import pymysql.cursors
import logging

logging.basicConfig(level=logging.DEBUG)

class SqlError(Exception):
    def __init__(self, message):
        super().__init__(message)

class SqlBase(object):
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database

    def execute(self, query:str, parameters:list=[]):
        return self.__execute(query, parameters).rowcount

    def select_all(self, query:str, parameters:list=[]):
        cursor = self.__execute(query, parameters)
        return cursor.fetchall()

    def select_one(self, query:str, parameters:list=[]):
        cursor = self.__execute(query, parameters)
        return cursor.fetchone()

    def insert(self, table_name:str, data:list, uuid_keys:list=[], ignore_keys:list=[], select_only_keys:list=[]):
        # Erstelle dynamisch die Parameterliste und Platzhalter für die SQL-Abfrage
        insert_params = []
        placeholders = []
        insert_values_data = []
        data_items = []

        if select_only_keys is not None and len(select_only_keys) > 0:
            for key, value in data.items():
                if key in select_only_keys:
                    data_items += [(key, value)]
        else:
            data_items = data

        # logging.debug('data_items: %s', data_items)

        # Durchlaufe die bereinigten Daten und füge sie zur Parameterliste und Platzhalterliste hinzu
        for data_item in data_items:
            placeholder = []

            for key, value in data_item.items():
                if key not in ignore_keys:
                    if key not in insert_params:
                        insert_params.append(key)

                    if value is not None:
                        if key in uuid_keys:
                            placeholder.append('UUID_TO_BIN(%s)')
                        else:
                            placeholder.append("%s")
                    else:
                        placeholder.append("NULL")

                    if value is not None:
                        insert_values_data.append(value)

            placeholder = ', '.join(placeholder)
            placeholders.append(f'({placeholder})')

        # Erstelle die Formatierung für die Platzhalter und Felder in der SQL-Abfrage
        placeholders = ', '.join(placeholders)
        fields = ', '.join(insert_params)

        query_insert = f"INSERT INTO {table_name} ({fields}) VALUES {placeholders}"
        # logging.debug('query_insert: %s', query_insert)
        # logging.debug('insert_values_data: %s', insert_values_data)

        execute_result = self.execute(query_insert, insert_values_data)
        #logging.debug('execute_result: %s', execute_result)

        return execute_result

    def update(self, table_name:str, filters:list, data:list, uuid_keys:list=[], ignore_keys:list=[], select_only_keys:list=[]):
        # Erstelle dynamisch die Parameterliste und Platzhalter für die SQL-Abfrage
        update_params = []
        update_values_data = []
        data_items = []
        filter_items = []

        if select_only_keys is not None and len(select_only_keys) > 0:
            for key, value in data.items():
                if key in select_only_keys:
                    data_items += [(key, value)]
        else:
            data_items = data

        # Durchlaufe die bereinigten Daten und füge sie zur Parameterliste und Platzhalterliste hinzu
        for data_item in data_items:
            # logging.debug('data_item: %s', data_item)
            for key, value in data_item.items():
                if key not in ignore_keys:
                    if value is not None:
                        if key in uuid_keys:
                            update_params.append(f"{key}=UUID_TO_BIN(%s)")
                        else:
                            update_params.append(f"{key}=%s")
                    else:
                        update_params.append(f"{key}=NULL")

                    if value is not None:
                        update_values_data.append(value)

        # Durchlaufe die bereinigten Daten und füge sie zur Parameterliste und Platzhalterliste hinzu
        for filter_item in filters:
            for key, value in filter_item.items():
                if value is not None:
                    if key in uuid_keys:
                        filter_items.append(f"{key}=UUID_TO_BIN(%s)")
                    else:
                        filter_items.append(f"{key}=%s")
                else:
                    filter_items.append(f"{key} IS NULL")

                if value is not None:
                    update_values_data.append(value)

        # Erstelle die Formatierung für die Platzhalter und Felder in der SQL-Abfrage
        filters = ', '.join(filter_items)
        fields = ', '.join(update_params)

        query_update = f"UPDATE {table_name} SET {fields} WHERE {filters}"
        logging.debug('query_update: %s', query_update)
        logging.debug('update_values_data: %s', update_values_data)

        execute_result = self.execute(query_update, update_values_data)
        #logging.debug('execute_result: %s', execute_result)

        return execute_result

    def delete(self, table_name:str, data:list, uuid_keys:list=[]):
        # Erstelle dynamisch die Parameterliste und Platzhalter für die SQL-Abfrage
        flat_values = []
        placeholders = []

        # Durchlaufe die bereinigten Daten und füge sie zur Parameterliste und Platzhalterliste hinzu
        for item in data:
            placeholder = []

            for key, value in item.items():
                if value is not None:
                    if key in uuid_keys:
                        placeholder.append(f'{key}=UUID_TO_BIN(%s)')
                    else:
                        placeholder.append(f'{key}=%s')
                else:
                    placeholder.append(f'{key} IS NULL')

                if value is not None:
                    flat_values.append(value)

            placeholder_string = ' AND '.join(placeholder)
            placeholders.append(f'({placeholder_string})')

        # Erstelle die Formatierung für die Platzhalter und Felder in der SQL-Abfrage
        placeholders_string = ' OR '.join(placeholders)

        query_delete = f"DELETE FROM {table_name} WHERE {placeholders_string}"
        # logging.debug('query_delete: %s', query_delete)
        # logging.debug('flat_values: %s', flat_values)

        execute_result = self.execute(query_delete, flat_values)
        #logging.debug('execute_result: %s', execute_result)

        return execute_result

    def __execute(self, query:str, parameters:list=[]):
        try:
            with self.__openConnection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(query, parameters)
                    connection.commit()
                    return cursor
        except pymysql.Error as e:
            raise SqlError(f"Error while executing query [{query}]: {str(e)}")

    def __openConnection(self):
        try:
            return pymysql.connect(host=self.host, user=self.user, password=self.password, database=self.database, cursorclass=pymysql.cursors.DictCursor)
        except pymysql.Error as e:
            raise SqlError(f"Error while opening SQL connection: {str(e)}")
