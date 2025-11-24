# Architecture - Domain-Driven Design

## Bounded Contexts
Our system is divided into 4 bounded contexts (domains):

1. **Document Domain** - Content structure and validation
2. **Editor Domain** - Editor engine and state management
3. **Extension Domain** - Plugin system and extensibility
4. **Serialization Domain** - Format conversion (HTML, Markdown, JSON)

---

## 1. Document Domain

### Responsibility
Manages the document structure, content model, and schema validation.

### Entities
**Node** - A node instance in the document tree
- Identity: Position/path in document
- Lifecycle: Created, updated, deleted
- Mutable: Content can change via transactions
- Examples: Specific paragraph at position 45, heading at position 10

**Fragment** - Collection of nodes
- Identity: Position within parent node
- Represents a slice of document content

### Value Objects
**NodeType** - Node specification/definition
- Defines what a node type is (paragraph, heading, image)
- Immutable
- Examples: ParagraphNodeType spec, ImageNodeType spec
- Attributes: name, content rules, attributes schema

**Mark** - Text formatting annotation
- Immutable
- Examples: bold, italic, link
- Defined by type and attributes

**MarkType** - Mark specification
- Defines what a mark type is
- Immutable

**Attrs** - Attributes object
- Key-value pairs for nodes/marks
- Examples: `{ level: 1 }` for heading, `{ href: "..." }` for link

**Content** - Content expression
- Defines what children are allowed
- Examples: "block+", "inline*"

### Aggregate Root
**Document** - The entire document tree
- Root of the node tree
- Enforces schema validation
- Transaction boundary for consistency

### Domain Services
**Schema** - Schema definition and validation
- Manages NodeTypes and MarkTypes
- Validates document structure
- Ensures content rules are followed

### Key Concepts
- Documents are tree structures of nodes
- Nodes follow a schema (what's allowed where)
- Marks annotate inline content
- Everything is validated against the schema

---

## 2. Editor Domain

### Responsibility
Manages editor instances, state, transactions, and rendering.

### Entities
**Editor** - Editor instance
- Identity: Unique editor instance (often tied to DOM mount point)
- Lifecycle: Created → mounted → destroyed
- Manages EditorState transitions
- Handles transactions
- Coordinates plugins/extensions

**History** - Undo/redo manager
- Identity: Belongs to an editor instance
- Maintains sequence of EditorStates
- Handles undo/redo operations

**View** - DOM rendering layer
- Identity: Tied to editor instance
- Manages DOM representation
- Handles user interactions
- Updates DOM based on state

### Value Objects
**EditorState** - Immutable state snapshot
- Contains: document, selection, plugin states
- Each transaction creates a new EditorState
- Value-based equality (same content = same state)

**Transaction** - State change descriptor
- Immutable record of changes
- Applied to create new EditorState
- Contains: steps, metadata, time

**Selection** - Cursor/selection position
- Immutable
- Types: TextSelection, NodeSelection, AllSelection
- Defined by from/to positions

### Domain Services
**TransactionHandler** - Processes transactions
- Applies changes to create new state
- Validates transactions
- Notifies listeners

### Key Concepts
- State is immutable (functional updates)
- Transactions drive all changes
- Editor orchestrates state transitions
- View layer syncs DOM with state

---

## 3. Extension Domain

### Responsibility
Plugin/extension system for adding features modularly.

### Entities
**Extension** - Registered extension instance
- Identity: Unique key/name
- Lifecycle: Registered → active → unregistered
- Can have internal state
- Examples: BoldExtension, ImageUploadExtension

**Plugin** - ProseMirror plugin wrapper
- Identity: Plugin key
- Provides hooks into editor lifecycle

### Value Objects
**ExtensionSpec** - Extension configuration
- Immutable definition
- Contains: options, defaults, schema contributions

**PluginKey** - Unique identifier for plugin
- Used to access plugin state
- String-based

### Domain Services
**ExtensionRegistry** - Manages extensions
- Registers/unregisters extensions
- Handles priority/ordering
- Resolves dependencies

### Key Concepts
- Extensions are modular features
- Each extension can contribute:
  - NodeTypes/MarkTypes to schema
  - Commands
  - Input rules
  - Keyboard shortcuts
  - UI components (for bindings)
- Extensions are registered once, used throughout editor lifecycle

### Example Extensions
- `@helix/extension-bold` - Bold text formatting
- `@helix/extension-image` - Image insertion with upload
- `@helix/extension-link` - Hyperlink support

---

## 4. Serialization Domain

### Responsibility
Converting documents between formats (HTML, Markdown, JSON).

### Domain Services
**HTMLSerializer** - Document → HTML
**HTMLParser** - HTML → Document
**MarkdownSerializer** - Document → Markdown
**MarkdownParser** - Markdown → Document
**JSONSerializer** - Document → JSON
**JSONParser** - JSON → Document

### Value Objects
**SerializerConfig** - Serialization options
- Pretty print
- Whitespace handling
- Custom tag mappings

**ParserConfig** - Parsing options
- Preserve whitespace
- Error handling strategy

### Key Concepts
- Stateless transformations
- No entities (pure functions)
- Schema-aware parsing/serialization
- Extensible via custom node/mark serializers

---

## Domain Relationships

```
┌─────────────────────────────────────────────────────────┐
│                     Editor Domain                        │
│  ┌──────────┐         ┌───────────────┐                │
│  │  Editor  │◄────────│  EditorState  │                │
│  └────┬─────┘         └───────┬───────┘                │
│       │                       │                         │
│       │ manages               │ contains                │
│       ▼                       ▼                         │
│  ┌────────────┐         ┌──────────┐                   │
│  │ Extension  │         │ Document │◄──────────────────┼──┐
│  │ Registry   │         └──────────┘                   │  │
│  └────┬───────┘               │                        │  │
└───────┼───────────────────────┼────────────────────────┘  │
        │                       │                           │
        │ uses                  │ defined by                │
        ▼                       ▼                           │
┌───────────────────────┐  ┌─────────────────────────┐    │
│  Extension Domain     │  │   Document Domain       │◄───┘
│  ┌──────────────┐     │  │  ┌────────┐            │
│  │  Extensions  │     │  │  │ Schema │            │
│  └──────────────┘     │  │  └────────┘            │
└───────────────────────┘  │  ┌──────────────┐      │
                           │  │ Node/Mark     │      │
                           │  │ Types         │      │
                           │  └──────────────┘      │
                           └─────────────────────────┘
                                     │
                                     │ uses
                                     ▼
                           ┌─────────────────────────┐
                           │ Serialization Domain    │
                           │  ┌──────────────────┐   │
                           │  │ Serializers/     │   │
                           │  │ Parsers          │   │
                           │  └──────────────────┘   │
                           └─────────────────────────┘
```

## Architecture Principles

### 1. Separation of Concerns
Each domain has clear responsibilities. Don't mix concerns.

### 2. Dependency Rule
- Core domains (Document, Editor) don't depend on outer layers
- Extensions depend on core
- Framework bindings depend on core + extensions
- Dependency direction: inward

### 3. Immutability
- Value Objects are always immutable
- EditorState is immutable (functional updates)
- Transactions describe changes, don't mutate directly

### 4. Schema-Driven
Everything is validated against schema. No invalid documents possible.

### 5. Transaction-Based
All state changes go through transactions. No direct mutations.

### 6. Modularity
Extensions are independent. Core doesn't know about specific extensions.

## For Claude Code

### When implementing Document Domain:
- Respect immutability for Value Objects
- Schema validation is mandatory
- Node identity = position in tree

### When implementing Editor Domain:
- State updates only via transactions
- No direct EditorState mutations
- View syncs with state (one-way data flow)

### When implementing Extension Domain:
- Extensions must be self-contained
- Use ExtensionRegistry for registration
- Extensions contribute to schema via specs

### When implementing Serialization Domain:
- Keep serializers stateless
- Make parsers schema-aware
- Support custom node/mark handlers

### Cross-Domain Communication:
- Use domain services for coordination
- Avoid tight coupling between domains
- Prefer events/callbacks over direct calls
