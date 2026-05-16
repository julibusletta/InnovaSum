
const NAVE_ENV = 'production';
const NAVE_TERMINAL_ID_NORMAL = 'f2823910-854c-4b19-bd80-06e960c314dd';
const NAVE_TERMINAL_ID_CUOTAS = 'bf1b6c74-59b7-4b90-a579-fa3b6ad2b492';
const NAVE_CLIENT_ID = 'TRG54rWLT09FFHPDQysXosdJp8g1Ehbl';
const NAVE_CLIENT_SECRET = 'hG-5o1v2Kjm5QfxRu7FMR8V4GtVjJM_6CfoiGg2cWHCamG4NE68czTRQQTtEkbHO';

const AUTH_URL = 'https://services.apinaranja.com/security-ms/api/security/auth0/b2b/m2ms';
const CHECKOUT_URL = 'https://api.ranty.io/api/payment_request/ecommerce';
const NAVE_AUDIENCE = 'https://naranja.com/ranty/merchants/api';

async function testNave() {
  console.log('--- NAVE API TEST ---');
  
  try {
    // 1. Auth
    console.log('Authenticating...');
    const authBody = {
      client_id: NAVE_CLIENT_ID,
      client_secret: NAVE_CLIENT_SECRET,
      audience: NAVE_AUDIENCE, 
      grant_type: 'client_credentials'
    };

    const authResponse = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authBody),
    });

    if (!authResponse.ok) {
      console.error('Auth failed:', await authResponse.text());
      return;
    }

    const { access_token } = await authResponse.json();
    console.log('Auth Success! Token received.');

    // 2. Checkout
    console.log('Creating payment intention...');
    const orderId = `TEST-${Date.now()}`;
    const paymentBody = {
      external_payment_id: orderId,
      seller: {
        pos_id: NAVE_TERMINAL_ID_NORMAL
      },
      transactions: [
        {
          amount: {
            currency: "ARS",
            value: "100.00"
          },
          installments: [1],
          products: [
            {
              name: "Test Item",
              description: "Test description",
              quantity: 1,
              unit_price: {
                currency: "ARS",
                value: "100.00"
              }
            }
          ]
        }
      ],
      additional_info: {
        callback_url: 'https://example.com/callback',
        back_url: 'https://example.com/back',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel'
      }
    };

    const checkoutResponse = await fetch(CHECKOUT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentBody),
    });

    const status = checkoutResponse.status;
    const responseText = await checkoutResponse.text();
    
    console.log('Checkout Response Status:', status);
    console.log('Checkout Response Body:', responseText);

    if (status === 403) {
      console.log('REPRODUCED: Forbidden error detected.');
    }

  } catch (error) {
    console.error('Test script error:', error);
  }
}

testNave();
