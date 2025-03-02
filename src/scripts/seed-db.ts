import { createHash } from "crypto";

/**
 * This script seeds the database with an admin user.
 * You'll need to adapt this to your specific database setup.
 * Run it with: npx tsx src/scripts/seed-db.ts
 */

// Example for SQLite with better-sqlite3
async function seedDatabase() {
  try {
    // Import database - adjust this to your actual database setup
    const Database = require("better-sqlite3");
    const db = new Database("./your-database.db");
    
    // Hash the password - adjust this to match your auth system's hashing method
    const password = "SecurePassword123!";
    const hashedPassword = createHash("sha256").update(password).digest("hex");
    
    // Insert admin user directly into the database
    // Adjust the table name and columns to match your schema
    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, role, emailVerified, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const now = new Date().toISOString();
    stmt.run(
      "admin@example.com",
      hashedPassword,
      "Admin User",
      "admin",
      1, // emailVerified = true
      now,
      now
    );
    
    console.log("Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: SecurePassword123!");
    console.log("Please change the password after first login.");
    
    // Close the database connection
    db.close();
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

seedDatabase(); 