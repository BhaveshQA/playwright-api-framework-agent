
import { getValidToken } from './authHelper.js';

import { ResponseTime }
  from './responseHelper.js';

/**
 * Calls the API with a bearer token
 * and returns response + timing + body text.
 */

export async function apiRequest(request,method,url,options = {}) {

  if (!request) {

    throw new Error(
      'Playwright request context is required'
    );

  }

  const fetchOptions = options;

  // =====================
  // Base URL Handling
  // =====================

  const baseURL = fetchOptions.baseURL || process.env.BASE_URL;

  const fullUrl =`${baseURL}${url}`;

  console.log('Final URL:',fullUrl);

  // =====================
  // Token
  // =====================

  const token =await getValidToken(request);

  // =====================
  // API Request
  // =====================

  const {response,time} = await ResponseTime(() =>

      request.fetch(

        fullUrl,

        {

          ...fetchOptions,

          method:
            method.toUpperCase(),

          headers: {

            ...(fetchOptions.headers || {}),

            Authorization:
              `Bearer ${token}`

          }

        }

      )

  );

  // =====================
  // Response Body
  // =====================

  const bodyText =
    await response.text();

  return {

    response,

    time,

    bodyText

  };

}

