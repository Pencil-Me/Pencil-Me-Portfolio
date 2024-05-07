# Pencil&Me Portfolio - Email PHP API

The Email PHP API is a RESTful API that allows sending emails via an HTTP endpoint. This API is easy to integrate and provides a quick way to send emails via SMTP.

## Built With

* PHP 8.1
* PHPMailer
* Docker

## Installation

1. Configure your settings in Inc/.env.dev and Inc/.env.prod, using Inc/.env.example as a template.
2. Ensure you have an SMTP server set up for email delivery.

## Usage
### Authentication
The API requires authentication via an API key, which is sent in the request header.

### Error Handling
The API returns appropriate HTTP status codes and error messages in case of errors, enabling easy error handling.

### Sending an Email
#### Endpoint:

POST /send_email

#### Parameter:

```bash
sender (Sender's email address)
recipient (Recipient's email address)
subject (Email subject)
message (Message content)
```

## Authors
- **Johannes Kromer** - [https://github.com/Pencil-Me](https://github.com/Pencil-Me)
