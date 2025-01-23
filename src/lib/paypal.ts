import crypto from 'crypto';

interface PayPalHeaders {
    'PAYPAL-TRANSMISSION-ID': string | null;
    'PAYPAL-TRANSMISSION-TIME': string | null;
    'PAYPAL-TRANSMISSION-SIG': string | null;
    'PAYPAL-CERT-URL': string | null;
    'PAYPAL-AUTH-ALGO': string | null;
}

export const createPayPalOrder = async (
    items: { price: number; quantity: number }[],
    cartId: string,
    userId?: string
) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getPayPalAccessToken()}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    custom_id: cartId,
                    custom: { userId: userId || '-' },
                    amount: {
                        currency_code: 'USD',
                        value: total.toFixed(2),
                    },
                },
            ],
        }),
    });

    const order = await response.json();
    return order;
};

export const capturePayPalOrder = async (orderId: string) => {
    const response = await fetch(
        `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getPayPalAccessToken()}`,
            },
        }
    );

    const captureData = await response.json();
    return captureData;
};

export const verifyPayPalWebhook = async (
    body: string,
    headers: PayPalHeaders,
    webhookSecret: string
) => {
    const transmissionId = headers['PAYPAL-TRANSMISSION-ID'];
    const transmissionTime = headers['PAYPAL-TRANSMISSION-TIME'];
    const transmissionSig = headers['PAYPAL-TRANSMISSION-SIG'];
    const certUrl = headers['PAYPAL-CERT-URL'];
    const authAlgo = headers['PAYPAL-AUTH-ALGO'];

    if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
        return false;
    }

    // Get PayPal's public certificate
    const certResponse = await fetch(certUrl);
    const publicKey = await certResponse.text();

    // Create validation string
    const validationString = `${transmissionId}|${transmissionTime}|${webhookSecret}|${body}`;

    // Verify signature
    const verify = crypto.createVerify(authAlgo);
    verify.update(validationString);
    verify.end();

    try {
        return verify.verify(publicKey, transmissionSig, 'base64');
    } catch {
        return false;
    }
};

async function getPayPalAccessToken(): Promise<string> {
    const auth = Buffer.from(
        `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
    ).toString('base64');

    const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`,
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
}