# Testing Strategy

## Overview
We follow Test-Driven Development (TDD) with three levels of testing:
- **Unit Tests** - Domain logic (entities, value objects, services)
- **Integration Tests** - Domain interactions
- **E2E Tests** - Full user scenarios in real browsers

## Test-Driven Development (TDD)

### The Red-Green-Refactor Cycle

**1. RED - Write a failing test**
```typescript
// tests/unit/document/Node.spec.ts
import { describe, it, expect } from 'vitest'
import { Node } from '../../../src/document/entities/Node'

describe('Node', () => {
  it('should create a node with type and content', () => {
    const node = new Node('paragraph', { text: 'Hello' })
    
    expect(node.type).toBe('paragraph')
    expect(node.content).toEqual({ text: 'Hello' })
  })
})
```
Run test → ❌ Fails (Node doesn't exist yet)

**2. GREEN - Write minimal code to pass**
```typescript
// src/document/entities/Node.ts
export class Node {
  constructor(
    public type: string,
    public content: any
  ) {}
}
```
Run test → ✅ Passes

**3. REFACTOR - Improve code quality**
```typescript
// src/document/entities/Node.ts
export class Node {
  constructor(
    public readonly type: string,
    public readonly content: Record<string, any>
  ) {
    if (!type) throw new Error('Node type is required')
  }
}
```
Run test → ✅ Still passes, code is better

### TDD Rules
1. **Don't write production code** without a failing test
2. **Write only enough test** to fail (compilation failure counts)
3. **Write only enough production code** to pass the test
4. **Refactor** after green, never during red

### Why TDD?
- Ensures testability (design emerges from tests)
- Documentation through tests
- Confidence in refactoring
- Catches regressions early

---

## Unit Tests

### Scope
Test individual domain components in isolation:
- Entity behavior
- Value Object immutability
- Domain Service logic
- Pure functions

### Structure
```
tests/unit/
├── document/
│   ├── Node.spec.ts
│   ├── Document.spec.ts
│   ├── NodeType.spec.ts
│   ├── Mark.spec.ts
│   └── Schema.spec.ts
├── editor/
│   ├── Editor.spec.ts
│   ├── EditorState.spec.ts
│   ├── Transaction.spec.ts
│   └── History.spec.ts
├── extension/
│   ├── Extension.spec.ts
│   └── ExtensionRegistry.spec.ts
└── serialization/
    ├── HTMLSerializer.spec.ts
    └── MarkdownParser.spec.ts
```

### Example Unit Test

```typescript
// tests/unit/document/Schema.spec.ts
import { describe, it, expect } from 'vitest'
import { Schema } from '../../../src/document/services/Schema'
import { NodeType } from '../../../src/document/value-objects/NodeType'

describe('Schema', () => {
  describe('validation', () => {
    it('should allow valid node according to schema', () => {
      const paragraphType = new NodeType('paragraph', {
        content: 'text*'
      })
      const schema = new Schema({
        nodes: { paragraph: paragraphType }
      })
      
      const isValid = schema.validate({
        type: 'paragraph',
        content: [{ text: 'Hello' }]
      })
      
      expect(isValid).toBe(true)
    })
    
    it('should reject invalid node', () => {
      const paragraphType = new NodeType('paragraph', {
        content: 'text*'
      })
      const schema = new Schema({
        nodes: { paragraph: paragraphType }
      })
      
      expect(() => {
        schema.validate({
          type: 'image', // not in schema
          content: []
        })
      }).toThrow('Unknown node type: image')
    })
  })
})
```

### Unit Test Guidelines
- **One concept per test** - Each test should verify one behavior
- **Descriptive names** - Test name should describe what it tests
- **AAA Pattern** - Arrange, Act, Assert
- **No dependencies** - Mock external dependencies
- **Fast** - Should run in milliseconds

---

## Integration Tests

### Scope
Test how domains work together:
- Editor + Document
- Editor + Extensions
- Serialization round-trips
- Complex workflows

### Structure
```
tests/integration/
├── editor-with-document.spec.ts
├── editor-with-extensions.spec.ts
├── extension-registry-with-editor.spec.ts
├── serialization-roundtrip.spec.ts
└── transaction-flow.spec.ts
```

### Example Integration Test

```typescript
// tests/integration/editor-with-extensions.spec.ts
import { describe, it, expect } from 'vitest'
import { Editor } from '../../src/editor/entities/Editor'
import { BoldExtension } from '@helix/extension-bold'
import { ItalicExtension } from '@helix/extension-italic'

describe('Editor with Extensions', () => {
  it('should apply bold and italic together', () => {
    const editor = new Editor({
      extensions: [
        new BoldExtension(),
        new ItalicExtension()
      ]
    })
    
    // Insert text
    editor.commands.insertText('Hello')
    
    // Select all
    editor.commands.selectAll()
    
    // Apply bold
    editor.commands.toggleBold()
    
    // Apply italic
    editor.commands.toggleItalic()
    
    const html = editor.getHTML()
    expect(html).toBe('<p><strong><em>Hello</em></strong></p>')
  })
  
  it('should handle extension conflicts gracefully', () => {
    const editor = new Editor({
      extensions: [
        new BoldExtension({ keymap: { 'Mod-b': true }}),
        new BoldExtension({ keymap: { 'Mod-b': true }}) // duplicate
      ]
    })
    
    expect(() => editor.initialize()).toThrow('Duplicate extension')
  })
})
```

### Integration Test Guidelines
- **Real implementations** - Don't mock core domain logic
- **Realistic scenarios** - Test actual use cases
- **Multiple domains** - Verify cross-domain interactions
- **Still fast** - Should run in seconds, not minutes

---

## E2E Tests

### Scope
Test complete user scenarios in real browsers:
- Full editing workflows
- Extension functionality in UI
- Framework bindings (React, Vue)
- Performance under real conditions

### Structure
```
e2e/
├── tests/
│   ├── basic-editing.spec.ts
│   ├── extensions/
│   │   ├── bold.spec.ts
│   │   ├── italic.spec.ts
│   │   ├── link.spec.ts
│   │   └── image.spec.ts
│   ├── react-binding.spec.ts
│   ├── vue-binding.spec.ts
│   ├── copy-paste.spec.ts
│   └── collaborative.spec.ts
├── fixtures/
│   └── test-pages/
│       ├── basic-editor.html
│       ├── react-editor.html
│       └── vue-editor.html
└── playwright.config.ts
```

### Example E2E Test

```typescript
// e2e/tests/basic-editing.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Basic Editing', () => {
  test('should type text and apply bold', async ({ page }) => {
    await page.goto('http://localhost:3000/test-editor')
    
    // Type text
    const editor = page.locator('[data-testid="editor"]')
    await editor.click()
    await editor.type('Hello World')
    
    // Select "Hello"
    await page.keyboard.press('Shift+ArrowLeft', { count: 11 })
    await page.keyboard.press('Shift+ArrowRight', { count: 5 })
    
    // Apply bold
    await page.keyboard.press('Control+B')
    
    // Verify
    const html = await editor.innerHTML()
    expect(html).toContain('<strong>Hello</strong>')
  })
  
  test('should undo/redo', async ({ page }) => {
    await page.goto('http://localhost:3000/test-editor')
    
    const editor = page.locator('[data-testid="editor"]')
    await editor.click()
    await editor.type('Test')
    
    // Undo
    await page.keyboard.press('Control+Z')
    expect(await editor.textContent()).toBe('')
    
    // Redo
    await page.keyboard.press('Control+Shift+Z')
    expect(await editor.textContent()).toBe('Test')
  })
})
```

### E2E Test Guidelines
- **User perspective** - Test like a real user would
- **Real browsers** - Chrome, Firefox, Safari via Playwright
- **Slower is okay** - E2E tests are naturally slower
- **Fewer tests** - Cover critical paths, not every scenario
- **Stable selectors** - Use data-testid, not brittle CSS selectors

---

## Test Coverage Goals

### Per Package
- **Core**: 90%+ coverage (critical foundation)
- **Extensions**: 80%+ coverage
- **Framework Bindings**: 70%+ coverage (UI testing is harder)

### Per Test Level
- **Unit Tests**: Majority of tests (fast, thorough)
- **Integration Tests**: Critical workflows
- **E2E Tests**: Key user scenarios

### Coverage Pyramid
```
        /\
       /  \       E2E Tests (few, slow, expensive)
      /    \
     /------\     Integration Tests (some, medium)
    /--------\
   /----------\   Unit Tests (many, fast, cheap)
  /------------\
```

---

## Test Fixtures and Helpers

### Sample Data
```typescript
// tests/fixtures/sample-documents.ts
export const EMPTY_DOC = {
  type: 'doc',
  content: []
}

export const PARAGRAPH_DOC = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ text: 'Hello' }]
    }
  ]
}

export const COMPLEX_DOC = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ text: 'Title' }]
    },
    {
      type: 'paragraph',
      content: [
        { text: 'Some ' },
        { text: 'bold', marks: [{ type: 'bold' }] },
        { text: ' text' }
      ]
    }
  ]
}
```

### Test Helpers
```typescript
// tests/helpers/editor-helpers.ts
export function createTestEditor(options = {}) {
  return new Editor({
    content: EMPTY_DOC,
    ...options
  })
}

export function insertText(editor: Editor, text: string) {
  editor.commands.insertText(text)
  return editor
}
```

---

## Running Tests

### Vitest Commands
```bash
# Run all unit + integration tests
nx test core

# Watch mode (TDD)
nx test core --watch

# Coverage
nx test core --coverage

# Specific test file
nx test core --testPathPattern=Node.spec.ts
```

### Playwright Commands
```bash
# Run all e2e tests
nx e2e e2e

# Headed mode (see browser)
nx e2e e2e --headed

# Debug mode
nx e2e e2e --debug

# Specific browser
nx e2e e2e --project=firefox
```

### CI Commands
```bash
# Run all tests across all packages
nx run-many -t test

# Run only affected tests
nx affected -t test
```

---

## Test Configuration

### Vitest Config (packages/core/vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['tests/**', '**/*.spec.ts']
    }
  }
})
```

### Playwright Config (e2e/playwright.config.ts)
```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ]
})
```

---

## For Claude Code

### When implementing a new feature:
1. **Start with a test** (Red)
2. Write minimal implementation (Green)
3. Refactor if needed
4. Repeat for each behavior

### Test organization:
- One describe block per class/module
- Nested describe for method/feature groups
- Descriptive test names: "should [expected behavior] when [condition]"

### When to write each test type:
- **Unit**: Always, for every entity/VO/service
- **Integration**: For cross-domain workflows
- **E2E**: For critical user paths only

### Red flags:
- ❌ No test before implementation
- ❌ Tests that always pass (testing nothing)
- ❌ Skipped tests without reason
- ❌ Tests depending on each other
- ❌ Tests with complex setup (refactor fixtures)

### Best practices:
- ✅ Test behavior, not implementation
- ✅ One assertion per test (or closely related assertions)
- ✅ Use descriptive variable names in tests
- ✅ Keep tests readable (code comments okay in tests)
- ✅ Test edge cases and error conditions
