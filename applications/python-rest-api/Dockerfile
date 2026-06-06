FROM python:3.12-alpine

RUN apk add --no-cache curl

WORKDIR /app
COPY source_code/ /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8181

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=15s \
  CMD curl -f http://127.0.0.1:8181/healthcheck || exit 1

ENTRYPOINT ["python", "app.py"]
