
import { apiRequest } from '../utils/apiClient.js';

import { API_ENDPOINTS } from '../config/apiEndpoints.js';

export class EventService {

  async getAllEvents(request) {

    return await apiRequest(request,'GET',API_ENDPOINTS.GET_EVENTS);

  }

}

