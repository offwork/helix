# Helix Project - Session Handoff

**Date:** February 16, 2026  
**Status:** Epic #1 COMPLETED ✅ | Epic #2 IN PROGRESS 🚧

---

## Current Project State

### ✅ Completed

1. **Project Setup**
   - Nx workspace initialized with pnpm
   - Node.js LTS + pnpm workspace configuration
   - ESLint flat config (ESM) with Nx plugin

2. **Core Domain Packages Created**
   - `@helix/document` - Document domain (packages/core/document)
   - `@helix/editor` - Editor domain (packages/core/editor)
   - `@helix/extension` - Extension domain (packages/core/extension)
   - `@helix/serialization` - Serialization domain (packages/core/serialization)
   - All use: Jest, Rollup, publishable, tagged

3. **Module Boundaries (DDD)**
   - ESLint `@nx/enforce-module-boundaries` configured
   - Tags: `domain:*`, `layer:*`, `type:*`
   - Rules enforce DDD bounded contexts
   - Tested: `nx run-many -t lint` ✅

4. **GitHub Agile Setup** ✅
   - Repository: https://github.com/offwork/helix
   - Branch strategy: **Trunk-based development**
   - Labels: type, domain, priority (12 labels)
   - Milestones: v0.1.0, v0.2.0, v0.3.0, v1.0.0
   - Kanban board: 5 columns (Backlog, Ready, In Progress, In Review, Done)
   - Workflows: Auto-move to Done on issue close

5. **Epic #1: Document Domain Implementation** ✅ COMPLETED
   - All value objects implemented
   - All entities implemented
   - Schema service implemented
   - Full API validation completed

6. **CI/CD Setup** ✅ COMPLETED (#21)
   - `.github/workflows/ci.yml` - lint, test, build on PR/push
   - `.github/workflows/release.yml` - build, GitHub release on tag
   - Codecov integration with 80% threshold
   - `CHANGELOG.md` initialized

---

## Current Code State

### Document Domain Structure
```
packages/core/document/
├── src/
│   ├── index.ts                          # Exports all public API
│   └── lib/
│       ├── entities/
│       │   ├── Node.ts                   # ✅ Full: constructor + content/marks/text + childCount + nodeSize + equals() + sameMarkup()
│       │   ├── Node.spec.ts              # ✅ Tests passing (all #22 tests GREEN)
│       │   ├── Fragment.ts               # ✅ Full: empty() + from() + childCount + size + firstChild + lastChild + child() + forEach() + slice() + equals()
│       │   └── Fragment.spec.ts          # ✅ Tests passing (all #22 + #23 tests GREEN)
│       ├── value-objects/
│       │   ├── NodeType.ts               # ✅ Complete: isBlock/isInline/isLeaf/isText + contentMatch/inlineContent + allowsMarkType() + create() + validContent()
│       │   ├── NodeType.spec.ts          # ✅ Tests passing (all #24 tests GREEN)
│       │   ├── MarkType.ts               # ✅ Complete - validation + equals()
│       │   ├── MarkType.spec.ts          # ✅ Tests passing
│       │   ├── Mark.ts                   # ✅ Immutable VO (type: string - design decision)
│       │   ├── Mark.spec.ts              # ✅ Tests passing
│       │   ├── MarkSet.ts                # ✅ Complete - 5 cycles
│       │   ├── MarkSet.spec.ts           # ✅ Tests passing
│       │   ├── ContentMatch.ts           # ✅ Graph-based VO + defaultType() + matchType() + matchFragment()
│       │   ├── ContentMatch.spec.ts      # ✅ Tests passing
│       │   ├── Position.ts               # ✅ Complete
│       │   ├── Position.spec.ts          # ✅ Tests passing
│       │   ├── ResolvedPos.ts            # ✅ Complete (MVP)
│       │   ├── ResolvedPos.spec.ts       # ✅ Tests passing
│       │   ├── Slice.ts                  # ✅ Complete
│       │   └── Slice.spec.ts             # ✅ Tests passing
│       ├── interfaces/
│       │   ├── SchemaSpec.ts             # ✅ NodeSpec (attrs, inline, marks, leaf, text), MarkSpec
│       │   └── Edge.ts                   # ✅ Edge interface
│       ├── utils/
│       │   └── deep-equal.ts             # ✅ Recursive deep equality for objects/arrays
│       └── services/
│           ├── SchemaService.ts          # ✅ Complete - type registry
│           └── SchemaService.spec.ts     # ✅ Tests passing
├── project.json                          # Tags: domain:document
└── package.json                          # @helix/document
```

---

## Epic #2: Document Domain Enhancements 🚧

### GitHub Issues

| Issue | Title | Status | Priority | Blocked By |
|-------|-------|--------|----------|------------|
| #20 | Epic #2: Document Domain Enhancements | 🚧 In Progress | - | - |
| #21 | CI/CD Setup | ✅ Done | High | - |
| #22 | Node enhancements (equals, Fragment.equals) | ✅ Done | High | - |
| #23 | Fragment.size (real implementation) | ✅ Done | High | - |
| #24 | NodeType enhancements | ✅ Done | Medium | - |
| #25 | ContentMatch enhancements | 🚧 Ready to Start | Medium | - |
| #26 | ResolvedPos enhancements | Backlog | Medium | #22 |

### Completed: Issue #22 Node Enhancements ✅

**Branch:** `feature/22-node-enhancements`

**All Tests GREEN:**
- ✅ NodeType.isLeaf (spec.leaf === true)
- ✅ NodeType.isText (spec.text === true)
- ✅ Node constructor validations (type, attrs, content, marks, text)
- ✅ childCount (with content, without content)
- ✅ nodeSize (leaf→1, text→text.length, else→2+content.size)
- ✅ Fragment.equals() (same instance, both empty, different childCount, same/different children, null/undefined throws)
- ✅ deep-equal utility (recursive equality for objects/arrays)
- ✅ Node.equals() (same type/attrs/content/marks, different type/attrs/content/marks, text nodes, null/undefined throws)
- ✅ Node.sameMarkup() (same type+attrs+marks, different type/attrs/marks)

### Completed: Issue #23 Fragment.size ✅

**Real Implementation:**
- ✅ Fragment.size returns `content.reduce((sum, node) => sum += node.nodeSize, 0)`
- ✅ Replaced stub implementation with real nodeSize-based calculation
- ✅ All existing tests still passing

### Completed: Issue #24 NodeType Enhancements ✅

**Branch:** `feature/22-node-enhancements`
**Commit:** `feat(document): implement NodeType enhancements (closes #24)`

**Phase 1: Properties — All GREEN:**
- ✅ isBlock getter: `!(spec.inline || spec.text)` — spec-driven, not name-based
- ✅ isInline getter: `spec.text || spec.inline` (direct spec check, not `!this.isBlock`)
- ✅ contentMatch: mutable property, `ContentMatch | null = null` (filled in later by SchemaService)
- ✅ inlineContent: mutable property, `boolean | null = null` (filled in later by SchemaService)
- FREE PASS: isBlock spec.inline true, isBlock spec.text true, isInline spec.inline true, contentMatch stores reference, inlineContent set to true

**Phase 2: create() — All GREEN:**
- ✅ create() throws for text node types
- ✅ create() with no args returns Node with defaults (attrs={}, content=Fragment.empty(), marks=[])
- ✅ create() with attrs and content returns Node with provided values
- ✅ create() accepts Node[] as content, wraps in Fragment via `Array.isArray` check

**Phase 3: validContent() — All GREEN:**
- ✅ validContent() returns true for matching content (via contentMatch.matchFragment)
- ✅ validContent() returns false for non-matching content (FREE PASS — covered by implementation)
- ✅ validContent() throws for null parameter

**Phase 4: createAndFill() — DEFERRED:**
- Requires ContentMatch.fillBefore() which doesn't exist yet
- Will be addressed in future issue

**⚠️ Known Gap: Mark validation in validContent()**
- ProseMirror's validContent also checks `allowsMarks(child.marks)` for each child node
- Helix cannot do this currently: `Node.marks` is `Mark[]` but `allowsMarkType()` expects `MarkType`
- `Mark.type` is a **string**, not a `MarkType` instance — no bridge exists
- Mark validation in validContent deferred until Mark↔MarkType relationship is resolved

#### Helix vs ProseMirror Design Differences (Reference)

| Property | ProseMirror | Helix | Difference |
|----------|-------------|-------|------------|
| `isBlock` | `!(spec.inline \|\| name == "text")` | `!(spec.inline \|\| spec.text)` | Spec-driven, not name-based |
| `isInline` | `!this.isBlock` (getter) | `spec.text \|\| spec.inline` | Direct spec check |
| `isText` | `name == "text"` | `spec.text === true` | Spec-driven |
| `isLeaf` | `contentMatch == ContentMatch.empty` | `spec.leaf === true` | Spec-driven |
| `contentMatch` | Set by Schema | Mutable, default null | Same pattern |
| `inlineContent` | Set by Schema | Mutable, default null | Same pattern |

---

### Next Issue: #25 ContentMatch Enhancements 🚧

**Status:** Ready to Start
**Priority:** Medium
**Research needed:** Yes — ProseMirror ContentMatch patterns, fillBefore, compatible, etc.

---

## Design Decisions (Epic #2)

| Decision | Rationale |
|----------|-----------|
| `Fragment<Node>` (not IFragment) | YAGNI - Interface ihtiyacı doğarsa sonra refactor edilir |
| Strict validation (null & undefined → throw) | Factory metotları (#24) gelene kadar constructor strict kalmalı |
| NodeSpec.leaf & NodeSpec.text | Type-level özellikler, attrs'tan farklı (instance vs type) |
| Constructor'da temel validation | DDD: Business validation factory'de, temel validation constructor'da |
| `=== true` for boolean checks | Tek test yeterli, undefined/false aynı davranış |
| `equals` not `eq` | TypeScript naming convention |
| Spec-driven predicates (isBlock, isText, isLeaf) | Helix uses spec flags, not name-based checks like ProseMirror |
| "Filled in later" for contentMatch/inlineContent | Same as ProseMirror — Schema sets these post-construction |
| create() accepts Node[] content | Array.isArray check + Fragment.from normalization — convenience API |
| validContent without mark checking | Mark↔MarkType type gap — bridge oluşana kadar ertelendi |
| isInline as `spec.text \|\| spec.inline` | `!this.isBlock` yerine doğrudan spec kontrolü |

---

## Critical Test Rules - CHECK BEFORE EVERY TEST PLANNING ⚠️

### Canon TDD 5 Golden Rules (Kent Beck 2025)

| Rule | Summary | Example/Note |
|------|---------|--------------|
| **1. Write behavior tests, not implementation** | Focus on what, not how. Tests describe external contract. | Write "Position stores offset" not "Position has _offset field". |
| **2. Write & pass one asserted test at a time** | One test → one assertion → organic design emerges. | e.g., for Position VO, cycles: 1) stores offset, 2) stores parent, 3) depth, 4) resolves path, … |
| **3. Make it run, then make it right** | GREEN phase: minimal code to pass. No refactor yet. | `return null;` to pass a single test is valid if typed correctly. |
| **4. Refactor only within the current cycle** | After each GREEN, check duplication in current cycle only. | e.g., if 2 cycles use `createFragment(...)`, extract on 3rd use (Rule of Three). |
| **5. Continue until fear turns to boredom** | When Test List is empty and code feels solid → done. Stop. Commit. | Full coverage + all scenarios handled = boredom achieved → commit. |

**Critical Clarification:** "One asserted test" (Rule 2) = test with ONE expect(). If your test checks both `offset` and `depth`, split it into two tests.

### Expanded Rule Details with Helix Context

| Rule | Short | Expanded Explanation | Anti-Pattern | Helix Example |
|------|-------|----------------------|--------------|---------------|
| Focus on behavior, not implementation | 1 | Tests should verify external contract (what the API does) rather than internal details (how it's implemented). Tests stay stable when internals change. | "Fragment has _content field" (exposes privates) | "Fragment.size returns child count" (behavior), not "Fragment._nodes is array" |
| Write & pass one test at a time | 2 | Write complete Test List upfront (behavior scenarios). Then implement one test → RED → minimal GREEN → REFACTOR → next test. Design emerges organically. Never write multiple tests before implementing. | Writing 5 failing tests at once (overwhelming), or GREEN-first (no TDD) | MarkSet: 1st cycle "empty() returns empty set", 2nd "from([mark]) contains mark", etc. Each cycle: write test → fail → pass → refactor. |
| Make it run, then make it right (GREEN phase) | 3 | In GREEN phase, use simplest code to pass (even hardcoded values if typed correctly). Don't refactor yet. Don't add features not tested. | Writing "clean" code during GREEN (premature optimization), or adding untested edge cases | NodeType validation: first pass `if (!name) throw` (simple), refactor phase extracts validateParameter() |
| Refactor only in current cycle, not globally | 4 | After GREEN, check for duplication in CURRENT cycle's production + test code. Extract only if needed (Rule of Three). Don't refactor unrelated code. YAGNI principle. | Refactoring Fragment when writing Position tests, or extracting after 1st use | Mark.spec: extract createMark() factory on 3rd test (not 1st), ignore old Fragment duplication |
| Continue until fear turns to boredom | 5 | Write Test List until you've thought of all scary scenarios. Implement all. When Test List empty + code feels boring/obvious → you're done. Commit. | Stopping early (incomplete Test List), or adding scenarios mid-implementation (breaks flow) | Schema Service: Test List includes validation, lookup, error cases. When all pass + 100% coverage + no fear → commit. |

### How Rules Map to Helix TDD Cycle

| Phase | Rule Applied | What to Do | Example from Helix |
|-------|--------------|------------|---------------------|
| **Planning** (before RED) | Rule 1 + 5 | Write complete Test List with behavior-only scenarios. Think through all fears/scenarios upfront. | e.g., MarkSet Test List: empty(), from(valid), from(invalid), add(new), add(duplicate), remove(exists), remove(missing), contains(), equals() |
| **RED Phase** | Rule 2 | Write ONE test (one expect). Run it. Must fail (or skip if API doesn't exist yet). | `it('empty, returns MarkSet with size 0', ...)` → fails because MarkSet.empty() doesn't exist |
| **GREEN Phase** | Rule 3 | Write minimal code to pass current test. No refactor. No extra features. | `static empty(): MarkSet { return new MarkSet([]); }` (simplest code) |
| **REFACTOR Phase** | Rule 4 | Look at CURRENT cycle code (production + test). Extract duplication if Rule of Three met. Ignore old code. | After 3rd test uses `new Mark('bold', {})`, extract `createMark(type)` factory |
| **COMMIT** | Rule 5 | When Test List empty + all tests GREEN + refactor done + no fear left → commit. One commit per issue. | `git commit -m "feat(document): implement NodeType (closes #6)"` |

### Why This Works (with Helix Evidence)
- **Behavior focus (Rule 1):** NodeType tests survive spec changes because they test contract, not internals.
- **One test at a time (Rule 2):** MarkSet design emerged organically (singleton, type-based ops) without upfront architecture.
- **Make it run first (Rule 3):** Fragment.from() started as `return new Fragment([...nodes])`, then refactored for validation.
- **Current cycle only (Rule 4):** Avoided premature abstraction (e.g., didn't extract ContentMatch until really needed 3+ times).
- **Boredom test (Rule 5):** MarkSet felt "done" when Test List empty + 100% coverage + all edge cases handled.

### Duplication Detection Checklist (Rule 4 Details)

When in REFACTOR phase, ask:

1. **Is there duplication in the current test?**  
   e.g., `new Mark('bold', {})` appears 3+ times → extract `createMark('bold')`

2. **Is there duplication in the current production code?**  
   e.g., null/undefined checks appear 3+ times → extract `validateNotNull(value, name)`

3. **Is the duplication in OLD code (not current cycle)?**  
   → **Ignore it.** YAGNI. Don't refactor until you're writing tests for that area again.

4. **Have I reached the Rule of Three?**  
   - 1st occurrence: Note it  
   - 2nd occurrence: Tolerate it  
   - 3rd occurrence: Extract it  

5. **Is this a real abstraction or premature?**  
   - Real: Same logic, 3+ uses, clear intent  
   - Premature: "Might need this later", <3 uses, unclear intent  

Example from Helix:
- ✅ Extracted: `createMarks(...types)` in MarkSet.spec (appeared in 8+ tests)
- ❌ Didn't extract: NodeType validation (only 2 null checks for schema/spec, waited for MarkType to see pattern)

### Free Pass Rule (Critical!)

**Before adding ANY test to the list, ask:**
> "If I run this test RIGHT NOW against current code, will it FAIL?"

- If YES → Add to test list
- If NO → It's a FREE PASS, skip it

**Why?** Canon TDD Rule 5: Tests are done when fear becomes boredom. A test that already passes adds no value.

**FREE PASS timing:** After each GREEN, Claude must immediately check if the NEXT test(s) in the list are now FREE PASS before asking Kerem to write them.

### Integration with Helix Commit Strategy

**KEY: We commit ONLY when Rule 5 is satisfied (Test List empty, fear → boredom).**

| Commit Strategy | Rule 5 Mapping | Example |
|-----------------|----------------|---------|
| **One commit per issue** | Test List is empty + all cycles complete = boredom achieved | NodeType: Constructor validation + equals() tests all pass → commit |
| **NO micro-commits** | Don't commit after each RED/GREEN/REFACTOR (Rule 5 not yet satisfied) | ❌ `git commit -m "add NodeType constructor test"` (premature) |
| **Optional WIP commit** | If branch >1 day, WIP commit as safety net (discouraged but allowed) | `git commit -m "chore: wip Schema Service – partial"` |
| **Meaningful history** | One commit = one closed issue = one PR = atomic change | Clean git log: each commit is a complete, working feature |

### Critical Test Rules (Fully Incorporated from Handoff)
- **USE Naming Mandatory:** "UnitOfWork_StateUnderTest_ExpectedBehavior" (e.g., "constructor, given valid spec, stores name").
- **One Assertion per Test:** Split multiples (e.g., separate toBeInstanceOf and property asserts into distinct tests if testing different behaviors).
- **Assertion Matches Description:** Describe instance creation → use toBeInstanceOf, not toBeDefined.
- **Refactor Includes Tests:** DRY setups (factories > beforeEach when setup varies per test); extract helpers.
- **Concept-First Teaching:** ALWAYS: "What is NodeType? (Blueprint for nodes in Schema) Why? (Type safety, validation, node creation)."
- **Static Member Access:** `SchemaService.nodes` not `this.nodes`.
- **RED Commit First:** Failing test before impl (but now we batch commits - don't commit RED alone, commit when Test List empty).
- **Test Organization:** Group tests by method/behavior using nested describe blocks (e.g., Constructor, equals()).

### USE Naming Convention (Mandatory)

All test names must follow: **U**nit, **S**cenario, **E**xpectation

Format: `unit, given scenario, expected result`

**Property default tests:** Use "is" not "returns" for property default values.
- ✅ `contentMatch, given default, is null`
- ❌ `contentMatch, given default, returns null`

Examples:
- `constructor, given valid parameters, creates instance`
- `equals, given same values, returns true`
- `childCount, given node with content, returns content.childCount`
- `contentMatch, given default, is null` (property default — not a return)

### Workflow Integration with Trunk-Based Development
- **Branch per Issue:** e.g., `feature/25-contentmatch-enhancements` (max 1-2 days).
- **Commit Policy:** ONE commit when Test List is empty (Rule 5 satisfied).
- **Commit Phases:** Don't commit RED/GREEN/REFACTOR separately - batch until Test List empty.
- **PR & Merge:** CI green (lint/test/coverage) → immediate merge to main.
- **Tools:** Nx for runs; GitHub Kanban auto-moves.
- **Research First:** Before Rule 1, search/browse ProseMirror (e.g., ContentMatch: fillBefore, compatible).

---

## Commit Convention

**Format:**
```
feat(document): brief description (closes #N)

- Change 1
- Change 2

Issue #N
```

**Rules:**
- **Title:** `feat(domain): brief description (closes #N)` or `feat(domain): brief description`
- **Body:** Bullet points for changes (what was added, removed, or modified)
- **Footer:** `Issue #N`
- **Convention:** Use imperative mood ("Add", "Remove", "Update", not "Added", "Removed")
- **Scope:** Use package name (document, editor, extension, serialization)
- **Conventional Commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`

---

## Branch Strategy: Trunk-Based Development

### Structure
```
main (trunk – always green, always deployable)
  ↓
feature/[issue-number]-[short-description] (max 1–2 days)
  ↓ merge (when CI green)
main (updated)
```

### Commit Policy

We commit **only when the entire Test List for the current issue is empty** (i.e., Rule 5 is satisfied: "fear → boredom" achieved).

| When do we commit? | Commit message convention | Reason (Canon TDD) |
|--------------------|---------------------------|---------------------|
| After finishing the **complete Test List** of the issue | `feat(document): implement X (closes #N)` | One logical change = one commit = one PR |
| Optional intermediate commit **only if** branch >1 day | `chore(document): wip X – partial test list` | Safety only – still discouraged |
| Never commit mid-cycle | — | Violates Rule 5 |

---

## CI/CD Configuration

### Workflows

**ci.yml** (PR/push to main):
- Checkout + pnpm setup + Node.js 22
- `pnpm install --frozen-lockfile`
- `pnpm nx run-many -t lint`
- `pnpm nx run-many -t test --coverage`
- Codecov upload (80% threshold)
- `pnpm nx run-many -t build`

**release.yml** (on tag v*):
- Same setup
- Test + Build
- Create GitHub Release with auto-generated notes

### Coverage
- Tool: Codecov
- Threshold: 80% (CI fails below)
- Config: `fail_ci_if_error: false` (for now)

---

## Notes for Next Session

### Project Approach
- Kerem prefers **learning by doing** - he must write code himself
- Claude acts as **teacher/mentor**, not coder
- TDD cycle discipline is **non-negotiable**
- Pragmatic decisions are REQUIRED (kapsamlı rich text deneyimi yok)
- typeof validation approach is **decided** (explicit, strong)
- Immutability strategy: defensive copy + readonly
- USE naming convention is **MANDATORY**
- One commit per issue (when Test List empty)

### Critical Reminders for Claude
- **CHECK SESSION-HANDOFF before EVERY response** - This is an ORDER, not a suggestion. No exceptions.
- **Check CRITICAL TEST RULES before EVERY test planning**
- **Check FREE PASS RULE before adding tests to list** — and immediately after each GREEN
- **Concept-first teaching ALWAYS** - explain what/why before tests. NEVER skip this for new methods/properties.
- **Research BEFORE planning** - Check ProseMirror patterns first
- **No code suggestions unless asked** - Kerem writes, Claude teaches
- **Don't extract until duplication appears** - YAGNI principle (Rule of Three)
- **Test organization** - Group by method/behavior (nested describe blocks)
- **Type bypass in tests** - Use `as never`, not `as unknown as T`
- **LISTEN to Kerem** - Don't repeat mistakes, don't rush, don't assume
- **Keep responses CONCISE** - Avoid unnecessary details unless asked
- **Focus when asked** - no extra complexity or options
- **Specify FULL file location** - e.g. `packages/core/document/src/lib/value-objects/NodeType.spec.ts`
- **Terminology precision** - "Fragment's child nodes" NOT "child node'ların Fragment'ı". Content = Fragment that holds child nodes.
- **Property default tests use "is" not "returns"** - e.g. "given default, is null"
- **Don't let Kerem write FREE PASS tests** - Detect and announce FREE PASS BEFORE Kerem writes the test

### How to Resume

1. **Load this file** in new Claude session
2. **User context:** Kerem wants to LEARN by DOING - he writes code, Claude teaches
3. **Current task:** Issue #25 ContentMatch enhancements (READY TO START)
4. **Branch:** Create new branch `feature/25-contentmatch-enhancements` from main (after #24 merge)
5. **Research needed:** ProseMirror ContentMatch patterns — fillBefore, compatible, etc.
6. **Next action:** Research ProseMirror ContentMatch → Plan test list → Phase 1, Test 1
7. **After #25:**
   - Issue #26 ResolvedPos enhancements
8. **Known gaps:**
   - Mark↔MarkType bridge missing (validContent mark checking deferred)
   - createAndFill deferred (needs ContentMatch.fillBefore)
9. **Remember:**
    - Turkish for conversation
    - English for code/docs
    - Kerem writes ALL code
    - Claude only teaches and reviews
    - NO code suggestions unless asked
    - USE naming convention MANDATORY
    - Check CRITICAL TEST RULES before planning
    - Check FREE PASS RULE before test list AND after each GREEN
    - Concept-first teaching ALWAYS — NEVER skip for new concepts
    - One commit per issue (when Test List empty)
    - Specify FULL file path always
    - CHECK SESSION-HANDOFF before EVERY response — this is an ORDER

---

## Key Learnings

### Epic #1 Learnings

**Validation Patterns:**
- **Rule of Three:** Extract helper on 3rd occurrence (not dogmatic - pattern clarity matters more)
- **Single validateParameters():** All constructor validations in one method (DRY principle)
- **Type-Aware Validation:** typeof checks for number-specific validation (negative checks, integer checks)
- **Explicit Error Messages:** Distinct messages for null vs undefined (defense in depth)
- **Domain Constraints:** Validate business rules (e.g., openEnd >= openStart, empty fragment → zero opens)

**Value Object Patterns:**
- **public readonly Constructor:** No "stores" tests needed - TypeScript + public readonly guarantees storage
- **First Test Always:** toBeInstanceOf (not "stores" properties) for ANY TypeScript class
- **equals() Design:** Compare only identity-defining properties (e.g., pos + doc, not depth)
- **Immutability:** readonly fields, no setters, return new instances if needed
- **Graph-Based VOs:** Can contain graph structures (edges array) while maintaining immutability

**Mock Strategy Evolution:**
- **Loose Coupling (ResolvedPos):** `{} as Node` when dependencies not validated
- **Real Instances Required (ContentMatch):** instanceof checks need real instances - test helpers created
- **Duck Typing Rejected:** When instanceof validation is core behavior
- **Test Helpers Pattern:** createMock*() functions for consistent test data
- **Tight Coupling Accepted:** When type parameters require imports, use real implementations

**TDD Pragmatism:**
- **Canon TDD 5 Rules:** Focus on behavior, one test at a time, make it run then right, refactor current cycle only, boredom test
- **Rule of Three:** Heuristic not dogma - extract when pattern is clear
- **Low-Level Domain Work:** Pattern emergence may be delayed - pragmatic extraction acceptable
- **Single Commit Per Issue:** When Test List empty (Rule 5 satisfied)
- **Domain Analysis:** Pause TDD when constraint gaps discovered

### Epic #2 Learnings

**Validation Strategy:**
- **Constructor vs Factory:** Temel validation (null/undefined) constructor'da, business validation factory'de
- **Strict Mode:** null ve undefined için throw (factory gelene kadar)
- **DDD Pattern:** Factory metotları (#24) gelince default handling orada yapılacak

**Type Design:**
- **NodeSpec.leaf/text:** Type-level özellikler (attrs'tan farklı - her instance'ta aynı)
- **Fragment<Node>:** Generic bağımlılığı basit tutuluyor, IFragment sonraya bırakıldı
- **`=== true` pattern:** Boolean optional property'ler için tek test yeterli
- **Mark↔MarkType gap:** Mark.type string, allowsMarkType MarkType bekliyor — bridge yok, validContent mark kontrolü ertelendi

**Test Planning:**
- **Free Pass Detection:** Test eklemeden önce "Bu RED olur mu?" sorusu ZORUNLU
- **Free Pass Timing:** Her GREEN'den sonra Claude sonraki testleri FREE PASS açısından HEMEN kontrol etmeli — Kerem'i boşuna test yazdırmamalı
- **Dosya Belirtme:** Tam yol her zaman — `packages/core/document/src/lib/value-objects/NodeType.spec.ts`

**Dependency Discovery:**
- **Node.equals() blocked:** Fragment.equals(), attrs deep equality, Mark[] comparison gerekli
- **Planning failure:** equals() bağımlılıkları Epic planlamasında önceden görülmedi
- **Lesson:** Karmaşık method'lar için bağımlılık analizi ÖNCE yapılmalı

**Issue #24 Learnings:**
- **"Filled in later" pattern:** contentMatch ve inlineContent Schema tarafından constructor sonrası set edilir
- **Spec-driven approach:** Helix name-based değil spec-based predicate'ler kullanır (isBlock, isText, isLeaf)
- **createAndFill scope risk:** ContentMatch.fillBefore() henüz yok, createAndFill ertelendi
- **Factory method pattern:** create() NodeType üzerinde, Node constructor doğrudan kullanmak yerine factory aracılığıyla
- **Content normalization:** create() hem Fragment hem Node[] kabul eder, Array.isArray ile normalize eder
- **Terminoloji hassasiyeti:** "returns" method/getter içindir, property default değerleri için "is" kullanılmalı
- **Content jargonu:** "content" her zaman Fragment'ın child node'larını ifade eder — Fragment bir container, child node'ları tutar

---

## Architecture Discoveries

**Graph-Based VO (ContentMatch):** Initial assumption REVERSED - VOs can store graph structures
**State Machine Design:** ContentMatch is node within pre-built graph (Schema creates, ContentMatch uses)
**Graph Navigation:** matchType() searches edges, returns edge.next (not new instance)
**Value Equality in Graphs:** Compare references (type/next) not deep equality

**API Design Decisions:**
- **Mark.type = string:** Valid design choice, lookup via SchemaService
- **ContentMatch.matchFragment() 3 return states:** More detailed than ProseMirror, valid
- **allowsMarkType on NodeType:** ProseMirror-aligned, moved from ContentMatch
- **ProseMirror as reference, not spec:** Helix can diverge when beneficial
- **Mutable contentMatch/inlineContent on NodeType:** "Filled in later" pattern — same as ProseMirror
- **create() content flexibility:** Accepts Fragment<Node> | Node[] — normalizes internally
- **validContent without marks:** Deferred due to Mark↔MarkType type incompatibility

---

**Conversation style:** Direct, technical, teaching-focused. Kerem asks, Claude explains concepts and reviews code. Strong feedback is welcome and necessary. Keep responses SHORT and CONCISE - avoid elaboration unless explicitly requested.

**Critical:** DON'T write code for Kerem unless he explicitly requests it! DON'T plan cycles poorly! ALWAYS research domain patterns before planning! CHECK SESSION-HANDOFF before EVERY response - this is an ORDER with NO exceptions! CHECK CRITICAL TEST RULES EVERY TIME! CHECK FREE PASS RULE BEFORE TEST LIST AND AFTER EACH GREEN! ONE COMMIT PER ISSUE (when Test List empty)! NEVER provide code examples or implementations unless explicitly asked! LISTEN to Kerem and DON'T repeat mistakes! ALWAYS specify FULL file path! CONCEPT-FIRST TEACHING — NEVER skip explaining what/why before tests! TERMINOLOGY MUST BE PRECISE — don't confuse Kerem with sloppy language!

---

**End of Handoff Document**  
**Status:** Epic #2 IN PROGRESS 🚧  
**Current Issue:** #25 ContentMatch enhancements (READY TO START)  
**Branch:** New branch needed from main after #24 merge  
**Next Action:** Research ProseMirror ContentMatch → Plan test list → Start implementation  
**Known Gaps:** Mark↔MarkType bridge, createAndFill (needs fillBefore)  
**Session Date:** February 16, 2026
