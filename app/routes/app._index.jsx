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
  Badge,
  Icon,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  const shopify = useAppBridge();

  useEffect(() => {
    shopify.toast.show("Welcome to Circular Wealth Tracking! 🎯");
  }, [shopify]);

  return (
    <Page>
      <TitleBar title="Circular Wealth Tracking Dashboard" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="300">
                  <Text as="h1" variant="headingLg">
                    Welcome to the Circular Wealth Team! 🚀
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Congratulations on taking the first step towards maximizing your affiliate marketing potential! 
                    At Circular Wealth, we specialize in performance-driven affiliate marketing solutions that help 
                    businesses like yours unlock new revenue streams and expand their reach. Our team of experts has 
                    been at the forefront of digital marketing innovation, working with merchants across various 
                    industries to create powerful partnerships that drive real results. We're not just another affiliate 
                    network – we're your strategic partners in growth, committed to providing transparent tracking, 
                    reliable payouts, and cutting-edge technology that puts you ahead of the competition.
                  </Text>
                </BlockStack>
                
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    🎯 How Our Advanced Tracking Works
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Our sophisticated tracking system operates seamlessly behind the scenes, creating an invisible 
                    web of precision that captures every valuable conversion opportunity. When a potential customer 
                    clicks on one of our carefully crafted affiliate links, they're smoothly redirected to your store 
                    carrying a unique transaction ID – a digital fingerprint that our intelligent app automatically 
                    detects and securely archives. This creates an unbreakable tracking thread that follows each 
                    customer through their entire shopping journey, from initial curiosity to final purchase decision. 
                    The moment they complete a purchase, our system springs into action with lightning-fast precision – 
                    instantly capturing order details, cross-referencing with the original transaction ID, and 
                    communicating with our secure servers to validate and process the conversion. The confirmed order 
                    data flows seamlessly to TUNE, our enterprise-grade tracking platform, where advanced algorithms 
                    process it for precise commission calculations and timely affiliate payouts.
                  </Text>
                </BlockStack>
                  
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    ⚙️ Quick Setup Required
                  </Text>
                  <Text variant="bodyMd" as="p">
                    <Text as="span" variant="bodyMd" fontWeight="bold">Important Setup Step:</Text> To activate your 
                    tracking system, you'll need to enable our theme extension in your store. Navigate to your 
                    <Text as="span" variant="bodyMd" fontWeight="semibold">Online Store → Themes</Text>, then click 
                    <Text as="span" variant="bodyMd" fontWeight="semibold">Customize</Text> on your current theme. 
                    In the theme editor, look for <Text as="span" variant="bodyMd" fontWeight="semibold">App embeds</Text> 
                    in the left sidebar, find <Text as="span" variant="bodyMd" fontWeight="semibold">Circular Wealth Tracking</Text>, 
                    and toggle it on. Remember to click <Text as="span" variant="bodyMd" fontWeight="semibold">Save</Text> 
                    in the top right corner to activate the tracking. This ensures every conversion is captured and 
                    properly attributed to your affiliate partners.
                  </Text>
                </BlockStack>
                
                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm">
                    📧 Need Support?
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Questions? Contact us at{" "}
                    <Link url="mailto:support@cw.com" removeUnderline>
                      <Text as="span" variant="bodyMd" fontWeight="semibold">support@cw.com</Text>
                    </Link>
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    🎯 Tracking Status
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        App Status
                      </Text>
                      <Badge tone="success">Active</Badge>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        TUNE Integration
                      </Text>
                      <Badge tone="success">Connected</Badge>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Order Tracking
                      </Text>
                      <Badge tone="success">Enabled</Badge>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    📊 How It Works
                  </Text>
                  <List>
                    <List.Item>
                      Customer clicks affiliate link with unique transaction ID
                    </List.Item>
                    <List.Item>
                      Our app captures and securely stores the tracking data
                    </List.Item>
                    <List.Item>
                      System monitors for completed purchases in real-time
                    </List.Item>
                    <List.Item>
                      Confirmed orders are automatically sent to TUNE platform
                    </List.Item>
                    <List.Item>
                      Affiliates receive proper attribution and commission
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
              
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    🔗 Quick Links
                  </Text>
                  <BlockStack gap="300">
                    <Link
                      url="https://help.tune.com/"
                      target="_blank"
                      removeUnderline
                    >
                      TUNE Documentation
                    </Link>
                    <Link
                      url="https://shopify.dev/docs/apps/webhooks"
                      target="_blank"
                      removeUnderline
                    >
                      Shopify Webhooks Guide
                    </Link>
                    <Link
                      url="mailto:support@cw.com"
                      removeUnderline
                    >
                      Contact Support
                    </Link>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}