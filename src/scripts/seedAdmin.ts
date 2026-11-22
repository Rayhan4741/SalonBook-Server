import mongoose from "mongoose";
import { config } from "../config/env";
import { auth } from "../auth/betterAuth";
import { User } from "../models/User";
import { getNativeClient } from "../config/db";

export async function seedAdminUser() {
  console.log("Seeding admin user via Better Auth...");
  await mongoose.connect(config.mongodbUri);
  const nativeDb = getNativeClient().db();

  const email = config.adminEmail.toLowerCase();
  const password = config.adminPassword;

  // Delete existing unworking account/user record for admin if needed
  await nativeDb.collection("account").deleteMany({ accountId: email });
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    await nativeDb.collection("account").deleteMany({ userId: existingUser._id });
    await nativeDb.collection("account").deleteMany({ userId: existingUser._id.toString() });
    await User.deleteOne({ _id: existingUser._id });
  }

  // Create freshly using Better Auth API
  try {
    const res = await auth.api.signUpEmail({
      body: {
        name: "SalonBook Administrator",
        email,
        password,
      },
    });
    console.log("Better Auth admin signup success:", res?.user?.id);
  } catch (err: any) {
    console.warn("Sign up note:", err.message);
  }

  // Set role to admin
  await User.updateOne({ email }, { $set: { role: "admin", isBlocked: false } });
  console.log("✅ Admin user role verified and updated to 'admin'.");

  // Verify sign in works
  const signin = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  console.log("✅ Verified: Admin sign in works! Token:", signin?.token);
}

if (require.main === module) {
  seedAdminUser()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
