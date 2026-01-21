# Five Parsecs

An Nx monorepo with NestJS backend and React frontend.

## Structure

```
five-parsecs/
├── apps/
│   ├── api/          # NestJS backend application
│   └── frontend/     # React frontend application with Vite
├── libs/             # Shared libraries (to be added)
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

#### Start the API server:
```bash
npm run serve:api
# or
npm run dev:api
```
The API will be available at `http://localhost:3000`

#### Start the frontend:
```bash
npm run serve:frontend
# or
npm run dev:frontend
```
The frontend will be available at `http://localhost:4200`

### Build

Build all applications:
```bash
npm run build
```

Build a specific app:
```bash
nx build api
nx build frontend
```

### Testing

Run all tests:
```bash
npm run test
```

Run tests for a specific app:
```bash
nx test api
nx test frontend
```

### Linting

Run linters:
```bash
npm run lint
```

Run linter for a specific app:
```bash
nx lint api
nx lint frontend
```

## Technologies

- **Nx** - Monorepo tooling
- **NestJS** - Node.js backend framework
- **React** - Frontend framework
- **Vite** - Fast build tool for frontend
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Fast unit test framework
- **ESLint** - Code linting

## API Endpoints

- `GET /` - Hello message
- `GET /health` - Health check endpoint
