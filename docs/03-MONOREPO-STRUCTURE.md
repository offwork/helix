# Monorepo Structure

## Overview
This is an Nx-powered monorepo containing multiple related packages. Each package is independently publishable to npm.

## Directory Structure

```
root/
├── .github/
│   └── workflows/           # CI/CD pipelines
├── docs/                    # Project documentation (architecture, guides)
├── packages/
│   ├── core/               # @helix/core
│   ├── extensions/
│   │   ├── bold/           # @helix/extension-bold (MIT)
│   │   ├── italic/         # @helix/extension-italic (MIT)
│   │   ├── link/           # @helix/extension-link (MIT)
│   │   ├── image/          # @helix/extension-image (MIT)
│   │   ├── heading/        # @helix/extension-heading (MIT)
│   │   ├── premium/        # Premium extensions (v1.0+, Commercial)
│   │   │   ├── ai/
│   │   │   ├── collaboration/
│   │   │   ├── comments/
│   │   │   └── analytics/
│   │   └── ...
│   ├── react/              # @helix/react
│   ├── vue/                # @helix/vue
│   ├── vanilla/            # @helix/vanilla
│   └── shared/             # @helix/shared (internal)
├── e2e/                    # E2E tests (Playwright)
├── nx.json                 # Nx configuration
├── package.json            # Root package.json
├── pnpm-workspace.yaml     # pnpm workspace config
├── tsconfig.base.json      # Base TypeScript config
└── .eslintrc.json         # ESLint config
```

---

## Core Package Structure

### @helix/core

The foundation package containing all domain logic.

```
packages/core/
├── src/
│   ├── document/              # Document Domain
│   │   ├── entities/
│   │   │   ├── Node.ts
│   │   │   ├── Fragment.ts
│   │   │   └── Document.ts
│   │   ├── value-objects/
│   │   │   ├── NodeType.ts
│   │   │   ├── Mark.ts
│   │   │   ├── MarkType.ts
│   │   │   ├── Attrs.ts
│   │   │   └── Content.ts
│   │   ├── services/
│   │   │   └── Schema.ts
│   │   └── index.ts
│   ├── editor/               # Editor Domain
│   │   ├── entities/
│   │   │   ├── Editor.ts
│   │   │   ├── History.ts
│   │   │   └── View.ts
│   │   ├── value-objects/
│   │   │   ├── EditorState.ts
│   │   │   ├── Transaction.ts
│   │   │   └── Selection.ts
│   │   ├── services/
│   │   │   └── TransactionHandler.ts
│   │   └── index.ts
│   ├── extension/            # Extension Domain
│   │   ├── entities/
│   │   │   ├── Extension.ts
│   │   │   └── Plugin.ts
│   │   ├── value-objects/
│   │   │   ├── ExtensionSpec.ts
│   │   │   └── PluginKey.ts
│   │   ├── services/
│   │   │   └── ExtensionRegistry.ts
│   │   └── index.ts
│   ├── serialization/        # Serialization Domain
│   │   ├── services/
│   │   │   ├── HTMLSerializer.ts
│   │   │   ├── HTMLParser.ts
│   │   │   ├── MarkdownSerializer.ts
│   │   │   ├── MarkdownParser.ts
│   │   │   ├── JSONSerializer.ts
│   │   │   └── JSONParser.ts
│   │   ├── value-objects/
│   │   │   ├── SerializerConfig.ts
│   │   │   └── ParserConfig.ts
│   │   └── index.ts
│   └── index.ts              # Main exports
├── tests/
│   ├── unit/
│   │   ├── document/
│   │   │   ├── Node.spec.ts
│   │   │   ├── Document.spec.ts
│   │   │   └── Schema.spec.ts
│   │   ├── editor/
│   │   │   ├── Editor.spec.ts
│   │   │   ├── EditorState.spec.ts
│   │   │   └── Transaction.spec.ts
│   │   ├── extension/
│   │   │   ├── Extension.spec.ts
│   │   │   └── ExtensionRegistry.spec.ts
│   │   └── serialization/
│   │       ├── HTMLSerializer.spec.ts
│   │       └── MarkdownParser.spec.ts
│   ├── integration/
│   │   ├── editor-with-document.spec.ts
│   │   ├── editor-with-extensions.spec.ts
│   │   └── serialization-roundtrip.spec.ts
│   └── fixtures/
│       ├── sample-documents.ts
│       └── sample-schemas.ts
├── package.json
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.spec.json
├── vite.config.ts            # Vitest config
├── project.json              # Nx project config
└── README.md
```

**Exports:**
```typescript
// Clean public API
export { Editor, EditorState, Transaction } from './editor'
export { Node, Document, Schema } from './document'
export { Extension, ExtensionRegistry } from './extension'
export { HTMLSerializer, HTMLParser } from './serialization'
```

---

## Extension Packages

Each extension is a separate package following this structure:

### @helix/extension-bold

```
packages/extensions/bold/
├── src/
│   ├── BoldExtension.ts      # Main extension class
│   ├── BoldMark.ts           # Mark type definition
│   ├── commands.ts           # Bold toggle command
│   ├── inputRules.ts         # ** → bold
│   ├── keymap.ts             # Ctrl+B binding
│   └── index.ts
├── tests/
│   ├── BoldExtension.spec.ts
│   ├── commands.spec.ts
│   └── integration.spec.ts
├── package.json
├── tsconfig.json
├── project.json
└── README.md
```

**Usage:**
```typescript
import { Editor } from '@helix/core'
import { BoldExtension } from '@helix/extension-bold'

const editor = new Editor({
  extensions: [new BoldExtension()]
})
```

### Common Extensions Structure
All extensions follow similar pattern:
- `XExtension.ts` - Main extension class
- `commands.ts` - Editor commands
- `inputRules.ts` - Auto-formatting rules
- `keymap.ts` - Keyboard shortcuts
- Full test coverage

---

## Framework Binding Packages

### @helix/react

```
packages/react/
├── src/
│   ├── hooks/
│   │   ├── useEditor.ts      # Main hook
│   │   ├── useEditorState.ts
│   │   └── useExtension.ts
│   ├── components/
│   │   ├── EditorContent.tsx # Main component
│   │   └── EditorProvider.tsx
│   ├── context/
│   │   └── EditorContext.ts
│   └── index.ts
├── tests/
│   ├── useEditor.spec.tsx
│   └── EditorContent.spec.tsx
├── package.json
└── README.md
```

**Usage:**
```typescript
import { useEditor, EditorContent } from '@helix/react'
import { BoldExtension } from '@helix/extension-bold'

function MyEditor() {
  const editor = useEditor({
    extensions: [new BoldExtension()]
  })
  
  return <EditorContent editor={editor} />
}
```

### @helix/vue

Similar structure adapted for Vue 3 Composition API:
- `composables/` instead of `hooks/`
- `.vue` components
- Vue-specific patterns

### @helix/vanilla

Pure DOM API with no framework:
- `createEditor()` function
- Manual DOM mounting
- Event-based API

---

## Shared Package

### @helix/shared

Internal utilities shared across packages (not published publicly).

```
packages/shared/
├── src/
│   ├── types/              # Common TypeScript types
│   ├── utils/              # Utility functions
│   ├── constants/          # Shared constants
│   └── index.ts
└── package.json
```

---

## E2E Tests

```
e2e/
├── tests/
│   ├── basic-editing.spec.ts
│   ├── extensions/
│   │   ├── bold.spec.ts
│   │   ├── image.spec.ts
│   │   └── link.spec.ts
│   ├── react-binding.spec.ts
│   ├── vue-binding.spec.ts
│   └── collaborative.spec.ts
├── fixtures/
│   └── test-pages/
├── playwright.config.ts
└── package.json
```

---

## Package Dependencies

### Dependency Graph

```
@helix/core (no dependencies)
    ↑
    ├── @helix/extension-bold
    ├── @helix/extension-italic
    ├── @helix/extension-link
    ├── @helix/extension-image
    ├── ...
    ↑
    ├── @helix/react
    ├── @helix/vue
    └── @helix/vanilla
```

**Rules:**
- Core has no dependencies on extensions or bindings
- Extensions only depend on core
- Framework bindings depend on core (and optionally extensions)
- Shared can be used by anyone (internal only)

---

## Nx Configuration

### nx.json
```json
{
  "extends": "nx/presets/npm.json",
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-cloud",
      "options": {
        "cacheableOperations": ["build", "test", "lint"]
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test": {
      "cache": true
    }
  }
}
```

### project.json (example for core)
```json
{
  "name": "core",
  "sourceRoot": "packages/core/src",
  "projectType": "library",
  "targets": {
    "build": {
      "executor": "@nx/rollup:rollup",
      "options": {
        "outputPath": "dist/packages/core",
        "tsConfig": "packages/core/tsconfig.lib.json",
        "main": "packages/core/src/index.ts",
        "format": ["esm", "cjs"],
        "generateExportsField": true
      }
    },
    "test": {
      "executor": "@nx/vite:test",
      "options": {
        "config": "packages/core/vite.config.ts"
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint"
    }
  }
}
```

---

## Package.json Structure

### Root package.json
```json
{
  "name": "helix",
  "private": true,
  "workspaces": ["packages/*", "e2e"],
  "scripts": {
    "build": "nx run-many -t build",
    "test": "nx run-many -t test",
    "lint": "nx run-many -t lint",
    "e2e": "nx e2e e2e"
  },
  "devDependencies": {
    "nx": "latest",
    "@nx/rollup": "latest",
    "@nx/vite": "latest",
    "@nx/vue": "latest",
    "typescript": "^5.3.0",
    "vitest": "latest",
    "playwright": "latest",
    "eslint": "latest",
    "prettier": "latest"
  }
}
```

### Package package.json (example: core)
```json
{
  "name": "@helix/core",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "peerDependencies": {
    "prosemirror-model": "^1.19.0",
    "prosemirror-state": "^1.4.0",
    "prosemirror-view": "^1.32.0"
  }
}
```

---

## TypeScript Configuration

### tsconfig.base.json
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "paths": {
      "@helix/core": ["packages/core/src/index.ts"],
      "@helix/extension-*": ["packages/extensions/*/src/index.ts"],
      "@helix/react": ["packages/react/src/index.ts"],
      "@helix/vue": ["packages/vue/src/index.ts"],
      "@helix/shared": ["packages/shared/src/index.ts"]
    }
  }
}
```

---

## For Claude Code

### When creating a new package:
1. Use Nx generator: `nx g @nx/js:library my-package`
2. Follow domain folder structure (entities, value-objects, services)
3. Create corresponding test folders
4. Update package.json with proper exports
5. Add to dependency graph documentation

### When adding a new extension:
1. Create in `packages/extensions/`
2. Depend only on `@helix/core`
3. Follow extension pattern (Extension class + commands + inputRules + keymap)
4. Write tests first (TDD)
5. Document usage in README

### When working across packages:
1. Use Nx commands: `nx build core`, `nx test extension-bold`
2. Nx handles dependency order automatically
3. Use workspace protocol in package.json: `"@helix/core": "workspace:*"`
4. Changes to core automatically trigger rebuild of dependents

### Building and testing:
```bash
# Build everything
nx run-many -t build

# Test everything
nx run-many -t test

# Build affected (only changed packages)
nx affected -t build

# Test specific package
nx test core
```
