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

// Cache for the shopify instance
let shopifyInstance = null;
let shopifyPromise = null;

// Lazy initialization function
async function initializeShopify() {
  if (shopifyInstance) {
    return shopifyInstance;
  }

  if (shopifyPromise) {
    return shopifyPromise;
  }

  shopifyPromise = (async () => {
    const config = await fetchConfig();
    
    shopifyInstance = shopifyApp({
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

    return shopifyInstance;
  })();

  return shopifyPromise;
}

// Proxy object that lazily loads shopify methods
const shopifyProxy = new Proxy({}, {
  get(target, prop) {
    if (prop === 'then' || prop === 'catch' || prop === 'finally') {
      // Handle Promise-like behavior
      return undefined;
    }
    
    return async (...args) => {
      const shopify = await initializeShopify();
      return shopify[prop](...args);
    };
  }
});

export default shopifyProxy;
export const apiVersion = ApiVersion.January25;

// Export lazy-loaded methods
export const addDocumentResponseHeaders = async (...args) => {
  const shopify = await initializeShopify();
  return shopify.addDocumentResponseHeaders(...args);
};

export const authenticate = async (...args) => {
  const shopify = await initializeShopify();
  return shopify.authenticate(...args);
};

export const unauthenticated = async (...args) => {
  const shopify = await initializeShopify();
  return shopify.unauthenticated(...args);
};

export const login = async (...args) => {
  const shopify = await initializeShopify();
  return shopify.login(...args);
};

export const registerWebhooks = async (...args) => {
  const shopify = await initializeShopify();
  return shopify.registerWebhooks(...args);
};

export const sessionStorage = async (...args) => {
  const shopify = await initializeShopify();
  return shopify.sessionStorage(...args);
};