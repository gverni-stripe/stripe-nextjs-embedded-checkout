# Stripe Embedded Checkout - Next.js

This is a Next.js implementation of Stripe's Embedded Checkout, ready for deployment on Vercel.

## Features

- ✨ Next.js 14 with Pages Router
- 💳 Stripe Embedded Checkout integration
- 🔐 Environment variable configuration
- 🚀 Ready for Vercel deployment
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- A Stripe account ([sign up here](https://stripe.com))

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

Create a `.env.local` file in the root directory with your Stripe credentials:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PRICE_ID=price_your_price_id_here
```

You can find these values in your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. You'll be redirected to the checkout page.

## Project Structure

```
├── pages/
│   ├── _app.jsx              # Next.js app wrapper
│   ├── index.jsx             # Home page (redirects to checkout)
│   ├── checkout.jsx          # Embedded checkout page
│   ├── return.jsx            # Success/return page
│   └── api/
│       ├── create-checkout-session.js  # Creates Stripe session
│       └── session-status.js           # Retrieves session status
├── styles/
│   └── globals.css           # Global styles
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies
```

## Deployment on Vercel

### Quick Deploy

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository on Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository

3. Configure environment variables in Vercel:
   - In the import dialog, add your environment variables:
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PRICE_ID`
     

4. Deploy!

### CLI Deployment

You can also deploy using the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Testing

Use Stripe's test cards for testing:
- Success: `4242 4242 4242 4242`
- Requires authentication: `4000 0027 6000 3184`
- Declined: `4000 0000 0000 0002`

Use any future expiration date, any 3-digit CVC, and any 5-digit postal code.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Yes |
| `STRIPE_PRICE_ID` | The Stripe Price ID for your product | Yes |

**Important:** Never commit `.env.local` to version control. The `.gitignore` file is configured to exclude it.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Vercel Deployment Documentation](https://vercel.com/docs)

## License

MIT
