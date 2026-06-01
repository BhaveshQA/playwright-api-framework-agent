import { test } from '@playwright/test';

import { SponsorsService } from '../../services/SponsorsService.js';

import { validateCommonAssertions } from '../../utils/commonAssertions.js';

import {
  generateDeviceId
}
from '../../utils/commonUtility.js';


test(

  'Sponsors catalog - MOB',

  async ({ request }) => {

    const service =
      new SponsorsService();


    const deviceId =
      generateDeviceId();


    const {

      response,

      bodyText,

      time

    } = await service.sponsorsCatalogMOB(

      request,
      process.env.EVENT_ID,
      deviceId

    );


    const body =
      JSON.parse(bodyText);


    validateCommonAssertions({

      response,

      body,

      time,

      expectedStatus:
        200

    });


    // Sponsors catalog - MOB


    // Schema is valid


  }

);
