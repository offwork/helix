# Development Guide

## Getting Started

### Prerequisites
- Node.js LTS version (check [Nx compatibility matrix](https://nx.dev/reference/core-api/workspace/documents/nx-nodejs-typescript-version-matrix))
- pnpm (latest stable)
- Git
- VS Code or JetBrains IDE (recommended)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/your-org/helix.git
cd helix

# Install dependencies
pnpm install

# Connect to Nx Cloud (optional but recommended)
pnpm nx connect-to-nx-cloud

# Run tests to verify setup
pnpm nx run-many -t test
```

### IDE Setup

#### VS Code
Install recommended extensions:
- Nx Console
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

#### Settings (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Development Workflow

### 1. Pick an Issue
- Check GitHub Projects "Ready" column
- Pick highest priority issue
- Assign to yourself
- Move to "In Progress"

### 2. Create Feature Branch
```bash
# From develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/issue-123-node-entity
```

Branch naming:
- `feature/issue-123-description` - New feature
- `fix/issue-456-bug-description` - Bug fix
- `refactor/improve-schema` - Refactoring
- `docs/update-readme` - Documentation

### 3. Follow TDD Process

#### RED Phase - Write Failing Test
```typescript
// tests/unit/document/Node.spec.ts
import { describe, it, expect } from 'vitest'
import { Node } from '../../../src/document/entities/Node'

describe('Node', () => {
  it('should create node with type and content', () => {
    const node = new Node('paragraph', { text: 'Hello' })
    
    expect(node.type).toBe('paragraph')
    expect(node.content).toEqual({ text: 'Hello' })
  })
})
```

Run test:
```bash
pnpm nx test core --testPathPattern=Node.spec.ts --watch
```

Result: ❌ Test fails (Node doesn't exist)

#### GREEN Phase - Minimal Implementation
```typescript
// src/document/entities/Node.ts
export class Node {
  constructor(
    public readonly type: string,
    public readonly content: Record<string, any>
  ) {}
}
```

Run test again:
Result: ✅ Test passes

#### REFACTOR Phase - Improve Code
```typescript
// src/document/entities/Node.ts
export class Node {
  constructor(
    public readonly type: string,
    public readonly content: Record<string, any>
  ) {
    if (!type) {
      throw new Error('Node type is required')
    }
    if (!content) {
      throw new Error('Node content is required')
    }
  }
}
```

Add test for validation:
```typescript
it('should throw error for missing type', () => {
  expect(() => new Node('', {})).toThrow('Node type is required')
})
```

Run tests:
Result: ✅ All tests pass

### 4. Commit Changes
```bash
# Stage files
git add .

# Commit with conventional message
git commit -m "feat(document): implement Node entity (#123)

- Add Node class with type and content validation
- Implement tests following TDD approach
- 100% test coverage

Part of #123"
```

Commit often! Small, focused commits are better.

### 5. Push and Create PR
```bash
# Push branch
git push origin feature/issue-123-node-entity

# Create PR via GitHub UI
# Title: "feat(document): implement Node entity"
# Description: Use PR template, link to issue
```

### 6. Address Review Feedback
```bash
# Make changes
git add .
git commit -m "refactor: improve Node validation logic"
git push origin feature/issue-123-node-entity

# PR updates automatically
```

### 7. Merge
- Squash and merge via GitHub
- Delete branch

---

## Common Tasks

### Running Tests
```bash
# Run all tests in a package
pnpm nx test core

# Watch mode (TDD)
pnpm nx test core --watch

# Specific test file
pnpm nx test core --testPathPattern=Node.spec.ts

# With coverage
pnpm nx test core --coverage

# All packages
pnpm nx run-many -t test

# Only affected by changes
pnpm nx affected -t test
```

### Building
```bash
# Build a package
pnpm nx build core

# Build all
pnpm nx run-many -t build

# Build affected
pnpm nx affected -t build
```

### Linting and Formatting
```bash
# Lint a package
pnpm nx lint core

# Lint all
pnpm nx run-many -t lint

# Auto-fix
pnpm nx lint core --fix

# Format all files
pnpm prettier --write .

# Check formatting
pnpm prettier --check .
```

### Type Checking
```bash
# Type check a package
pnpm nx type-check core

# Type check all
pnpm nx run-many -t type-check
```

### Creating New Package
```bash
# Create library package
pnpm nx g @nx/js:library my-package --directory=packages/my-package

# Create extension
pnpm nx g @nx/js:library extension-bold --directory=packages/extensions/bold
```

### Running E2E Tests
```bash
# Run all e2e tests
pnpm nx e2e e2e

# Headed mode (see browser)
pnpm nx e2e e2e --headed

# Debug mode
pnpm nx e2e e2e --debug

# Specific test
pnpm nx e2e e2e --grep="bold extension"
```

---

## Project Structure Patterns

### Domain Folder Structure
```
src/domain/
├── entities/        # Entities (identity, lifecycle)
├── value-objects/   # Value Objects (immutable, no identity)
├── services/        # Domain Services
└── index.ts        # Public API
```

### Test Structure
```
tests/
├── unit/           # Test entities, VOs, services in isolation
├── integration/    # Test domain interactions
└── fixtures/       # Shared test data
```

### File Naming
- **Source files**: PascalCase for classes, camelCase for functions
  - `Node.ts` (class)
  - `createNode.ts` (function)
- **Test files**: Match source file + `.spec.ts`
  - `Node.spec.ts`
  - `createNode.spec.ts`
- **Index files**: Export public API
  - `index.ts`

---

## Code Style Guidelines

### TypeScript
```typescript
// ✅ DO: Use explicit types for public API
export class Node {
  constructor(
    public readonly type: string,
    public readonly content: Record<string, any>
  ) {}
}

// ❌ DON'T: Rely on implicit types for public API
export class Node {
  constructor(public type, public content) {}
}

// ✅ DO: Use readonly for immutability
public readonly type: string

// ❌ DON'T: Allow mutations
public type: string

// ✅ DO: Use interfaces for shapes
interface NodeContent {
  text?: string
  marks?: Mark[]
}

// ❌ DON'T: Use any
content: any
```

### Naming Conventions
```typescript
// Classes: PascalCase
class Node {}
class ExtensionRegistry {}

// Interfaces: PascalCase with "I" prefix (optional)
interface INodeType {}
// or without prefix
interface NodeType {}

// Functions: camelCase
function createNode() {}
function validateSchema() {}

// Constants: UPPER_SNAKE_CASE
const MAX_DEPTH = 10
const DEFAULT_CONFIG = {}

// Private methods: _camelCase (optional)
private _validateInternal() {}
```

### Error Handling
```typescript
// ✅ DO: Use custom error classes
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

throw new ValidationError('Invalid node type')

// ❌ DON'T: Throw plain strings
throw 'Invalid node type'

// ✅ DO: Validate early
constructor(type: string) {
  if (!type) {
    throw new ValidationError('Type is required')
  }
  this.type = type
}

// ❌ DON'T: Allow invalid state
constructor(type: string) {
  this.type = type // Could be undefined!
}
```

### Comments
```typescript
// ✅ DO: Comment why, not what
// Normalize content to prevent XSS attacks
const sanitized = sanitize(content)

// ❌ DON'T: Comment obvious things
// Set type to the provided type
this.type = type

// ✅ DO: Use JSDoc for public API
/**
 * Creates a new node instance
 * @param type - The node type (e.g., 'paragraph', 'heading')
 * @param content - The node content
 * @throws {ValidationError} If type or content is invalid
 */
constructor(type: string, content: NodeContent) {}
```

---

## Testing Best Practices

### Test Structure (AAA Pattern)
```typescript
it('should create node with valid type', () => {
  // Arrange - Set up test data
  const type = 'paragraph'
  const content = { text: 'Hello' }
  
  // Act - Execute the behavior
  const node = new Node(type, content)
  
  // Assert - Verify the result
  expect(node.type).toBe(type)
  expect(node.content).toEqual(content)
})
```

### Test Naming
```typescript
// ✅ DO: Descriptive test names
it('should throw ValidationError for empty type', () => {})
it('should allow nested nodes up to max depth', () => {})

// ❌ DON'T: Vague test names
it('works', () => {})
it('test node', () => {})
```

### One Assertion Per Test (guideline, not rule)
```typescript
// ✅ BETTER: Focused test
it('should set node type correctly', () => {
  const node = new Node('paragraph', {})
  expect(node.type).toBe('paragraph')
})

it('should set node content correctly', () => {
  const content = { text: 'Hello' }
  const node = new Node('paragraph', content)
  expect(node.content).toEqual(content)
})

// ⚠️ ACCEPTABLE: Related assertions
it('should create node with type and content', () => {
  const node = new Node('paragraph', { text: 'Hello' })
  expect(node.type).toBe('paragraph')
  expect(node.content).toEqual({ text: 'Hello' })
})

// ❌ AVOID: Unrelated assertions
it('should handle node creation and validation', () => {
  // Too much in one test
})
```

### Use Fixtures
```typescript
// tests/fixtures/sample-documents.ts
export const PARAGRAPH_NODE = {
  type: 'paragraph',
  content: [{ text: 'Hello' }]
}

// tests/unit/document/Node.spec.ts
import { PARAGRAPH_NODE } from '../../fixtures/sample-documents'

it('should create paragraph node', () => {
  const node = new Node(
    PARAGRAPH_NODE.type,
    PARAGRAPH_NODE.content
  )
  expect(node.type).toBe('paragraph')
})
```

---

## Debugging

### VS Code Debugging
`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Current Test",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": [
        "nx",
        "test",
        "core",
        "--testPathPattern=${fileBasename}",
        "--watch=false"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug Specific Test
```typescript
// Add debugger statement
it('should validate node', () => {
  debugger  // Execution will pause here
  const node = new Node('paragraph', {})
})
```

### Logging
```typescript
// ✅ DO: Use console for debugging (remove before commit)
console.log('Node created:', node)

// ✅ DO: Use structured logging in production code
this.logger.debug('Creating node', { type, content })

// ❌ DON'T: Leave console.log in production code
```

---

## Performance Considerations

### Bundle Size
```bash
# Check bundle size
pnpm nx build core

# Analyze bundle
pnpm nx build core --analyze
```

Keep bundles small:
- Tree-shakeable exports
- Avoid heavy dependencies
- Lazy load extensions

### Memory Management
```typescript
// ✅ DO: Clean up listeners
class Editor {
  destroy() {
    this.listeners.forEach(listener => listener.dispose())
  }
}

// ❌ DON'T: Leave listeners hanging
class Editor {
  // No cleanup method
}
```

---

## Troubleshooting

### Common Issues

**"Module not found"**
```bash
# Clear Nx cache
pnpm nx reset

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

**"Type errors in test files"**
```bash
# Ensure test tsconfig extends base
# Check tsconfig.spec.json
```

**"Tests failing randomly"**
- Check for race conditions
- Ensure tests are isolated
- Don't rely on test execution order

**"Nx affected not working"**
```bash
# Ensure git history
git fetch origin main

# Use explicit base
pnpm nx affected -t test --base=origin/main
```

---

## Getting Help

### Documentation
- Read architecture docs first
- Check existing code for patterns
- Review test examples

### Code Review
- Ask questions in PR comments
- Tag specific reviewers
- Be open to feedback

### Communication
- GitHub Issues for bugs/features
- PR comments for code questions
- Discussions for general questions

---

## For Claude Code

### Before coding:
1. ✅ Read relevant architecture docs
2. ✅ Understand the domain
3. ✅ Check existing patterns
4. ✅ Write test first (TDD)

### While coding:
1. ✅ Follow style guide
2. ✅ Keep commits small
3. ✅ Run tests frequently
4. ✅ Stay in TDD cycle

### Before PR:
1. ✅ All tests passing
2. ✅ No lint errors
3. ✅ Code reviewed yourself
4. ✅ Commit messages clean

### Code review:
1. ✅ Be respectful
2. ✅ Explain reasoning
3. ✅ Ask questions
4. ✅ Learn from feedback

Remember: Quality over speed. TDD ensures quality.
