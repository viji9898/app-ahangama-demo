// Stripe configuration helper
// Automatically selects the correct Stripe key based on environment

/**
 * Get the appropriate Stripe secret key based on environment
 * @returns {string} The Stripe secret key for current environment
 */
export function getStripeKey() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    if (!process.env.STRIPE_SECRET_KEY_LIVE) {
      throw new Error('STRIPE_SECRET_KEY_LIVE is required for production environment');
    }
    return process.env.STRIPE_SECRET_KEY_LIVE;
  } else {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required for development environment');
    }
    return process.env.STRIPE_SECRET_KEY;
  }
}

/**
 * Check if we're in production environment
 * @returns {boolean}
 */
export function isProductionEnvironment() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get environment display name
 * @returns {string}
 */
export function getEnvironmentName() {
  return process.env.NODE_ENV || 'development';
}