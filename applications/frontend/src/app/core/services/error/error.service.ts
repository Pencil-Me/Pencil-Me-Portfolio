import { Injectable } from '@angular/core';

export enum CustomErrorCodes {
  UN_KNOWN = 0,
}

export enum RedirectionalCode {
  HTTP_300_MULTIPLE_CHOICES = 300,
  HTTP_301_MOVED_PERMANENTLY = 301,
  HTTP_302_FOUND = 302,
  HTTP_303_SEE_OTHER = 303,
  HTTP_304_NOT_MODIFIED = 304,
  HTTP_305_USE_PROXY = 305,
  HTTP_306_RESERVED = 306,
  HTTP_307_TEMPORARY_REDIRECT = 307,
  HTTP_308_PERMANENT_REDIRECT = 308,
  HTTP_309_BAD_REQUEST = 309,
}

export enum ServerError {
  HTTP_500_INTERNAL_SERVER_ERROR = 500,
  HTTP_501_NOT_IMPLEMENTED = 501,
  HTTP_502_BAD_GATEWAY = 502,
  HTTP_503_SERVICE_UNAVAILABLE = 503,
  HTTP_504_GATEWAY_TIMEOUT = 504,
  HTTP_505_HTTP_VERSION_NOT_SUPPORTED = 505,
  HTTP_506_VARIANT_ALSO_NEGOTIATES = 506,
  HTTP_507_INSUFFICENT_STORAGE = 507,
  HTTP_508_LOOP_DETECTED = 508,
  HTTP_509_BANDWIDTH_LIMIT_EXCEEDED = 509,
  HTTP_510_NOT_EXTENDED = 510,
  HTTP_511_NETWORK_AUTHENTICATION_REQUIRED = 511,
}

export enum SuccessCodes {
  HTTP_200_OK = 200,
  HTTP_201_CREATED = 201,
  HTTP_202_ACCEPTED = 202,
  HTTP_203_NON_AUTHORITATIVE_INFORMATION = 203,
  HTTP_204_NO_CONTENT = 204,
  HTTP_205_RESET_CONTENT = 205,
  HTTP_206_PARTIAL_CONTENT = 206,
  HTTP_207_MULTI_STATUS = 207,
  HTTP_208_IM_USED = 208,
}
export enum ClientError {
  HTTP_400_BAD_REQUEST = 400,
  HTTP_401_UNAUTHORIZED = 401,
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  /**
   * Handles error based on the provided error code and message.
   * @param errorCode - The error code to handle.
   * @param errorMessage - The error message to display.
   */
  handleError(errorCode: number, errorMessage: string) {
    switch (errorCode) {
      case CustomErrorCodes.UN_KNOWN:
        this.handleUnknownError(errorMessage);
        break;
      case ClientError.HTTP_400_BAD_REQUEST:
        this.handleBadRequest(errorMessage);
        break;
      default:
        this.handleUnknownErrorCode(errorCode);
        break;
    }
  }

  /**
   * Displays a notification based on the provided notification code and message.
   * @param notificationCode - The notification code to handle.
   * @param notification - The notification message to display.
   */
  handleNotification(notificationCode: number, notification: string) {
    switch (notificationCode) {
      case SuccessCodes.HTTP_200_OK:
        this.handleSuccessNotification(notification);
        break;
      default:
        this.handleUnknownNotificationCode(notificationCode);
        break;
    }
  }

  /**
   * Handles unknown error by displaying an alert with the error message.
   * @param errorMessage - The error message to display.
   */
  private handleUnknownError(errorMessage: string) {
    alert('Unknown Error: ' + errorMessage);
  }

  /**
   * Handles bad request error by displaying an alert with the error message.
   * @param errorMessage - The error message to display.
   */
  private handleBadRequest(errorMessage: string) {
    alert('Bad Request: ' + errorMessage);
  }

  /**
   * Handles unknown error code by displaying an alert with the error code.
   * @param errorCode - The unknown error code to handle.
   */
  private handleUnknownErrorCode(errorCode: number) {
    alert('Unknown Error Code: ' + errorCode);
  }

  /**
   * Handles success notification by displaying an alert with the notification message.
   * @param notification - The success notification message to display.
   */
  private handleSuccessNotification(notification: string) {
    alert('Success: ' + notification);
  }

  /**
   * Handles unknown notification code by displaying an alert with the notification code.
   * @param notificationCode - The unknown notification code to handle.
   */
  private handleUnknownNotificationCode(notificationCode: number) {
    alert('Unknown Success Action: ' + notificationCode);
  }
}
