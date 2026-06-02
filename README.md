# EdgeConnect Gateway

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Spiderspun0/edgeconnect-gateway-secure-remote-desktop-access)

A production-ready full-stack application template built for Cloudflare Workers, featuring a modern React frontend with Hono-powered API routes and Durable Objects for persistent state.

## Description

EdgeConnect Gateway is a comprehensive starter template for building scalable, edge-native applications. It combines a responsive React frontend with a Cloudflare Workers backend, providing built-in support for real-time data synchronization, authentication patterns, and deployment automation.

## Key Features

- **Edge-First Architecture**: Leverages Cloudflare Workers and Durable Objects for global, low-latency data persistence
- **Modern React Frontend**: Built with Vite, React Router, TanStack Query, and shadcn/ui components
- **Type-Safe Development**: Full TypeScript support across frontend, shared types, and worker code
- **Styling System**: Tailwind CSS with custom design tokens, animations, and dark mode
- **API Framework**: Hono-based routing with CORS, logging, and error handling
- **Demo Infrastructure**: Pre-configured counter and demo item management using Durable Objects
- **Developer Experience**: Hot reload, error boundaries, theme toggling, and mobile-responsive layout

## Technology Stack

**Frontend**
- React 18 + TypeScript
- Vite + Cloudflare Vite Plugin
- Tailwind CSS + shadcn/ui
- TanStack React Query
- React Router v6
- Framer Motion + Lucide icons

**Backend**
- Cloudflare Workers
- Hono framework
- Durable Objects (GlobalDurableObject)
- Wrangler for deployment

**Shared**
- TypeScript path aliases (@shared/*)
- Zod for validation
- Immer for state management

## Prerequisites

- Bun (recommended) or Node.js 18+
- Cloudflare account (for deployment)
- Git

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd edgeconnect-gateway-rzuwnhywitkebgeakxfi0

# Install dependencies
bun install
```

## Usage

### Development

Start the local development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000` (or the port specified by `$PORT`).

### Building

Create a production build:

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

### Linting

```bash
bun run lint
```

### Generate Cloudflare Types

```bash
bun run cf-typegen
```

## Project Structure

- `src/` — React frontend application
- `worker/` — Cloudflare Worker backend with routes and Durable Objects
- `shared/` — Shared TypeScript types and mock data
- `public/` — Static assets

## Deployment

This project is optimized for Cloudflare Workers deployment.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Spiderspun0/edgeconnect-gateway-secure-remote-desktop-access)

### Manual Deployment

1. Ensure you are logged in to Cloudflare:
   ```bash
   wrangler login
   ```

2. Deploy the application:
   ```bash
   bun run deploy
   ```

The deployment uses `wrangler.jsonc` configuration, which includes Durable Object bindings and migration settings.

## Environment Variables

No additional environment variables are required for basic functionality. For production secrets, use Wrangler secrets:

```bash
wrangler secret put MY_SECRET
```

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with clear descriptions of changes.

## License

This project is licensed under the MIT License.