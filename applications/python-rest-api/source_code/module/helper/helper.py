import logging
import html

logging.basicConfig(level=logging.DEBUG)

class Helper:
    def clean_string_for_db(self, value):
        cleaned_value = html.escape(value.strip()) if isinstance(value, str) else ''
        return cleaned_value
    def revert_string_from_db(self, value):
        cleaned_value = html.unescape(value.strip()) if isinstance(value, str) else ''
        return cleaned_value
