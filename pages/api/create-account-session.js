const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log('[Account Session API] Request received:', {
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (req.method !== 'POST') {
    console.log('[Account Session API] Method not allowed:', req.method);
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // You need to set STRIPE_CONNECTED_ACCOUNT_ID in your .env.local file
    const connectedAccountId = process.env.STRIPE_CONNECTED_ACCOUNT_ID;
    
    console.log('[Account Session API] Environment check:', {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasConnectedAccountId: !!connectedAccountId,
      connectedAccountId: connectedAccountId ? `${connectedAccountId.slice(0, 10)}...` : 'NOT SET',
    });
    
    if (!connectedAccountId) {
      console.error('[Account Session API] ERROR: STRIPE_CONNECTED_ACCOUNT_ID not set');
      return res.status(400).json({ 
        error: 'STRIPE_CONNECTED_ACCOUNT_ID environment variable is not set' 
      });
    }

    console.log('[Account Session API] Creating account session for account:', connectedAccountId);

    // Check if accountSessions API is available
    if (!stripe.accountSessions) {
      console.error('[Account Session API] ERROR: stripe.accountSessions is undefined. Stripe SDK version may be too old.');
      return res.status(500).json({ 
        error: 'Account Sessions API not available. Please update the Stripe SDK to the latest version.',
        hint: 'Run: npm install stripe@latest'
      });
    }

    const accountSession = await stripe.accountSessions.create({
      account: connectedAccountId,
      components: {
        notification_banner: {
          enabled: true,
          features: {
            external_account_collection: true,
          },
        },
      },
    });

    console.log('[Account Session API] Account session created successfully:', {
      accountId: connectedAccountId,
      hasClientSecret: !!accountSession.client_secret,
    });

    res.status(200).json({ 
      clientSecret: accountSession.client_secret,
      accountId: connectedAccountId 
    });
  } catch (err) {
    console.error('[Account Session API] ERROR:', {
      message: err.message,
      type: err.type,
      code: err.code,
      statusCode: err.statusCode,
      raw: err.raw,
      stack: err.stack,
    });
    
    res.status(500).json({ 
      error: err.message,
      type: err.type || 'unknown_error',
      code: err.code || 'unknown_code',
    });
  }
}

