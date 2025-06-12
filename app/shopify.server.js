import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

// Fetch config object from Laravel API
async function fetchConfig() {
  const response = await fetch('https://f38a-78-0-35-63.ngrok-free.app/api/orders/config');
  const config = await response.json();
  
  return {
    apiKey: config.API_KEY,
    apiSecretKey: config.API_SECRET,
    scopes: config.SCOPES?.split(","),
    appUrl: config.APP_URL,
  };
}

// Initialize with fetched config
const config = await fetchConfig();

const shopify = shopifyApp({
  apiKey: config.apiKey,
  apiSecretKey: config.apiSecretKey || "",
  apiVersion: ApiVersion.January25,
  scopes: config.scopes,
  appUrl: config.appUrl || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: false,
    removeRest: true,
  },
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;