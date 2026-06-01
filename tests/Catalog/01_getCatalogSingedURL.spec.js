import { test, expect } from '@playwright/test';
import { CatalogService } from '../../services/CatalogService.js';
import {
  validateCommonAssertions
} from '../../utils/commonAssertions.js';

test('Events API — Get a signed URL for the session catalog', async ({ request }) => {

  const catalogService = new CatalogService();

  const { response, time, bodyText } =
    await catalogService.fetchSignedURL(request);

  const body = JSON.parse(bodyText);

  console.log(body);

  // Common assertions
      validateCommonAssertions({
  
        response,
  
        body,
  
        time,
  
        expectedStatus: 200,
  
        expectedTime: 5000
  
      });


// Strucure validation
  expect(typeof body.data.signedURL).toBe('string');

  expect(body.data.signedURL).toContain('https');

  expect(body.data.signedURL).toContain('Expires=');



});