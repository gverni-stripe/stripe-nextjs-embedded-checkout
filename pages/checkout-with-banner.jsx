import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { loadConnectAndInitialize } from '@stripe/connect-js/pure';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {
  ConnectNotificationBanner,
  ConnectComponentsProvider,
} from '@stripe/react-connect-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutWithBannerPage = () => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch client secret for Embedded Checkout
  const fetchClientSecret = useCallback(() => {
    return fetch("/api/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  // Initialize Stripe Connect for Notification Banner
  useEffect(() => {
    const initializeConnect = async () => {
      try {
        const response = await fetch("/api/create-account-session", {
          method: "POST",
        });
        
        const data = await response.json();
        
        if (data.error) {
          console.error('Error creating account session:', data.error);
          setMessage(`Note: Notification Banner requires STRIPE_CONNECTED_ACCOUNT_ID env variable`);
          return;
        }

        const instance = loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          fetchClientSecret: async () => data.clientSecret,
        });

        setStripeConnectInstance(instance);
      } catch (error) {
        console.error('Failed to initialize Connect:', error);
        setMessage('Note: Notification Banner could not be initialized');
      }
    };

    initializeConnect();
  }, []);

  const handleNotificationsChange = (response) => {
    if (response.actionRequired > 0) {
      setMessage(
        "You must resolve the notifications below before proceeding.",
      );
    } else if (response.total > 0) {
      setMessage("The items below are in review.");
    } else {
      setMessage("");
    }
  };

  const checkoutOptions = { fetchClientSecret };

  return (
    <>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .notification-section {
          margin-bottom: 30px;
        }
        .message {
          padding: 12px;
          background-color: #f6f9fc;
          border-left: 4px solid #0066cc;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }
        .checkout-section {
          margin-top: 30px;
        }
      `}</style>

      <div className="container">
        <h1>Checkout with Notification Banner</h1>
        
        {/* Notification Banner Section */}
        <div className="notification-section">
          <div className="section-title">Connected Account Notifications</div>
          
          {message && <div className="message">{message}</div>}
          
          {stripeConnectInstance ? (
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectNotificationBanner
                onNotificationsChange={handleNotificationsChange}
                collectionOptions={{
                  fields: 'currently_due',
                  futureRequirements: 'omit',
                }}
              />
            </ConnectComponentsProvider>
          ) : (
            <div className="message">
              {message || "Loading notification banner..."}
            </div>
          )}
        </div>

        {/* Embedded Checkout Section */}
        <div className="checkout-section">
          <div className="section-title">Payment Checkout</div>
          <div id="checkout">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={checkoutOptions}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutWithBannerPage;

