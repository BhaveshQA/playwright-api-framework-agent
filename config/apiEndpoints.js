
export const API_ENDPOINTS = {

  // =====================
  // Authorization
  // =====================

  AUTHORIZE:
    '/oauth2/token',

  // =====================
  // Event APIs
  // =====================

  GET_EVENTS:
    '/events',

  // =====================
  // Session APIs
  // =====================

  SESSION_CATALOG:
    '/events/${eventId}/sessions/catalog',

  SESSION_DETAILS:
    '/events/${eventId}/sessions/${sessionId}',

  // =====================
  // Sponsor APIs
  // =====================

  

 SESSIONS_TO_RATE: '/sessions-to-rate',


  SPONSORS_CATALOG_MOB:
    '/events/${eventId}/sponsorship/catalog'


};