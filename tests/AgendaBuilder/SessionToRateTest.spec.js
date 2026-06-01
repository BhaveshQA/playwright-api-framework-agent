import { test, expect }
  from '@playwright/test';

import { AgendaBuilderService }
  from '../../services/AgendaBuilderService.js';

import {
  buildSessionsToRatePayload
} from '../../payloads/agendaBuilder/sessionsToRatePayload.js';

import {
  validateCommonAssertions
} from '../../utils/commonAssertions.js';

test(

  'Get sessions to rate',

  async ({ request }) => {

    const agendaBuilderService =
      new AgendaBuilderService();

    // =====================
    // Payload
    // =====================

    const payload =
      buildSessionsToRatePayload();

    // =====================
    // Hit POST API
    // =====================

    const {
      response,
      bodyText,
      time
    } = await agendaBuilderService
      .getSessionsToRate(

        request,

        payload

      );

    const body =
      JSON.parse(bodyText);

    console.log(body);

    // =====================
    // Validations
    // =====================

    // Common assertions
       validateCommonAssertions({
   
         response,
   
         body,
   
         time,
   
         expectedStatus: 200,
   
         expectedTime: 5000
   
       });
  }

);

