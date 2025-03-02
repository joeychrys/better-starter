import { authClient } from "@/lib/auth-client";

/**
 * This script creates an admin user.
 * Run it with: npx tsx src/scripts/create-admin.ts
 */
async function createAdminUser() {
  try {
    // Replace these values with your desired admin credentials
    const adminUser = {
      email: "admin@example.com",
      password: "SecurePassword123!",
      name: "Admin User",
      role: "admin"
    };

    console.log("Creating admin user...");
    await authClient.admin.createUser(adminUser);
    console.log("Admin user created successfully!");
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    console.log("Please change the password after first login.");
  } catch (error) {
    console.error("Failed to create admin user:", error);
  }
  process.exit(0);
}

createAdminUser(); 