# Tech Stack

## Core Technologies

### Language
**TypeScript** (strict mode)
- Type safety across entire codebase
- Better IDE support and refactoring
- Production-ready error catching at compile time

### Package Manager
**pnpm**
- Efficient disk usage (content-addressable storage)
- Fast installations
- Excellent monorepo support
- Strict dependency management

**Why not Bun?**
While Bun offers superior speed, pnpm provides better maturity, stability, and enterprise-proven monorepo support for our commercial product needs.

### Monorepo Tool
**Nx**
- Complete monorepo solution (not just task runner)
- Smart caching and task orchestration
- Official Vue support (@nx/vue)
- Code generation and project scaffolding
- Dependency graph visualization
- Remote caching via Nx Cloud
- Vite 7, Rspack/Rsbuild support
- Built-in AI configuration for tools like Cursor/Copilot

**Why not Turborepo?**
Nx provides more than just speed - it offers architectural guidance, generators, and comprehensive tooling for long-term maintainability.

### Build Tool
**@nx/rollup**
- Optimized for library builds
- ESM + CJS dual output support
- TypeScript declaration files (.d.ts)
- Tree-shakeable output
- Source maps

**Why Rollup over esbuild/tsup?**
Better suited for library publishing with first-class Nx integration and mature ecosystem.

### Testing Framework
**Vitest**
- Fast, Vite-powered test runner
- Jest-compatible API
- TypeScript support out of the box
- Watch mode for TDD

**E2E Testing**
**Playwright**
- Cross-browser testing
- Reliable and fast
- Better than Cypress for our use case

### Code Quality
**ESLint** - Linting
**Prettier** - Code formatting
**TypeScript Compiler (tsc)** - Type checking

## Core Engine
**ProseMirror** (MIT Licensed)
- Battle-tested (used by NYT, Guardian)
- Low-level API for maximum control
- Immutable state management
- Transaction-based updates
- Schema-driven document model
- Commercial-friendly license

**Why ProseMirror over others?**
- We need low-level control for our custom modular architecture
- TipTap is too high-level (we're building our own abstraction)
- Slate is React-specific
- Draft.js is deprecated

## Framework Support

### React Binding
- React 18+
- Hooks-based API
- TypeScript support

### Vue Binding
- Vue 3+
- Composition API
- TypeScript support
- Official Nx support via @nx/vue

### Vanilla JavaScript
- Pure DOM API
- No framework dependencies
- TypeScript declarations

## Development Tools

### IDE
- VS Code (recommended)
- JetBrains IDEs (IntelliJ, WebStorm)
- Nx Console extension for visual project management

### Version Control
- Git
- GitHub (repository + CI/CD + Projects)

### CI/CD
- GitHub Actions
- Nx Cloud (remote caching)

## Package Publishing
- npm registry
- Scoped packages (@helix/*)
- Semantic versioning
- Automated via Nx Release

## Browser Support
Modern browsers with ES2020 support:
- Chrome/Edge 88+
- Firefox 89+
- Safari 14.1+

**Note:** No IE11 support. This is a modern project.

## Node.js Version
- Node.js: Check [Nx Node.js compatibility matrix](https://nx.dev/reference/core-api/workspace/documents/nx-nodejs-typescript-version-matrix) for supported versions
- pnpm: Latest stable version

## Performance Considerations
- Tree-shakeable exports
- Code splitting support
- Lazy loading for extensions
- Bundle size monitoring

## Technology Decisions - Summary Table

| Category | Choice | Alternative Considered |
|----------|--------|----------------------|
| Language | TypeScript | - |
| Package Manager | pnpm | Bun |
| Monorepo | Nx | Turborepo |
| Build | @nx/rollup | esbuild, tsup |
| Testing | Vitest | Jest |
| E2E | Playwright | Cypress |
| Core Engine | ProseMirror | Slate, Draft.js |
| Linting | ESLint + Prettier | - |

## Notes for Claude Code
- All packages must be built with @nx/rollup
- Always use pnpm commands (not npm/yarn)
- TypeScript strict mode is non-negotiable
- Keep bundle size in mind when adding dependencies
