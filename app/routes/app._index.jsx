import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  TextField,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const webhookUrl = formData.get("webhookUrl") || "https://673b-93-139-150-42.ngrok-free.app";
  console.log("Creating webhook with URL:", webhookUrl);
  
  const response = await admin.graphql(
    `#graphql
      mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
          webhookSubscription {
            id
            callbackUrl
            topic
            format
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
          }
        }
      }`,
    {
      variables: {
        topic: "ORDERS_CREATE",
        webhookSubscription: {
          callbackUrl: webhookUrl,
          format: "JSON"
        },
      },
    },
  );
  
  const responseJson = await response.json();
  
  return {
    webhook: responseJson.data.webhookSubscriptionCreate.webhookSubscription,
    errors: responseJson.data.webhookSubscriptionCreate.userErrors,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const [webhookUrl, setWebhookUrl] = useState("https://5ca3-93-140-158-222.ngrok-free.app/order-webhook");
  
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
    
  const webhookId = fetcher.data?.webhook?.id;

  useEffect(() => {
    console.log("Webhook ID:", webhookId);
    console.log("Fetcher data:", fetcher.data);
    if (webhookId) {
      shopify.toast.show("Order webhook created successfully");
    }
    if (fetcher.data?.errors && fetcher.data.errors.length > 0) {
      shopify.toast.show(`Error: ${fetcher.data.errors[0].message}`, { isError: true });
    }
  }, [webhookId, fetcher.data?.errors, shopify]);

  const createWebhook = () => {
    const formData = new FormData();
    formData.append("webhookUrl", webhookUrl);
    fetcher.submit(formData, { method: "POST" });
  };

  return (
    <Page>
      <TitleBar title="Order Webhook Manager">
        <button variant="primary" onClick={createWebhook}>
          Create Order Webhook
        </button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Order Webhook Configuration 🔗
                  </Text>
                  <Text variant="bodyMd" as="p">
                    This app creates webhooks for order events using{" "}
                    <Link
                      url="https://shopify.dev/docs/apps/webhooks"
                      target="_blank"
                      removeUnderline
                    >
                      Shopify Webhooks
                    </Link>
                    . When a new order is created in your store, Shopify will send
                    the order data to your specified endpoint via{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/webhookSubscriptionCreate"
                      target="_blank"
                      removeUnderline
                    >
                      webhookSubscriptionCreate
                    </Link>{" "}
                    mutation.
                  </Text>
                </BlockStack>
                
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Webhook Endpoint Configuration
                  </Text>
                  <TextField
                    label="Webhook URL"
                    value={webhookUrl}
                    onChange={setWebhookUrl}
                    placeholder="https://5ca3-93-140-158-222.ngrok-free.app/order-webhook"
                    helpText="Enter the URL where you want to receive order creation notifications"
                  />
                  <Text as="p" variant="bodyMd">
                    Make sure your endpoint can receive POST requests and handle JSON data.
                    The webhook will be triggered every time a new order is created.
                  </Text>
                </BlockStack>
                
                <InlineStack gap="300">
                  <Button loading={isLoading} onClick={createWebhook}>
                    Create Order Webhook
                  </Button>
                </InlineStack>
                
                {fetcher.data?.webhook && (
                  <>
                    <Text as="h3" variant="headingMd">
                      Webhook Created Successfully
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.webhook, null, 2)}
                        </code>
                      </pre>
                    </Box>
                  </>
                )}
                
                {fetcher.data?.errors && fetcher.data.errors.length > 0 && (
                  <>
                    <Text as="h3" variant="headingMd" tone="critical">
                      Errors
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-critical"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border-critical"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.errors, null, 2)}
                        </code>
                      </pre>
                    </Box>
                  </>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Webhook Information
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Event Type
                      </Text>
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        ORDERS_CREATE
                      </Text>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Format
                      </Text>
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        JSON
                      </Text>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Method
                      </Text>
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        POST
                      </Text>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Next Steps
                  </Text>
                  <List>
                    <List.Item>
                      Set up your webhook endpoint to{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/webhooks/configuration/https"
                        target="_blank"
                        removeUnderline
                      >
                        handle incoming requests
                      </Link>
                    </List.Item>
                    <List.Item>
                      Test your webhook with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/webhooks/testing"
                        target="_blank"
                        removeUnderline
                      >
                        webhook testing tools
                      </Link>
                    </List.Item>
                    <List.Item>
                      Learn about{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks"
                        target="_blank"
                        removeUnderline
                      >
                        webhook verification
                      </Link>{" "}
                      for security
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Sample Webhook Payload
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Your endpoint will receive order data including customer info,
                    line items, shipping details, and payment information.
                  </Text>
                  <Link
                    url="https://shopify.dev/docs/api/webhooks/orders/orders-create"
                    target="_blank"
                    removeUnderline
                  >
                    View sample payload structure
                  </Link>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}