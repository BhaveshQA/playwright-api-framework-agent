import { apiRequest }
  from './apiClient.js';

import { API_ENDPOINTS }
  from '../config/apiEndpoints.js';

export async function getSignedURL(
  request
) {

  const path =

    API_ENDPOINTS.SESSION_CATALOG

      .replace(
        '${eventId}',
        process.env.EVENT_ID
      );

  return await apiRequest(request,'GET',path);

}

