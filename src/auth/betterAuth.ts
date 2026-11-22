import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { getNativeClient } from "../config/db";
import { config } from "../config/env";

export const auth = betterAuth({
  database: mongodbAdapter(getNativeClient().db()),
  secret: config.betterAuthSecret,
  baseURL: config.serverUrl,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false, // Prevents client from setting role during signup
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // Prevents client from setting isBlocked
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders:
    config.googleClientId && config.googleClientSecret
      ? {
          google: {
            clientId: config.googleClientId,
            clientSecret: config.googleClientSecret,
          },
        }
      : undefined,
  plugins: [
    jwt({
      jwt: {
        expirationTime: "7d",
      },
    }),
  ],
  trustedOrigins: [
    config.clientUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    config.serverUrl,
  ],
});
