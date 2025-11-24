# Helix - Architecture & Planning Documentation

This documentation package contains complete architecture, technical decisions, and development guidelines for building a modern, modular rich text editor.

## 📋 Documentation Files

### Core Documentation
1. **[00-PROJECT-OVERVIEW.md](./docs/00-PROJECT-OVERVIEW.md)** - Vision, goals, and project scope
2. **[01-TECH-STACK.md](./docs/01-TECH-STACK.md)** - All technology decisions with rationale
3. **[02-ARCHITECTURE.md](./docs/02-ARCHITECTURE.md)** - Domain-Driven Design model and system architecture
4. **[03-MONOREPO-STRUCTURE.md](./docs/03-MONOREPO-STRUCTURE.md)** - Package organization and structure

### Development Process
5. **[04-TESTING-STRATEGY.md](./docs/04-TESTING-STRATEGY.md)** - TDD approach and test levels
6. **[05-CI-CD.md](./docs/05-CI-CD.md)** - Continuous Integration and Deployment pipelines
7. **[06-GITHUB-WORKFLOW.md](./docs/06-GITHUB-WORKFLOW.md)** - Agile process and issue management
8. **[07-DEVELOPMENT-GUIDE.md](./docs/07-DEVELOPMENT-GUIDE.md)** - Day-to-day development practices

### Future Planning
9. **[08-TODO-FUTURE.md](./docs/08-TODO-FUTURE.md)** - Deferred decisions and future features

## 🎯 Quick Start for Claude Code

### Before Coding
1. Read **00-PROJECT-OVERVIEW.md** for vision
2. Review **02-ARCHITECTURE.md** for domain model
3. Check **07-DEVELOPMENT-GUIDE.md** for workflow

### Key Principles
- ✅ **Domain-Driven Design** - Respect bounded contexts
- ✅ **Test-Driven Development** - Write tests first
- ✅ **Monorepo Structure** - Keep packages independent
- ✅ **Type Safety** - TypeScript strict mode
- ✅ **Documentation** - Code is self-documenting

### Tech Stack Summary
- **Language**: TypeScript (strict)
- **Package Manager**: pnpm
- **Monorepo**: Nx
- **Build**: @nx/rollup
- **Testing**: Vitest + Playwright
- **Core Engine**: ProseMirror

## 📐 Architecture Overview

### 4 Bounded Contexts
1. **Document Domain** - Content structure and validation
2. **Editor Domain** - Editor engine and state
3. **Extension Domain** - Plugin system
4. **Serialization Domain** - Format conversion

### Package Structure
```
packages/
├── core/              # @helix/core
├── extensions/        # @helix/extension-*
│   ├── bold/
│   ├── italic/
│   └── ...
├── react/            # @helix/react
├── vue/              # @helix/vue
└── vanilla/          # @helix/vanilla
```

## 🧪 Development Workflow

### TDD Cycle
1. **RED** - Write failing test
2. **GREEN** - Minimal implementation
3. **REFACTOR** - Improve code

### GitHub Workflow
1. Pick issue from "Ready" column
2. Create feature branch
3. Follow TDD process
4. Create Pull Request
5. Code review
6. Merge to develop

## 📝 How to Use This Documentation

### For Project Setup
→ Read 00-03 (Overview, Tech Stack, Architecture, Structure)

### For Development
→ Read 04-07 (Testing, CI/CD, GitHub Workflow, Development Guide)

### For Planning
→ Read 08 (TODO & Future)

## 🔄 Keeping Documentation Updated

This documentation is a living guide:
- Update when making architectural decisions
- Document new patterns as they emerge
- Add to TODO when deferring decisions
- Review quarterly for accuracy

## 🎓 Learning Resources

### Domain-Driven Design
- "Domain-Driven Design" by Eric Evans
- "Implementing Domain-Driven Design" by Vaughn Vernon

### Test-Driven Development
- "Test Driven Development: By Example" by Kent Beck
- "Growing Object-Oriented Software, Guided by Tests" by Freeman & Pryce

### ProseMirror
- [ProseMirror Guide](https://prosemirror.net/docs/guide/)
- [ProseMirror Examples](https://prosemirror.net/examples/)

### Monorepos
- [Nx Documentation](https://nx.dev/)
- [Monorepo.tools](https://monorepo.tools/)

## 🤝 Contributing

When adding to this documentation:
1. Keep it concise and actionable
2. Provide examples where helpful
3. Explain *why*, not just *what*
4. Update the README if adding new files

## 📄 License

Helix follows an **open-core model**:

### Open Source (MIT License)
The following packages are freely available under MIT License:
- Core packages (`@helix/core`)
- Basic extensions (`@helix/extension-bold`, `@helix/extension-italic`, etc.)
- Framework bindings (`@helix/react`, `@helix/vue`, `@helix/vanilla`)
- Self-hosted collaboration backend

### Commercial License (v1.0+)
Premium extensions and cloud services require a commercial license:
- AI extensions (`@helix/extension-ai`)
- Advanced collaboration features
- Helix Cloud (managed hosting)

See individual package `LICENSE` files for specific terms.

**For v0.1 - v1.0:** Everything is MIT licensed and free.

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Maintained By**: Project Team

For questions or clarifications, please create a GitHub issue.
