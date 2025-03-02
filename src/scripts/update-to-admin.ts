/**
 * This script updates an existing user to have admin role.
 * Run it with: npx tsx src/scripts/update-to-admin.ts
 */

// Example for SQLite with better-sqlite3
async function updateUserToAdmin() {
  try {
    // Import database - adjust this to your actual database setup
    const Database = require("better-sqlite3");
    const db = new Database("./your-database.db");
    
    // The email of the user you want to make an admin
    const userEmail = "your-email@example.com";
    
    // Update the user's role to admin
    const stmt = db.prepare(`
      UPDATE users
      SET role = 'admin'
      WHERE email = ?
    `);
    
    const result = stmt.run(userEmail);
    
    if (result.changes === 0) {
      console.error(`No user found with email: ${userEmail}`);
    } else {
      console.log(`User ${userEmail} has been updated to admin role!`);
    }
    
    // Close the database connection
    db.close();
  } catch (error) {
    console.error("Failed to update user:", error);
  }
}

updateUserToAdmin(); 