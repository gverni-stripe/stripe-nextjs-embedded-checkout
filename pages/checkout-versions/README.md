# Checkout Implementation Versions

This folder contains four different implementations of the checkout page for testing purposes.

## Versions

### 1. standard.jsx (from main branch)
**URL:** https://stripe-nextjs-embedded-checkout.vercel.app/checkout-versions/standard

The standard implementation using:
- `@stripe/stripe-js` package
- `@stripe/react-stripe-js` package
- No additional script injections

### 2. connectjs-injected.jsx
**URL:** https://stripe-nextjs-embedded-checkout.vercel.app/checkout-versions/connectjs-injected

Enhanced version that injects only Connect.js:
- Uses Next.js `<Script>` component
- Injects `https://connect-js.stripe.com/v1.0/connect.js`
- Still uses the standard Stripe packages

### 3. stripejsv3-injected.jsx (from stripejsv3-injected branch)
**URL:** https://stripe-nextjs-embedded-checkout.vercel.app/checkout-versions/stripejsv3-injected

Enhanced version that injects Stripe.js v3 script:
- Uses Next.js `<Script>` component
- Injects `https://js.stripe.com/v3`
- Still uses the standard Stripe packages

### 4. stripejsv3-connectjs-injected.jsx (from stripejsv3-connectjs-injected branch)
**URL:** https://stripe-nextjs-embedded-checkout.vercel.app/checkout-versions/stripejsv3-connectjs-injected

Enhanced version that injects both Stripe.js v3 and Connect.js:
- Uses lowercase `<script>` tags (not Next.js Script component)
- Injects `https://js.stripe.com/v3`
- Injects `https://connect-js.stripe.com/v1.0/connect.js`
- Still uses the standard Stripe packages

## Testing

To test a specific version, you can:

1. Copy the desired version to `pages/checkout.jsx`
2. Or import and use it directly in your routing setup

Example:
```bash
# Test the stripejsv3-injected version
cp pages/checkout-versions/stripejsv3-injected.jsx pages/checkout.jsx
```

