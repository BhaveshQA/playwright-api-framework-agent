import { test, expect }
  from '@playwright/test';

import { CatalogService }
  from '../../services/CatalogService.js';

import {
  validateCommonAssertions
} from '../../utils/commonAssertions.js';

test(

  'Get session details using sessionId from catalog',

  async ({ request }) => {

    const catalogService =
      new CatalogService();

    // Extract sessionId
    const sessionId =

      await catalogService
        .extractFirstSessionId(
          request
        );

    // Hit Session Detail API
    const {
      response,
      bodyText,
      time
    } = await catalogService
      .getSessionDetails(

        request,

        sessionId

      );

    const body =
      JSON.parse(bodyText);
      console.log(body);

    // Common assertions
       validateCommonAssertions({
   
         response,
   
         body,
   
         time,
   
         expectedStatus: 200,
   
         expectedTime: 5000
   
       });

    expect(
      body.data.session.sessionID
    ).toBe(sessionId);

  }

);

