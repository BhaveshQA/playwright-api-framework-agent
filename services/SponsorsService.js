import { apiRequest } from '../utils/apiClient.js';

import { API_ENDPOINTS } from '../config/apiEndpoints.js';

export class SponsorsService {


  // ============================================
  // Sponsors catalog - MOB
  // ============================================

  async sponsorsCatalogMOB(

    request, eventId, deviceId

  ) {


    const endpoint =
      API_ENDPOINTS.SPONSORS_CATALOG_MOB

        .replace(
          '${eventId}',
          eventId
        );



    return await apiRequest(

      request,

      'GET',

      endpoint,


      {
        params: {
          deviceId
        }
      }


    );


  }



}