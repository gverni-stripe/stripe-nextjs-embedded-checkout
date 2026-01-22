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

const ConnectDashboard = () => {
  const [activeView, setActiveView] = useState('notification-banner');
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null);
  const [message, setMessage] = useState("");
  const [checkoutInitialized, setCheckoutInitialized] = useState(false);

  // Fetch client secret for Embedded Checkout (only when needed)
  const fetchClientSecret = useCallback(() => {
    console.log('[Connect Dashboard] Fetching checkout session...');
    return fetch("/api/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('[Connect Dashboard] Checkout session created');
        return data.clientSecret;
      });
  }, []);

  // Initialize Stripe Connect for Notification Banner on mount
  useEffect(() => {
    console.log('[Connect Dashboard] Initializing Notification Banner...');
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
        console.log('[Connect Dashboard] Notification Banner initialized successfully');
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
        `${response.actionRequired} notification(s) require your attention.`,
      );
    } else if (response.total > 0) {
      setMessage(`${response.total} notification(s) in review.`);
    } else {
      setMessage("No notifications at this time.");
    }
  };

  const handleNavClick = (view) => {
    console.log(`[Connect Dashboard] Switching to view: ${view}`);
    setActiveView(view);
    
    // Mark checkout as initialized when first accessed
    if (view === 'checkout' && !checkoutInitialized) {
      console.log('[Connect Dashboard] Initializing Embedded Checkout for the first time...');
      setCheckoutInitialized(true);
    }
  };

  const checkoutOptions = { fetchClientSecret };

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          display: block !important;
          justify-content: flex-start !important;
          height: auto !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            'Helvetica Neue', 'Ubuntu', sans-serif;
        }
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f6f9fc;
          width: 100%;
        }
        .sidebar {
          width: 30%;
          background: #ffffff;
          border-right: 1px solid #e6e6e6;
          padding: 20px 0;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
        }
        .sidebar-header {
          padding: 0 20px 20px;
          border-bottom: 1px solid #e6e6e6;
          margin-bottom: 20px;
        }
        .sidebar-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }
        .sidebar-subtitle {
          font-size: 12px;
          color: #666;
          margin: 5px 0 0 0;
        }
        .nav-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .nav-item {
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
          color: #424770;
          font-size: 14px;
          font-weight: 500;
        }
        .nav-item:hover {
          background: #f6f9fc;
          color: #0066cc;
        }
        .nav-item.active {
          background: #f0f7ff;
          border-left-color: #0066cc;
          color: #0066cc;
        }
        .nav-item-icon {
          display: none;
        }
        .main-content {
          width: 70%;
          padding: 40px;
          overflow-y: auto;
          flex-shrink: 0;
        }
        .content-wrapper {
          width: 100%;
          max-width: none;
        }
        .content-header {
          margin-bottom: 30px;
        }
        .content-title {
          font-size: 28px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 10px 0;
        }
        .content-description {
          font-size: 16px;
          color: #666;
          margin: 0;
        }
        .status-message {
          padding: 12px 16px;
          background-color: #f6f9fc;
          border-left: 4px solid #0066cc;
          margin-bottom: 20px;
          border-radius: 4px;
          font-size: 14px;
          color: #424770;
        }
        .banner-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .checkout-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .checkout-container #checkout {
          width: 100% !important;
          max-width: 100% !important;
        }
        .loading-message {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Connect Hub</h1>
            <p className="sidebar-subtitle">Stripe Components</p>
          </div>
          <ul className="nav-menu">
            <li
              className={`nav-item ${activeView === 'notification-banner' ? 'active' : ''}`}
              onClick={() => handleNavClick('notification-banner')}
            >
              <span className="nav-item-icon">🔔</span>
              Notification Banner
            </li>
            <li
              className={`nav-item ${activeView === 'checkout' ? 'active' : ''}`}
              onClick={() => handleNavClick('checkout')}
            >
              <span className="nav-item-icon">💳</span>
              Checkout
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-wrapper">
            {activeView === 'notification-banner' && (
              <>
                <div className="content-header">
                  <h2 className="content-title">Notification Banner</h2>
                  <p className="content-description">
                    View and manage notifications for your connected account
                  </p>
                </div>

                {message && <div className="status-message">{message}</div>}

                <div className="banner-container">
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
                    <div className="loading-message">
                      {message || "Initializing notification banner..."}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeView === 'checkout' && (
              <>
                <div className="content-header">
                  <h2 className="content-title">Checkout</h2>
                  <p className="content-description">
                    Complete your payment securely
                  </p>
                </div>

                <div className="checkout-container">
                  {checkoutInitialized ? (
                    <div id="checkout">
                      <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={checkoutOptions}
                      >
                        <EmbeddedCheckout />
                      </EmbeddedCheckoutProvider>
                    </div>
                  ) : (
                    <div className="loading-message">
                      Loading checkout...
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectDashboard;

