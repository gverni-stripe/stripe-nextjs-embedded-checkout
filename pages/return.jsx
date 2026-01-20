import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    if (!session_id) return;

    fetch(`/api/session-status?session_id=${session_id}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, [session_id]);

  if (status === 'open') {
    router.push('/checkout');
    return null;
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.

          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }

  return null;
}

export default Return;

