import uuid
import logging
from module.helper.helper import Helper

logging.basicConfig(level=logging.DEBUG)

helper = Helper()

class Project:
    def __init__(self, data):
        #logging.debug('data: %s', data)
        self.uuid = data.get('uuid', str(uuid.uuid4()))
        self.name = data.get('name', '')
        self.location = data.get('location', '')
        self.position = data.get('position', '')
        self.content = data.get('content', '')
        self.tech = data.get('tech', [])
        self.dates = data.get('dates', [])
        self.customers = data.get('customers', [])
        self.type = data.get('type', 1)

    def to_dict(self):
        return {
            'uuid': self.__clean_string(self.uuid),
            'name': self.__clean_string(self.name),
            'location': self.__clean_string(self.location),
            'position': self.__clean_string(self.position),
            'content': self.__clean_string(self.content),
            'tech': self.__clean_string_array(self.tech),
            'customers': self.__clean_string_array(self.customers),
            'dates': self.__clean_date_array(self.dates),
            'type': self.__clean_number(self.type)
        }
    def to_disp(self):
        return {
            'uuid': self.uuid,
            'name': helper.revert_string_from_db(self.name),
            'location': helper.revert_string_from_db(self.location),
            'position': helper.revert_string_from_db(self.position),
            'content': helper.revert_string_from_db(self.content),
            'tech': self.__revert_object_array(self.tech),
            'customers': self.__revert_object_array(self.customers),
            'dates': self.dates,
            'type': self.type
        }

    @staticmethod
    def __clean_string(value):
        cleaned_value = helper.revert_string_from_db(value)
        cleaned_value = helper.clean_string_for_db(cleaned_value)
        return cleaned_value

    @staticmethod
    def __clean_number(data):
        return int(data)  # Dummy-Implementierung, die nichts ändert

    @staticmethod
    def __clean_string_array(data):
        if data is not None and len(data) > 0:
            for row in data:
                row = helper.clean_string_for_db(row)
        return data  # Dummy-Implementierung, die nichts ändert

    @staticmethod
    def __revert_object_array(data):
        if data is not None and len(data) > 0:
            for row in data:
                for key in row:
                    row[key] = helper.revert_string_from_db(row[key])
        return data  # Dummy-Implementierung, die nichts ändert

    @staticmethod
    def __clean_date_array(data):
        return data  # Dummy-Implementierung, die nichts ändert
