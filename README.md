# Next.js Starter Template with Better Auth

A comprehensive starting point for your Next.js projects with built-in authentication, pre-configured UI components, and everything you need to build modern web applications quickly.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-latest-black)

## Features

### 🔒 Authentication System
- Complete authentication flow with sign-up, sign-in, and password recovery
- User role management (admin, user)
- Session management
- User banning and management capabilities
- Admin impersonation for testing

### 🎨 UI Components
- Beautiful UI components built with Tailwind CSS and shadcn/ui
- Dark/light mode theme support
- Responsive layouts
- Form components with validation
- Tables with pagination and search

### 🔧 Technical Features
- TypeScript for type safety
- Next.js App Router for efficient routing
- Database integrations with migrations
- Environment variable management
- API routing

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git my-project

# Navigate to project directory
cd my-project

# Remove the existing git history
rm -rf .git

# Initialize a new git repository
git init
git add .
git commit -m "Initial commit"

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see your application.

## Detailed Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Step 1: Clone the Repository

Clone this repository and rename it to your project name:

```bash
git clone https://github.com/your-username/your-repo-name.git my-project
cd my-project
```

### Step 2: Remove Git History

Remove the existing git history to start fresh:

```bash
# For Unix/Linux/MacOS
rm -rf .git

# For Windows
rmdir /s /q .git
```

### Step 3: Initialize a New Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 4: Install Dependencies

```bash
npm install
# or
yarn
```

### Step 5: Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your configuration values:

```
# Authentication
AUTH_SECRET=your-secret-here
AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your-database-url

# Email (for password reset)
EMAIL_SERVER=smtp://user:pass@host:port
EMAIL_FROM=noreply@example.com
```

### Step 6: Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Now open [http://localhost:3000](http://localhost:3000) in your browser to see your application.

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication routes
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API routes
│   │   └── page.tsx         # Landing page
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components from shadcn
│   │   └── ...              # Other components
│   ├── lib/                 # Utility functions and libraries
│   │   ├── auth.ts          # Auth configuration
│   │   └── ...              # Other libraries
│   └── providers/           # React context providers
├── public/                  # Static assets
└── ...                      # Config files
```

## Usage

### Authentication

The template comes with a pre-configured authentication system. Users can:
- Sign up with email and password
- Sign in to existing accounts
- Recover forgotten passwords
- Manage their account settings

### Admin Dashboard

The admin dashboard provides tools for managing users and other aspects of your application:
- View all users
- Create new users
- Delete users
- Ban/unban users
- Revoke user sessions
- Impersonate users for testing

### UI Components

The template includes a wide range of pre-styled components that you can use to build your UI:
- Buttons, Cards, Inputs
- Modals, Dropdowns, Tabs
- Forms with validation
- Tables with sorting and pagination
- And many more...

## Making It Your Own

After cloning the template, you may want to:

1. Update the project name and description in `package.json`
2. Customize the landing page in `src/app/page.tsx`
3. Configure authentication settings in `src/lib/auth.ts`
4. Add your own logo and branding assets
5. Customize the color scheme in your Tailwind configuration

## TODO

### Admin
- Refactor admin dashboard for better performance
- Use Zod for form validation and submission
- Add additional filtering options
- Improve UI for mobile views

### Email
- Add verification with Resend.com
- Implement email templates
- Add notification system

### Profile
- Create a profile page for users to view and update information
- Add avatar upload functionality
- Include preferences and settings

### General
- Improve test coverage
- Add documentation
- Create deployment guides

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Better Auth](https://github.com/better-auth)
