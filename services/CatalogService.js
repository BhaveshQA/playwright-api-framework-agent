import { getSignedURL }
  from '../utils/getSignedURL.js';
 
import { apiRequest }
  from '../utils/apiClient.js';

import { API_ENDPOINTS }
  from '../config/apiEndpoints.js';



export class CatalogService {

  // =====================
  // Get Signed URL
  // =====================

  async fetchSignedURL(
    request
  ) {

    return await getSignedURL(
      request
    );

  }

  // =====================
  // Download Catalog Data
  // =====================

  async fetchCatalogData(
    request
  ) {

    // Step 1:
    // Fetch signed URL response

    const {
      response,
      time,
      bodyText
    } = await this.fetchSignedURL(
      request
    );

    // Step 2:
    // Parse signed URL response

    const body =
      JSON.parse(bodyText);

    const signedURL =
      body.data.signedURL;

    // Step 3:
    // Download catalog data

    const signedResponse =
      await request.get(
        signedURL
      );

    const catalogBodyText =
      await signedResponse.text();

    const catalogBody =
      JSON.parse(
        catalogBodyText
      );

    // Step 4:
    // Standardized response

    return {

      signedUrlResponse: {

        response,

        time,

        body

      },

      catalogResponse: {

        response:
          signedResponse,

        body:
          catalogBody

      }

    };

  }

  
  // =====================
  // Get Session Details
  // =====================

  async getSessionDetails(
    request,
    sessionId
  ) {

    const path =

      API_ENDPOINTS.SESSION_DETAILS

        .replace(
          '${eventId}',
          process.env.EVENT_ID
        )

        .replace(
          '${sessionId}',
          sessionId
        );

    return await apiRequest(

      request,

      'GET',

      path

    );

  }

 
  // =====================
  // Extract Session ID
  // =====================

  async extractFirstSessionId(
    request
  ) {

    const {
      catalogResponse
    } = await this.fetchCatalogData(
      request
    );

    return catalogResponse
      .body
      .data
      .catalogData
      .session[0]
      .sessionID;

  }



}
