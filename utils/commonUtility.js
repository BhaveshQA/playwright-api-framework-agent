import crypto from 'crypto';

// ============================================
// GENERATE DEVICE ID
// ============================================

export function generateDeviceId() {

  return crypto.randomUUID();

}
