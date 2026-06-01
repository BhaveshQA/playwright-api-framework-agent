import { expect }
  from '@playwright/test';

// =====================
// Status Code Assertion
// =====================

export function validateStatusCode(response,expectedStatus = 200) {

  expect(response.status()).toBe(expectedStatus);
}

// =====================
// Response Time Assertion
// =====================

export function validateResponseTime(time,expectedTime = 5000) {

  expect(time).toBeLessThan(expectedTime);

}

// =====================
// Response Body Assertion
// =====================

export function validateResponseBody(body) {
expect(body)
    .toBeDefined();
}

// =====================
// Combined Common Assertion
// =====================

export function validateCommonAssertions({response,body,time,expectedStatus = 200,expectedTime = 5000}) {

  validateStatusCode(response,expectedStatus);

  validateResponseBody(body);

  if (time !== undefined) {

    validateResponseTime(time,expectedTime);

  }

}
