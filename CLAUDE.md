# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Failure Protocol

If you violate any rule:

1. STOP immediately
2. Explain what rule you violated
3. Do NOT continue
4. Wait for user instruction

## Critical Reading

Before doing anything, read these in order:

1. [`.claude/docs/architecture.md`](.claude/docs/architecture.md) — bounded contexts, folder structure, domain rules, dependency direction
2. [`.claude/docs/tech-stack.md`](.claude/docs/tech-stack.md) — exact packages, versions, build tooling, what is/isn't installed
3. [`.claude/docs/enforcements.md`](.claude/docs/enforcements.md) — TDD rules, testing strategy, forbidden patterns
4. [`.claude/docs/git-workflow.md`](.claude/docs/git-workflow.md) — branch strategy, commit convention
5. [`.claude/agents/tdd-session.md`](.claude/agents/tdd-session.md) — session roles, briefing format, research rules

## Commands

```bash
# Install
pnpm install

# Build
pnpm nx build document          # build specific package
pnpm nx run-many -t build       # build all packages
pnpm nx affected -t build       # build only affected

# Test
pnpm nx test document           # test specific package
pnpm nx test document --watch   # TDD watch mode
pnpm nx run-many -t test        # test all
pnpm nx affected -t test        # test affected

# Lint / Format
pnpm nx lint document
pnpm nx run-many -t lint
pnpm prettier --write .

# Type check
pnpm nx type-check document
pnpm nx run-many -t type-check

# E2E
pnpm nx e2e e2e
```


## Quick Reference

- Monorepo tool: Nx (pnpm workspace)
- Package scope: `@helix/*`
- Current active package: `packages/core/document`
- Domain pattern: `entities/` → `value-objects/` → `services/` → `contracts/`
- Testing: Vitest (unit + integration), Playwright (E2E)
- All value objects are immutable (`readonly`)
- No circular dependencies between packages
- Use `equals()` not `eq()` for value object comparison
- `Fragment.empty()` is a static method, not a property
- `Fragment.from(array)` — single signature, no polymorphism
- `Fragment.content` is private — use `toArray()` for external access
