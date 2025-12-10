import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Roles, validateRole } from "./constants";

const client = new MongoClient(process.env.MONGODB!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
        default: Roles.Student,
        validate: validateRole,
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: Roles.Student,
            },
          };
        },
      },
    },
  },
});
