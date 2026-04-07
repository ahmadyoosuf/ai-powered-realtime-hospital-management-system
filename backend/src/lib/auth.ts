import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI || "");
const db = client.db();

// Build plugins list - only include Polar if credentials are configured
const plugins: any[] = [
  admin({
    defaultRole: "patient",
    adminRole: ["admin", "superadmin"],
  }),
];

// Only add Polar plugin if credentials are available
if (process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_WEBHOOK_SECRET) {
  // Dynamic import would be ideal but Better Auth needs sync plugin registration
  // For now, Polar is disabled when credentials are not set
  console.log("Polar payment plugin enabled");
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
  emailAndPassword: { enabled: true },
  plugins,
  user: {
    additionalFields: {
      specialization: {
        type: "string",
        required: false,
      },
      department: {
        type: "string",
        required: false,
      },
      gender: {
        type: "string",
        required: false,
      },
      bloodgroup: {
        type: "string",
        required: false,
      },
      medicalHistory: {
        type: "string",
        required: false,
      },
      age: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
      },
      prescriptions: {
        type: "string[]",
        required: false,
      },
      appointments: {
        type: "string[]",
      },
    },
  },
});
