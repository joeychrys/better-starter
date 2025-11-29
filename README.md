# Next.js Starter Template with Better Auth

A comprehensive starting point for your Next.js projects with built-in authentication, pre-configured UI components, and a complete Docker-based development workflow from local development to staging and production environments.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-latest-black)
![Docker](https://img.shields.io/badge/Docker-latest-2496ED)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-336791)

## Features

### 🐳 Docker-Based Development Cycle
- Complete local, staging, and production environments
- PostgreSQL database integration for local development
- Traefik for reverse proxy and HTTPS in staging/production
- Consistent development environment across team members
- Easy deployment pipelines

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
- PostgreSQL database with Drizzle ORM
- Environment variable management
- API routing
- Dependabot integration for dependency management

## Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git my-project

# Navigate to project directory
cd my-project

# Start the local development environment
docker-compose -f docker-compose.local.yml up -d

# Access your app at http://localhost:3000
```

## Development Workflow

### Local Development

The local development environment uses Docker to provide a consistent development experience with hot-reloading and PostgreSQL database.

```bash
# Start local development environment
docker-compose -f docker-compose.local.yml up -d

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Stop the environment
docker-compose -f docker-compose.local.yml down
```

Environment variables for local development are stored in `.envs/.local/` directory.

### Staging Environment

The staging environment mimics the production setup but is configured for testing.

```bash
# Build and start staging environment
docker-compose -f docker-compose.staging.yml up -d

# Access the staging environment at port 1000
# http://localhost:1000

# Stop the staging environment
docker-compose -f docker-compose.staging.yml down
```

### Production Deployment

The production environment is configured with Traefik for handling HTTPS and routing.

### Prerequisites (SSL Certificates)

Before starting the production environment, you must ensure an `acme.json` file exists on your host machine to store SSL certificates. This file must be kept secure.

```bash
# Create the file on your host
touch acme.json

# Set strict permissions (required for Traefik security)
chmod 600 acme.json
```

### Running Production

```bash
# Build and start production environment
docker-compose -f docker-compose.production.yml up -d

# Stop the production environment
docker-compose -f docker-compose.production.yml down
```

### Security (CrowdSec)

The production setup includes CrowdSec for Intrusion Prevention (IPS) and Web Application Firewall (WAF) capabilities.

**Initial Setup:**
1. Generate a Bouncer API Key:
   ```bash
   docker exec -t crowdsec cscli bouncers add traefik-bouncer
   ```
2. Add this key to `.envs/.production/.traefik`:
   ```env
   CROWDSEC_LAPI_KEY=your_key_here
   ```
3. Restart Traefik:
   ```bash
   docker-compose -f docker-compose.production.yml restart traefik
   ```

**AppSec (WAF) Features:**
The setup includes the AppSec engine to block SQL injection, XSS, and other web attacks. The configuration files are located in `compose/production/crowdsec/`.

**Useful Commands:**
```bash
# View active decisions (bans)
docker exec -t crowdsec cscli decisions list

# Ban an IP manually
docker exec -t crowdsec cscli decisions add --ip 1.2.3.4

# Unban an IP
docker exec -t crowdsec cscli decisions delete --ip 1.2.3.4
```

## Project Structure

```
/
├── .envs/                  # Environment variables
│   ├── .local/             # Local development env vars
│   ├── .staging/           # Staging env vars
│   └── .production/        # Production env vars
├── compose/                # Docker configuration
│   ├── local/              # Local Docker setup
│   │   ├── node/           # Next.js app container
│   │   └── postgres/       # PostgreSQL container
│   ├── staging/            # Staging Docker setup
│   │   ├── node/           # Next.js app container
│   │   └── traefik/        # Traefik reverse proxy
│   └── production/         # Production Docker setup
│       ├── node/           # Next.js app container
│       └── traefik/        # Traefik reverse proxy
├── next-app/               # Next.js application
│   ├── src/                # Source code
│   │   ├── app/            # App Router routes
│   │   ├── components/     # Reusable components
│   │   ├── lib/            # Utility functions
│   │   └── providers/      # React context providers
│   └── ...                 # Config files
├── docker-compose.local.yml    # Local compose config
├── docker-compose.staging.yml  # Staging compose config
└── docker-compose.production.yml # Production compose config
```

## Configuration

### Environment Variables

- `.envs/.local/.next` - Next.js environment variables for local development
- `.envs/.local/.postgres` - PostgreSQL configuration for local development
- `.envs/.staging/.next.example` - Example Next.js environment variables for staging
- `.envs/.production/.next.example` - Example Next.js environment variables for production

### Docker Compose Files

- `docker-compose.local.yml` - Local development setup with hot-reloading
- `docker-compose.staging.yml` - Staging environment setup with Traefik
- `docker-compose.production.yml` - Production environment setup with Traefik

## Authentication Features

The template comes with a pre-configured authentication system from Better Auth. Users can:
- Sign up with email and password
- Sign in to existing accounts
- Recover forgotten passwords
- Manage their account settings

## Admin Dashboard

The admin dashboard provides tools for managing users and other aspects of your application:
- View all users
- Create new users
- Delete users
- Ban/unban users
- Revoke user sessions
- Impersonate users for testing

## UI Components

The template includes a wide range of pre-styled components using shadcn/ui that you can use to build your UI:
- Buttons, Cards, Inputs
- Modals, Dropdowns, Tabs
- Forms with validation
- Tables with sorting and pagination
- And many more...

## Making It Your Own

After cloning the template, you may want to:

1. Update the project name and description in `package.json`
2. Customize the landing page in `next-app/src/app/page.tsx`
3. Configure authentication settings in `next-app/src/lib/auth.ts`
4. Add your own logo and branding assets
5. Customize the color scheme in your Tailwind configuration
6. Update Docker configurations as needed

## Dependencies

The project uses several key dependencies:
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui components
- Better Auth for authentication
- PostgreSQL for database
- Drizzle ORM for database queries
- Docker and Docker Compose

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Better Auth](https://github.com/better-auth)
- [Docker](https://www.docker.com/)
- [Traefik](https://traefik.io/)
