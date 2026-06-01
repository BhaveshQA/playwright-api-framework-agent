export function buildSessionsToRatePayload() {

  return {

    awsEventId:
      process.env.EVENT_ID,

    deviceId:
      process.env.USER_ID,

    questionnaire: {

      topicInterests: [
        'lecture'
      ],

      preferredFormats: [
        'Storage'
      ]

    }

  };

}

