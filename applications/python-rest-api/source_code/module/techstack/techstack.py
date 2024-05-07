import uuid
import logging
from module.helper.helper import Helper

logging.basicConfig(level=logging.DEBUG)

helper = Helper()

class TechStack:
    def __init__(self, data):
        self.uuid = data.get('uuid', str(uuid.uuid4()))
        self.name = data.get('name', '')
        self.type = data.get('type', '')
        self.expertise_level = data.get('expertise_level', '')
        self.flag_important = data.get('flag_important', '0')
        self.last_usage_date = data.get('last_usage_date', '')
        self.project_count = data.get('project_count', '')

    def to_dict(self):
        return {
            'uuid': self.__clean_string(self.uuid),
            'name': self.__clean_string(self.name),
            'type': self.__clean_number(self.type),
            'expertise_level': self.__clean_number(self.expertise_level),
            'flag_important': self.__clean_number(self.flag_important)
        }
    def to_disp(self):
        return {
            'uuid': self.uuid,
            'name': helper.revert_string_from_db(self.name),
            'type': self.type,
            'expertise_level': self.expertise_level,
            'flag_important': self.flag_important,
            'last_usage_date': self.last_usage_date,
            'project_count': self.project_count
        }

    @staticmethod
    def __clean_string(value):
        cleaned_value = helper.revert_string_from_db(value)
        cleaned_value = helper.clean_string_for_db(cleaned_value)
        return cleaned_value

    @staticmethod
    def __clean_number(data):
        return data  # Dummy-Implementierung, die nichts ändert
