# Checkout with Notification Banner

This page (`/checkout-with-banner`) demonstrates how to combine two Stripe features in a single page:

1. **Embedded Checkout** - For collecting payments
2. **Notification Banner** - For displaying connected account notifications (Stripe Connect)

## URL

**Local:** http://localhost:3000/checkout-with-banner  
**Production:** https://stripe-nextjs-embedded-checkout.vercel.app/checkout-with-banner

## Features

### Embedded Checkout
- Standard payment checkout flow
- Uses `@stripe/stripe-js` and `@stripe/react-stripe-js`
- Creates a checkout session via `/api/create-checkout-session`

### Notification Banner
- Shows notifications for connected accounts (Stripe Connect)
- Displays required actions for risk interventions
- Shows outstanding requirements for account capabilities
- Uses `@stripe/connect-js` and `@stripe/react-connect-js`
- Creates an account session via `/api/create-account-session`

## Setup

### Environment Variables

In addition to the standard Stripe environment variables, you need:

```env
# Required for all Stripe functionality
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PRICE_ID=price_your_price_id_here

# Required for Notification Banner
STRIPE_CONNECTED_ACCOUNT_ID=acct_your_connected_account_id_here
```

### Getting a Connected Account ID

To use the Notification Banner, you need a Stripe Connect account:

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Connect** → **Accounts**
3. Create a test connected account or use an existing one
4. Copy the Account ID (starts with `acct_`)
5. Add it to your `.env.local` file as `STRIPE_CONNECTED_ACCOUNT_ID`

## API Endpoints

### `/api/create-checkout-session`
Creates a Stripe Checkout Session for the Embedded Checkout component.

**Method:** POST  
**Returns:** `{ clientSecret: string }`

### `/api/create-account-session`
Creates a Stripe Account Session for the Notification Banner component.

**Method:** POST  
**Returns:** `{ clientSecret: string, accountId: string }`  
**Requires:** `STRIPE_CONNECTED_ACCOUNT_ID` environment variable

## Implementation Details

### Dependencies
```json
{
  "@stripe/stripe-js": "^7.3.0",
  "@stripe/react-stripe-js": "^3.7.0",
  "@stripe/react-connect-js": "^4.x.x"
}
```

### Component Structure

The page uses two separate Stripe instances:

1. **Stripe Instance** (for Embedded Checkout)
   - Created with `loadStripe(publishableKey)`
   - Wrapped with `EmbeddedCheckoutProvider`

2. **Stripe Connect Instance** (for Notification Banner)
   - Created with `loadConnectAndInitialize()`
   - Wrapped with `ConnectComponentsProvider`

### Notification Banner Configuration

The notification banner is configured to:
- Collect `currently_due` requirements (can be changed to `eventually_due`)
- Omit future requirements (can be changed to `include`)
- Enable external account collection
- Display custom messages based on notification status

## Testing

### Testing the Notification Banner

To test the notification banner and see notifications appear:

1. Create a test connected account in your Stripe Dashboard
2. Use the [Account Management component](https://docs.stripe.com/connect/supported-embedded-components/account-management) or Stripe API to trigger requirements
3. Enter test inputs that fail verification (e.g., `address_no_match` in address fields)
4. The notification banner will display the required actions

### Testing Embedded Checkout

Use standard Stripe test cards:
- Success: `4242 4242 4242 4242`
- Requires authentication: `4000 0027 6000 3184`
- Declined: `4000 0000 0000 0002`

## Troubleshooting

### "STRIPE_CONNECTED_ACCOUNT_ID environment variable is not set"

This error appears when the connected account ID is missing. The Notification Banner will not render, but the Embedded Checkout will still work.

**Solution:** Add the `STRIPE_CONNECTED_ACCOUNT_ID` to your `.env.local` file.

### Notification Banner is Empty

If the banner renders but shows no content, this is expected when:
- The connected account has no pending requirements
- The account has no active risk interventions
- The account hasn't completed initial onboarding

This is normal behavior in production.

## Learn More

- [Stripe Connect Notification Banner Documentation](https://docs.stripe.com/connect/supported-embedded-components/notification-banner)
- [Stripe Embedded Checkout Documentation](https://docs.stripe.com/payments/checkout)
- [Stripe Connect Documentation](https://docs.stripe.com/connect)
- [Account Sessions API](https://docs.stripe.com/api/account_sessions)

## Related Files

- Page: `pages/checkout-with-banner.jsx`
- API Endpoints:
  - `pages/api/create-checkout-session.js`
  - `pages/api/create-account-session.js`

