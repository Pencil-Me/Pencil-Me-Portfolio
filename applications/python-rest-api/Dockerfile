FROM python:3.12-alpine

WORKDIR /app
COPY source_code/ /app

RUN pip install -r requirements.txt

ENTRYPOINT ["python", "app.py"]