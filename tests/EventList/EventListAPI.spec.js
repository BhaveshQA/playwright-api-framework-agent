import { test, expect } from '@playwright/test';

import { EventService } from '../../services/EventService.js';

import {validateCommonAssertions} from '../../utils/commonAssertions.js';

test(

  'Events API — List all events (fields and performance)',

  async ({ request }) => {

    // Create service object
    const eventService =
      new EventService();

    // Call API through service layer
    const {
      response,
      time,
      bodyText
    } = await eventService
      .getAllEvents(request);

    // Parse response
    const body =
      JSON.parse(bodyText);

    // Common assertions
    validateCommonAssertions({

      response,

      body,

      time,

      expectedStatus: 200,

      expectedTime: 5000

    });

    // Structure validation
    expect(
      Array.isArray(
        body.data.events
      )
    ).toBe(true);

    expect(
      body.data.events.length
    ).toBeGreaterThan(0);

    // Field validation
    for (const event of body.data.events) {

      expect(
        typeof event.eventId
      ).toBe('string');

      expect(
        typeof event.name
      ).toBe('string');

      expect(
        event.eventDataSource
      ).toBeDefined();

    }

  }

);

