
import { test, expect }
  from '@playwright/test';

import { CatalogService }
  from '../../services/CatalogService.js';

import {
  validateCommonAssertions
} from '../../utils/commonAssertions.js';

import { validateSchema }
  from '../../utils/schemaValidator.js';

import { catalogSchema }
  from '../../schemas/catalogSchema.js';

test(

  'Download session catalog and validate its structure',

  async ({ request }) => {

    const catalogService =
      new CatalogService();

    // =====================
    // Get catalog response
    // =====================

    const {
      catalogResponse
    } = await catalogService
      .fetchCatalogData(request);

    // =====================
    // Extract response/body
    // =====================

    const {
      response: signedResponse,

      body: catalogBody,
      time

    } = catalogResponse;

    // =====================
    // Common Assertions
    // =====================

    validateCommonAssertions({

      response:
        signedResponse,

      body:
        catalogBody,

      expectedStatus: 200,
      expectedTime : 3000

    });

    // =====================
    // Get sessions array
    // =====================

    const sessions =

      catalogBody
        .data
        .catalogData
        .session;

    expect(
      Array.isArray(sessions)
    ).toBe(true);

    expect(
      sessions.length
    ).toBeGreaterThan(0);

    // =====================
    // Schema Validation
    // =====================

    await validateSchema(

      catalogSchema,

      catalogBody

    );

  }

);

