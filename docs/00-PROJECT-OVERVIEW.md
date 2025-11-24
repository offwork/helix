# Helix - Project Overview

## Vision
A modern, modular, headless rich text editor built on ProseMirror with TypeScript. Framework-agnostic core with dedicated bindings for React, Vue, and vanilla JavaScript.

## Goals
- **Commercial Product**: Built for potential monetization
- **No External Dependencies**: Zero reliance on high-level libraries (using only ProseMirror as core engine)
- **Modular Architecture**: Extension-based system for maximum flexibility
- **Type-Safe**: Full TypeScript with strict mode
- **Production-Ready**: Enterprise-grade quality, performance, and reliability

## Project Scope
This is a **long-term commercial project** starting from scratch. We're building:
1. A headless editor core
2. A comprehensive extension system
3. Framework bindings (React, Vue, vanilla)
4. Professional documentation
5. CI/CD pipeline
6. Test coverage (unit, integration, e2e)

## Business Model

Helix follows an **open-core** model, inspired by TipTap's successful approach:

### Phase 1 (v0.1 - v1.0): Fully Open Source
**Everything is MIT licensed and free:**
- Core editor (`@helix/core`)
- Basic extensions (bold, italic, link, image, heading, etc.)
- Framework bindings (`@helix/react`, `@helix/vue`, `@helix/vanilla`)
- Self-hosted collaboration backend

**Goal:** Build community, gain adoption, establish trust

### Phase 2 (v1.0+): Premium Features
**Free (MIT) - Always:**
- Core editor
- Basic formatting extensions
- Framework bindings
- Self-hosted option for everything

**Premium (Commercial License):**
- AI-powered extensions (`@helix/extension-ai`)
- Advanced collaboration (`@helix/extension-collaboration`)
- Comments & suggestions (`@helix/extension-comments`)
- Analytics & insights (`@helix/extension-analytics`)
- Version history
- Advanced security features

**Helix Cloud (SaaS):**
- Managed hosting
- Real-time sync infrastructure
- Automatic scaling
- CDN for assets
- Usage analytics

### Why This Model?
- **Sustainable**: Funds continued development
- **Fair**: Free for most use cases
- **Flexible**: Choose self-hosted or cloud
- **Transparent**: Clear what's free vs paid

### Pricing Philosophy (TBD, v1.0+)
Inspired by TipTap's document-based model:
- **Free Tier**: Unlimited for self-hosted
- **Starter**: ~$49-99/month for cloud-hosted features
- **Business**: ~$499-999/month for teams
- **Enterprise**: Custom pricing with SLA

*Note: Only documents/features using Helix Cloud count toward limits. Self-hosted deployments remain free forever.*

## Development Approach
- **Domain-Driven Design (DDD)**: Clear bounded contexts and domain models
- **Test-Driven Development (TDD)**: Red-Green-Refactor cycle
- **Monorepo**: Nx-powered workspace for multiple packages
- **Agile**: GitHub Projects with Kanban board

## Timeline Expectations
This is a substantial project. First stable release (v1.0.0) may take several months. We're optimizing for quality over speed.

## Documentation Structure
This documentation is organized as follows:
- `00-PROJECT-OVERVIEW.md` - This file (vision and goals)
- `01-TECH-STACK.md` - Technology decisions
- `02-ARCHITECTURE.md` - DDD domain model and system design
- `03-MONOREPO-STRUCTURE.md` - Package organization
- `04-TESTING-STRATEGY.md` - Test levels and TDD approach
- `05-CI-CD.md` - Continuous Integration and Deployment
- `06-GITHUB-WORKFLOW.md` - Agile process and issue management
- `07-DEVELOPMENT-GUIDE.md` - How to work on this project
- `08-TODO-FUTURE.md` - Deferred decisions and future considerations

## For Claude Code
When working on this project:
1. **Always read these docs first** before making architectural decisions
2. **Follow DDD principles** - respect bounded contexts
3. **Write tests first** (TDD) - no implementation without tests
4. **Stay modular** - keep packages independent
5. **Ask before deviating** from established patterns
