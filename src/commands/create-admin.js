#!/usr/bin/env node

/**
 * This is a CLI command to create an admin user.
 * Add this to your package.json scripts:
 * "create-admin": "node src/commands/create-admin.js"
 * 
 * Then run: npm run create-admin
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for admin user details
rl.question('Enter admin email: ', (email) => {
  rl.question('Enter admin password: ', (password) => {
    rl.question('Enter admin name: ', (name) => {
      rl.close();
      
      // Create a temporary Next.js API route
      const tempApiRoute = `
import { authClient } from "@/lib/auth-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await authClient.admin.createUser({
      email: "${email}",
      password: "${password}",
      name: "${name}",
      role: "admin"
    });
    
    return NextResponse.json({ success: true, message: "Admin user created successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create admin user" }, { status: 500 });
  }
}
      `;
      
      // Write the temporary API route to a file
      const fs = require('fs');
      const path = require('path');
      
      const apiDir = path.join(process.cwd(), 'src', 'app', 'api', 'temp-create-admin');
      
      if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(apiDir, 'route.ts'), tempApiRoute);
      
      console.log('Starting Next.js server...');
      
      // Start the Next.js server in the background
      const server = execSync('npm run dev', { stdio: 'inherit' });
      
      // Make a request to the temporary API route
      console.log('Creating admin user...');
      
      // Wait for the server to start
      setTimeout(() => {
        try {
          // Make a request to the API route
          const response = execSync('curl http://localhost:3000/api/temp-create-admin');
          console.log(response.toString());
          
          // Delete the temporary API route
          fs.rmSync(apiDir, { recursive: true, force: true });
          
          console.log('Admin user created successfully!');
          console.log(`Email: ${email}`);
          console.log(`Password: ${password}`);
          
          // Kill the server
          process.exit(0);
        } catch (error) {
          console.error('Failed to create admin user:', error);
          process.exit(1);
        }
      }, 5000);
    });
  });
}); 