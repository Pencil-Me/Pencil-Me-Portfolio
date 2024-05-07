import uuid
import logging
from module.helper.helper import Helper

logging.basicConfig(level=logging.DEBUG)

helper = Helper()

class Customer:
    def __init__(self, data):
        #logging.debug('data: %s', data)
        self.uuid = data.get('uuid', str(uuid.uuid4()))
        self.name = data.get('name', '')
        self.location = data.get('location', '')
        self.last_used_date = data.get('last_used_date', '')

    def to_dict(self):
        return {
            'uuid': self.__clean_string(self.uuid),
            'name': self.__clean_string(self.name),
            'location': self.__clean_string(self.location),
        }
    def to_disp(self):
        return {
            'uuid': self.uuid,
            'name': helper.revert_string_from_db(self.name),
            'location': helper.revert_string_from_db(self.location),
            'last_used_date': self.last_used_date,
        }

    @staticmethod
    def __clean_string(value):
        cleaned_value = helper.revert_string_from_db(value)
        cleaned_value = helper.clean_string_for_db(cleaned_value)
        return cleaned_value

    @staticmethod
    def __clean_string_array(data):
        return data  # Dummy-Implementierung, die nichts ändert

    @staticmethod
    def __clean_date_array(data):
        return data  # Dummy-Implementierung, die nichts ändert
