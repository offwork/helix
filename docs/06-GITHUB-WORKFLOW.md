# GitHub Workflow - Agile Process

## Overview
We use GitHub Projects with Kanban methodology for agile project management.

## Project Board Structure

### Columns
```
┌─────────────┬─────────────┬─────────────┬─────────────┬──────────┐
│  Backlog    │    Ready    │ In Progress │  In Review  │   Done   │
└─────────────┴─────────────┴─────────────┴─────────────┴──────────┘
```

**Backlog** - Ideas and future work, not yet planned
- No priority assigned
- May or may not be done
- Rough descriptions okay

**Ready** - Planned for current sprint/milestone
- Detailed requirements
- Acceptance criteria defined
- Assigned to milestone
- Ready to be picked up

**In Progress** - Actively being worked on
- Assigned to developer
- Branch created
- TDD cycle in progress

**In Review** - Pull Request opened
- Code complete
- Tests passing
- Awaiting code review

**Done** - Merged and released
- PR merged to develop/main
- Included in release
- Archived after milestone

---

## Issue Types

### Epic
Large feature spanning multiple stories/tasks.

**Template:**
```markdown
## Epic: [Epic Name]

### Description
High-level description of the feature/domain

### Goals
- Goal 1
- Goal 2

### User Stories
- [ ] #123 - User story 1
- [ ] #124 - User story 2

### Technical Tasks
- [ ] #125 - Task 1
- [ ] #126 - Task 2

### Definition of Done
- [ ] All stories complete
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Released in version X.Y.Z

### Estimation
[Estimate in story points or time]
```

**Example:**
```markdown
## Epic: Document Domain Implementation

### Description
Implement the core Document Domain with entities, value objects, and schema validation.

### Goals
- Create immutable document structure
- Implement schema-based validation
- Support node and mark types

### User Stories
- [ ] #10 - As a developer, I want to create documents with nodes
- [ ] #11 - As a developer, I want to validate documents against schemas

### Technical Tasks
- [ ] #12 - Implement Node entity
- [ ] #13 - Implement NodeType value object
- [ ] #14 - Implement Schema service
- [ ] #15 - Add comprehensive tests

### Definition of Done
- [ ] All entities/VOs implemented with tests
- [ ] Schema validation working
- [ ] 90%+ test coverage
- [ ] API documentation complete

Labels: `epic`, `domain:document`, `priority:high`
Milestone: v0.1.0 - Core Foundation
```

---

### User Story
Feature from user perspective.

**Template:**
```markdown
## User Story: [Title]

### As a [user type]
I want to [action]
So that [benefit]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Technical Notes
[Implementation hints, related code, etc.]

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests (if applicable)

### Definition of Done
- [ ] Acceptance criteria met
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Merged to develop
```

**Example:**
```markdown
## User Story: Create Editor with Extensions

### As a developer
I want to create an editor instance with custom extensions
So that I can build a rich text editor with specific features

### Acceptance Criteria
- [ ] Can instantiate Editor with array of extensions
- [ ] Extensions are registered in correct order
- [ ] Extension hooks are called at appropriate times
- [ ] Can access extension API from editor instance

### Technical Notes
- Use ExtensionRegistry for management
- Follow builder pattern for API
- Support lazy loading of extensions

### Testing
- [ ] Unit tests for ExtensionRegistry
- [ ] Integration tests for Editor + Extensions
- [ ] E2E test for extension functionality in browser

### Definition of Done
- [ ] API implemented
- [ ] All tests passing
- [ ] Documentation with examples
- [ ] Code reviewed and merged

Labels: `story`, `domain:extension`, `priority:high`
Epic: #5
Milestone: v0.2.0 - Extension System
```

---

### Task
Technical implementation work.

**Template:**
```markdown
## Task: [Task Name]

### Description
What needs to be done

### Implementation Details
- Step 1
- Step 2
- Step 3

### Related Issues
- Related to #123
- Blocks #456

### Checklist
- [ ] Implementation complete
- [ ] Tests written (TDD)
- [ ] Tests passing
- [ ] Code documented
- [ ] PR opened
```

**Example:**
```markdown
## Task: Implement Node Entity with TDD

### Description
Create the Node entity class in Document Domain following TDD approach.

### Implementation Details
1. Write tests for Node creation
2. Write tests for Node validation
3. Write tests for Node equality
4. Implement minimal Node class
5. Refactor for type safety

### TDD Checklist
- [ ] RED: Test for Node instantiation
- [ ] GREEN: Minimal Node class
- [ ] REFACTOR: Add type safety
- [ ] RED: Test for invalid node
- [ ] GREEN: Add validation
- [ ] REFACTOR: Clean up error messages

### Files to Create
- `src/document/entities/Node.ts`
- `tests/unit/document/Node.spec.ts`

### Acceptance Criteria
- [ ] Node can be created with type and content
- [ ] Node validates type and content
- [ ] 100% test coverage
- [ ] Follows DDD entity pattern

Labels: `task`, `domain:document`, `tdd`
Epic: #5
User Story: #10
```

---

### Bug
Something broken that needs fixing.

**Template:**
```markdown
## Bug: [Bug Description]

### Description
Clear description of the bug

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Environment
- OS: [e.g., macOS 14]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
- Package version: [e.g., @helix/core@0.1.0]

### Screenshots/Logs
[If applicable]

### Possible Fix
[If you have ideas]

Labels: `bug`, `priority:high`
```

---

## Labels

### Type Labels
- `epic` - Large feature
- `story` - User story
- `task` - Technical task
- `bug` - Something broken
- `enhancement` - Improvement to existing feature
- `docs` - Documentation only
- `refactor` - Code refactoring

### Domain Labels
- `domain:document` - Document Domain
- `domain:editor` - Editor Domain
- `domain:extension` - Extension Domain
- `domain:serialization` - Serialization Domain

### Priority Labels
- `priority:critical` - Blocking, needs immediate attention
- `priority:high` - Important, next to work on
- `priority:medium` - Should be done soon
- `priority:low` - Nice to have

### Status Labels
- `status:blocked` - Blocked by another issue
- `status:needs-review` - Needs code review
- `status:needs-info` - Needs more information
- `status:wip` - Work in progress

### Technical Labels
- `tdd` - Test-driven development
- `performance` - Performance related
- `security` - Security related
- `breaking-change` - Breaking API change

---

## Milestones

### v0.1.0 - Core Foundation
**Goal:** Basic document and editor functionality
**Due:** [Date]

**Issues:**
- Epic: Document Domain Implementation
- Epic: Editor Domain Implementation
- Story: Create basic editor instance
- Story: Handle document transactions

---

### v0.2.0 - Extension System
**Goal:** Plugin architecture and basic extensions
**Due:** [Date]

**Issues:**
- Epic: Extension Domain Implementation
- Story: Bold extension
- Story: Italic extension
- Story: Link extension

---

### v0.3.0 - React Binding
**Goal:** React integration
**Due:** [Date]

**Issues:**
- Epic: React Binding Implementation
- Story: useEditor hook
- Story: EditorContent component

---

### v1.0.0 - First Stable Release
**Goal:** Production-ready release
**Due:** [Date]

**Issues:**
- All critical bugs fixed
- Documentation complete
- E2E tests passing
- Performance optimized

---

## Workflow Process

### 1. Planning
- Groom backlog weekly
- Break epics into stories/tasks
- Assign to milestones
- Move to "Ready" when detailed enough

### 2. Working on Issue
- Assign yourself
- Move to "In Progress"
- Create feature branch: `feature/issue-123-description`
- Follow TDD: Write test → Implement → Refactor
- Commit frequently with descriptive messages
- Reference issue in commits: `feat: implement Node entity (#123)`

### 3. Creating Pull Request
- Push branch to GitHub
- Create PR to `develop` branch
- Link to issue: "Closes #123"
- Move issue to "In Review"
- Fill out PR template:

```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] All tests passing locally

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added for new functionality
- [ ] All tests passing
```

### 4. Code Review
- Request review from team member
- Address feedback
- Make changes if needed
- Re-request review

### 5. Merging
- All checks must pass (CI)
- At least 1 approval required
- Squash and merge to `develop`
- Delete feature branch
- Issue automatically moves to "Done"

---

## Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Build process, dependencies, etc.

### Examples
```
feat(document): implement Node entity (#123)

- Add Node class with type and content
- Implement validation logic
- Add comprehensive tests with TDD approach

Closes #123
```

```
fix(editor): prevent crash on empty selection (#145)

Selection was undefined when document was empty,
causing TypeError in transaction handler.

Fixes #145
```

```
docs(readme): add installation instructions

Add step-by-step guide for installing packages
```

---

## Project Board Automation

### Automatic Movements
- Issue created → Backlog
- Issue assigned to milestone → Ready
- PR opened → In Review
- PR merged → Done

### Manual Movements
- Backlog → Ready (when planning)
- Ready → In Progress (when starting work)

---

## Sprint Planning (Optional)

### 2-Week Sprints
- **Monday Week 1**: Sprint planning
  - Review backlog
  - Estimate stories
  - Commit to sprint backlog
  - Move to "Ready"

- **Friday Week 2**: Sprint review
  - Demo completed work
  - Move unfinished to next sprint
  - Retrospective

---

## Issue Estimation

### Story Points (Fibonacci)
- **1** - Trivial, < 1 hour
- **2** - Simple, 1-2 hours
- **3** - Small, half day
- **5** - Medium, 1 day
- **8** - Large, 2-3 days
- **13** - Very large, consider splitting
- **21+** - Too large, must split

### T-Shirt Sizes (Alternative)
- **XS** - Trivial
- **S** - Small
- **M** - Medium
- **L** - Large
- **XL** - Very large, split it

---

## For Claude Code

### When starting new work:
1. Check "Ready" column for highest priority
2. Assign issue to yourself
3. Move to "In Progress"
4. Create feature branch
5. Follow TDD process
6. Reference issue in commits

### When blocked:
1. Add `status:blocked` label
2. Comment what's blocking
3. Link blocking issue if exists
4. Move back to "Ready" if needed

### When complete:
1. Ensure all acceptance criteria met
2. All tests passing
3. Create PR with issue reference
4. Request review
5. Address feedback promptly

### Best practices:
- ✅ Keep issues updated with progress
- ✅ Break large issues into smaller ones
- ✅ Link related issues
- ✅ Use labels consistently
- ✅ Comment on blockers immediately
- ❌ Don't work on unassigned issues
- ❌ Don't skip issue tracking
- ❌ Don't leave stale PRs open
