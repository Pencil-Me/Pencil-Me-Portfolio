import type { HttpTestingController } from '@angular/common/http/testing';
import type { TestRequest } from '@angular/common/http/testing';

export function expectHttpJsonResponse<T>(
  httpMock: HttpTestingController,
  url: string,
  method: string,
  testData: T,
  assertRequest?: (req: TestRequest) => void,
): void {
  const req = httpMock.expectOne(url);
  expect(req.request.method).toBe(method);
  assertRequest?.(req);
  req.flush(testData as string | number | boolean | object | null);
}
