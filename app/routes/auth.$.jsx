import { authenticate, registerWebhooks } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  // Register webhooks during installation/auth flow
  try {
    await registerWebhooks({
      webhooks: [
        {
          topic: "ORDERS_CREATE",
          address: "https://c42b-93-140-177-43.ngrok-free.app/orders/create",
        },
      ],
      session,
    });
    console.log("✅ Webhooks registered during auth flow");
  } catch (error) {
    console.error("❌ Webhook registration failed:", error);
  }

  return null;
};