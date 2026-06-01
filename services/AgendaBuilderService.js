import { apiRequest }
  from '../utils/apiClient.js';

import { API_ENDPOINTS }
  from '../config/apiEndpoints.js';

export class AgendaBuilderService {

  // =====================
  // Sessions To Rate
  // =====================

  async getSessionsToRate(
    request,
    payload
  ) {

    const path =
      API_ENDPOINTS.SESSIONS_TO_RATE;

    return await apiRequest(

      request,

      'POST',

      path,

      {
        baseURL:
          process.env.BUILDER_URL,

        data:
          payload

      }

    );

  }

}
