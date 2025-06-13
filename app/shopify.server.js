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

// Initialize shopify instance
async function getShopifyInstance() {
  if (shopifyInstance) {
    return shopifyInstance;
  }

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
}

// Create lazy getters for all shopify properties
let _shopify = null;

const lazyShopify = {
  get default() {
    if (!_shopify) {
      _shopify = getShopifyInstance();
    }
    return _shopify;
  },
  
  get addDocumentResponseHeaders() {
    return async (...args) => {
      const shopify = await getShopifyInstance();
      return shopify.addDocumentResponseHeaders(...args);
    };
  },

  get authenticate() {
    return {
      admin: async (...args) => {
        const shopify = await getShopifyInstance();
        return shopify.authenticate.admin(...args);
      },
      webhook: async (...args) => {
        const shopify = await getShopifyInstance();
        return shopify.authenticate.webhook(...args);
      },
      public: {
        appProxy: async (...args) => {
          const shopify = await getShopifyInstance();
          return shopify.authenticate.public.appProxy(...args);
        },
        checkout: async (...args) => {
          const shopify = await getShopifyInstance();
          return shopify.authenticate.public.checkout(...args);
        }
      }
    };
  },

  get unauthenticated() {
    return {
      admin: async (...args) => {
        const shopify = await getShopifyInstance();
        return shopify.unauthenticated.admin(...args);
      }
    };
  },

  get login() {
    return async (...args) => {
      const shopify = await getShopifyInstance();
      return shopify.login(...args);
    };
  },

  get registerWebhooks() {
    return async (...args) => {
      const shopify = await getShopifyInstance();
      return shopify.registerWebhooks(...args);
    };
  },

  get sessionStorage() {
    return async (...args) => {
      const shopify = await getShopifyInstance();
      return shopify.sessionStorage(...args);
    };
  }
};

export default lazyShopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = lazyShopify.addDocumentResponseHeaders;
export const authenticate = lazyShopify.authenticate;
export const unauthenticated = lazyShopify.unauthenticated;
export const login = lazyShopify.login;
export const registerWebhooks = lazyShopify.registerWebhooks;
export const sessionStorage = lazyShopify.sessionStorage;