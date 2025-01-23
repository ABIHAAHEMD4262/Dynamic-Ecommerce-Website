// "use server";

// import { getCurrentSession } from '@/actions/auth';
// import { getOrCreateCart } from '@/actions/cart-actions';
// import * as paypal from '@paypal/checkout-server-sdk';

// // Create PayPal environment
// const environment = new paypal.core.SandboxEnvironment(
//     process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
//     process.env.PAYPAL_SECRET_KEY!
// );
// const client = new paypal.core.PayPalHttpClient(environment);

// export const createCheckoutSession = async (cartId: string) => {
//     const { user } = await getCurrentSession();
//     const cart = await getOrCreateCart(cartId);

//     if(cart.items.length === 0) {
//         throw new Error('Cart is empty');
//     }

//     const totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

//     const request = new paypal.orders.OrdersCreateRequest();
//     request.prefer("return=representation");
//     request.requestBody({
//         intent: 'CAPTURE',
//         purchase_units: [{
//             amount: {
//                 currency_code: 'USD',
//                 value: totalPrice.toFixed(2)
//             },
//             items: cart.items.map(item => ({
//                 name: item.title,
//                 unit_amount: {
//                     currency_code: 'USD',
//                     value: item.price.toFixed(2)
//                 },
//                 quantity: item.quantity.toString()
//             }))
//         }],
//         application_context: {
//             return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order_id={order_id}`,
//             cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`
//         }
//     });

//     try {
//         const order = await client.execute(request);
//         const approveUrl = order.result.links.find((link: { rel: string; }) => link.rel === "approve")?.href;
        
//         if (!approveUrl) {
//             throw new Error("Failed to create PayPal order");
//         }

//         return approveUrl;
//     } catch (error) {
//         console.error('PayPal order creation failed:', error);
//         throw new Error("Failed to create PayPal checkout session");
//     }
// }