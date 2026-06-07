import logging
import uuid

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
        self.content_short = data.get('content_short', '')
        self.content_long = data.get('content_long', '')
        self.tech = data.get('tech', [])
        self.dates = data.get('dates', [])
        self.customers = data.get('customers', [])
        self.type = data.get('type', 1)
        self.public = data.get('public', 0)
        self.featured_rank = self.__clean_optional_rank(data.get('featured_rank'))
        self.featured_tag = data.get('featured_tag', '')
        self.featured_problem = data.get('featured_problem', '')
        self.featured_role = data.get('featured_role', '')
        self.featured_outcome = data.get('featured_outcome', '')

    def to_dict(self):
        return {
            'uuid': self.__clean_string(self.uuid),
            'name': self.__clean_string(self.name),
            'location': self.__clean_string(self.location),
            'position': self.__clean_string(self.position),
            'content': self.__clean_string(self.content),
            'content_short': self.__clean_string(self.content_short),
            'content_long': self.__clean_string(self.content_long),
            'tech': self.__clean_string_array(self.tech),
            'customers': self.__clean_string_array(self.customers),
            'dates': self.__clean_date_array(self.dates),
            'type': self.__clean_number(self.type),
            'public': self.__clean_boolean(self.public),
            'featured_rank': self.featured_rank,
            'featured_tag': self.__clean_string(self.featured_tag),
            'featured_problem': self.__clean_string(self.featured_problem),
            'featured_role': self.__clean_string(self.featured_role),
            'featured_outcome': self.__clean_string(self.featured_outcome),
        }
    def to_disp(self):
        return {
            'uuid': self.uuid,
            'name': helper.revert_string_from_db(self.name),
            'public': self.public,
            'location': helper.revert_string_from_db(self.location),
            'position': helper.revert_string_from_db(self.position),
            'content': helper.revert_string_from_db(self.content),
            'content_short': helper.revert_string_from_db(self.content_short),
            'content_long': helper.revert_string_from_db(self.content_long),
            'tech': self.__revert_object_array(self.tech),
            'customers': self.__revert_object_array(self.customers),
            'dates': self.dates,
            'type': self.type,
            'featured_rank': self.featured_rank,
            'featured_tag': helper.revert_string_from_db(self.featured_tag),
            'featured_problem': helper.revert_string_from_db(self.featured_problem),
            'featured_role': helper.revert_string_from_db(self.featured_role),
            'featured_outcome': helper.revert_string_from_db(self.featured_outcome),
        }

    @staticmethod
    def __clean_string(value):
        cleaned_value = helper.revert_string_from_db(value)
        cleaned_value = helper.clean_string_for_db(cleaned_value)
        return cleaned_value

    @staticmethod
    def __clean_number(data):
        return int(data)

    @staticmethod
    def __clean_boolean(data):
        return bool(data)

    @staticmethod
    def __clean_optional_rank(data):
        if data is None or data == '' or data == 0:
            return None
        return int(data)

    @staticmethod
    def __clean_string_array(data):
        if data is not None and len(data) > 0:
            for row in data:
                row = helper.clean_string_for_db(row)
        return data

    @staticmethod
    def __revert_object_array(data):
        if data is not None and len(data) > 0:
            for row in data:
                for key in row:
                    row[key] = helper.revert_string_from_db(row[key])
        return data

    @staticmethod
    def __clean_date_array(data):
        return data  # Dummy-Implementierung, die nichts ändert
