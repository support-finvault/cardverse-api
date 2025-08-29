# Cardverse API

A scalable, production-ready NestJS API for Cardverse.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Testing](#testing)
- [Logging](#logging)
- [License](#license)

## Features

- RESTful API built with [NestJS](https://nestjs.com/)
- TypeScript-first development
- PM2 process management
- Docker support
- Winston-based logging with daily rotation
- Swagger API documentation
- Email templates and asset management
- Secure (Helmet, CORS, SSL support)
- Integration with AWS S3, PostgreSQL, Bull queues, and more

## Getting Started

### Prerequisites

- Node.js v20+
- npm v9+
- Docker (optional, for containerization)
- PostgreSQL (or your configured DB)

### Installation

```sh
git clone https://github.com/your-org/cardverse-api.git
cd cardverse-api
npm install
```

### Environment Setup

Copy `.env.devQA` or `.env` and configure as needed:

```sh
cp .env.devQA .env
```

## Development

Start the development server with hot-reload:

```sh
npm run start:dev
```

Or run directly:

```sh
npm start
```

## Build & Deployment

Build the project:

```sh
npm run build
```

Run the built app:

```sh
npm run start:prod
```

### Docker

Build and run with Docker:

```sh
docker build -t cardverse-api .
docker run -p 3000:3000 --env-file .env cardverse-api
```

Or use Docker Compose:

```sh
docker-compose up --build
```

## Environment Variables

See `.env` or `.env.devQA` for all configuration options, including:

- `APP_NAME`
- `LOG_PATH`
- `ENABLE_SSL`
- `URL_REFERERS`
- Database credentials, etc.

## Scripts

Common scripts from [`package.json`](package.json):

- `start` - Start the app (dev)
- `start:dev` - Start with hot reload
- `build` - Build TypeScript to `dist/`
- `deploy` - Run built app with NODE_PATH
- `test` - Run tests
- `lint` - Lint code
- `format` - Format code
- `startdevqa` / `startprodrelease` - Start with PM2 (see [`execute/`](execute/))
- `seed:run` - Run database seeders

## Testing

Run all tests:

```sh
npm test
```

Test coverage:

```sh
npm run test:cov
```

## Logging

Logging is handled by Winston with daily rotation. Logs are written to the file specified by `LOG_PATH` in your environment variables.

## License

MIT
