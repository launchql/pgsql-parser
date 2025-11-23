# Development Guide

This project is a pnpm/Lerna workspace for PostgreSQL parser and deparser functionality. Follow these steps to get started with development.

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm package manager

## Initial Setup

1. Install dependencies:
```bash
pnpm install
```

2. Build all packages:
```bash
pnpm build
```

## Running Tests

The project uses Jest for testing. Each package has its own test suite.

### Running Tests for a Specific Package

To run tests for a specific package, navigate to that package's directory and use the test:watch command:

```bash
cd packages/deparser
pnpm test:watch
```

you can also run `pnpm test` if you don't need to watch.

This will start Jest in watch mode, which will automatically re-run tests when files change.

### Available Packages

- `packages/deparser`: SQL deparser implementation
- `packages/parser`: SQL parser implementation
- `packages/types`: TypeScript type definitions
- `packages/utils`: Utility functions

## Project Structure

```
packages/
  ├── deparser/     # SQL deparser implementation
  ├── parser/       # SQL parser implementation
  ├── types/        # TypeScript type definitions
  └── utils/        # Utility functions
```

## Development Workflow

1. Make changes to the code
2. Run tests in watch mode for the affected package
3. Ensure all tests pass
4. Commit your changes

## Common Commands

- `pnpm build`: Build all packages
- `pnpm test`: Run all tests
- `pnpm test:watch`: Run tests in watch mode
- `pnpm lint`: Run linter
- `pnpm clean`: Clean build artifacts

## Notes

- The project uses Lerna for managing multiple packages in a monorepo
- Each package can be developed and tested independently
- Changes to shared packages (types, utils) may require rebuilding dependent packages 