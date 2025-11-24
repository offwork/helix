# CI/CD - Continuous Integration & Deployment

## Overview
Automated pipeline using GitHub Actions with Nx Cloud for intelligent caching and task distribution.

## Pipeline Stages

### 1. Code Quality Check
- Linting (ESLint)
- Formatting (Prettier)
- Type checking (tsc)

### 2. Testing
- Unit tests (Vitest)
- Integration tests (Vitest)
- E2E tests (Playwright)

### 3. Build
- Build all packages
- Generate type declarations
- Bundle for distribution

### 4. Publish
- Publish to npm (on version tags)
- Generate changelog
- Create GitHub release

---

## GitHub Actions Workflows

### Main CI Workflow (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Needed for Nx affected
      
      - uses: pnpm/action-setup@v2
        with:
          version: latest # Latest stable
      
      - uses: actions/setup-node@v4
        with:
          node-version: lts/* # Check Nx compatibility matrix
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm nx affected -t lint --base=origin/main
      
      - name: Format check
        run: pnpm prettier --check .
      
      - name: Type check
        run: pnpm nx affected -t type-check --base=origin/main

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: pnpm/action-setup@v2
        with:
          version: latest # Latest stable
      
      - uses: actions/setup-node@v4
        with:
          node-version: lts/* # Check Nx compatibility matrix
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        run: pnpm nx affected -t test --base=origin/main --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: latest # Latest stable
      
      - uses: actions/setup-node@v4
        with:
          node-version: lts/* # Check Nx compatibility matrix
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Install Playwright browsers
        run: pnpm playwright install --with-deps
      
      - name: Build packages
        run: pnpm nx affected -t build --base=origin/main
      
      - name: Run E2E tests
        run: pnpm nx e2e e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: e2e/playwright-report

  build:
    runs-on: ubuntu-latest
    needs: [quality, test]
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: pnpm/action-setup@v2
        with:
          version: latest # Latest stable
      
      - uses: actions/setup-node@v4
        with:
          node-version: lts/* # Check Nx compatibility matrix
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build all packages
        run: pnpm nx affected -t build --base=origin/main
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

### Release Workflow (.github/workflows/release.yml)

```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

permissions:
  contents: write
  packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: pnpm/action-setup@v2
        with:
          version: latest # Latest stable
      
      - uses: actions/setup-node@v4
        with:
          node-version: lts/* # Check Nx compatibility matrix
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build all packages
        run: pnpm nx run-many -t build
      
      - name: Run tests
        run: pnpm nx run-many -t test
      
      - name: Publish to npm
        run: pnpm nx release publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Create GitHub Release
        uses: ncipollo/release-action@v1
        with:
          generateReleaseNotes: true
          artifacts: 'dist/**/*'
```

### Version Workflow (.github/workflows/version.yml)

```yaml
name: Version

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version bump type'
        required: true
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - uses: pnpm/action-setup@v2
        with:
          version: latest # Latest stable
      
      - uses: actions/setup-node@v4
        with:
          node-version: lts/* # Check Nx compatibility matrix
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
      
      - name: Version bump
        run: |
          pnpm nx release version ${{ github.event.inputs.version }}
          pnpm nx release changelog
      
      - name: Push changes
        run: |
          git push
          git push --tags
```

---

## Nx Cloud Integration

### Setup
```bash
# Connect to Nx Cloud
nx connect-to-nx-cloud
```

### Benefits
- **Remote Caching**: Share build/test results across team and CI
- **Distributed Task Execution**: Run tasks in parallel across machines
- **Task Analytics**: Visualize build performance

### Configuration (nx.json)
```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-cloud",
      "options": {
        "cacheableOperations": ["build", "test", "lint", "type-check"],
        "accessToken": "YOUR_NX_CLOUD_TOKEN"
      }
    }
  }
}
```

### Free Tier
- Up to 500 hours/month of remote caching
- Sufficient for small teams

---

## Branch Strategy

### Main Branches
- **main** - Production-ready code, stable releases
- **develop** - Integration branch for features

### Feature Branches
- `feature/bold-extension`
- `feature/react-binding`
- `fix/schema-validation`

### Workflow
1. Create feature branch from `develop`
2. Implement feature with TDD
3. Create Pull Request to `develop`
4. CI runs automatically
5. Code review + approval
6. Merge to `develop`
7. Periodic releases from `develop` → `main`

---

## Pull Request Checks

Every PR must pass:
- ✅ Linting
- ✅ Type checking
- ✅ Unit tests
- ✅ Integration tests
- ✅ Build succeeds
- ✅ Code review (1 approval minimum)

E2E tests run on:
- PRs to `main`
- Scheduled (nightly)

---

## Versioning Strategy

### Semantic Versioning (semver)
- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes

### Release Process
1. Decide version bump (major/minor/patch)
2. Run version workflow (manual trigger)
3. Creates commit with version updates
4. Creates git tag (v1.2.3)
5. Push triggers release workflow
6. Publishes to npm
7. Creates GitHub release

### Pre-releases
- **Alpha**: `1.0.0-alpha.1` (very unstable)
- **Beta**: `1.0.0-beta.1` (feature complete, testing)
- **RC**: `1.0.0-rc.1` (release candidate)

### Version Management with Nx Release

```bash
# Bump version
pnpm nx release version patch

# Generate changelog
pnpm nx release changelog

# Publish (CI does this)
pnpm nx release publish
```

---

## npm Publishing

### Package Scope
All packages published under `@helix` scope:
- `@helix/core`
- `@helix/extension-bold`
- `@helix/react`
- etc.

### npm Configuration (.npmrc)
```
@helix:registry=https://registry.npmjs.org/
access=public
```

### What Gets Published
Only `dist/` folder:
```json
{
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

### npm Token
Stored as GitHub secret: `NPM_TOKEN`

---

## Environment Variables

### GitHub Secrets
- `NPM_TOKEN` - npm publishing
- `NX_CLOUD_TOKEN` - Nx Cloud access
- `CODECOV_TOKEN` - Coverage reporting

### Local Development
`.env.local` (gitignored):
```
NX_CLOUD_TOKEN=your-local-token
```

---

## Monitoring and Alerts

### GitHub Status Checks
- All workflows show up as status checks on PRs
- Branch protection requires passing checks

### Nx Cloud Dashboard
- View build times
- Identify slow tasks
- Track cache hit rates
- Monitor CI performance

### npm Package Health
- Download stats
- Bundle size tracking
- Dependency vulnerabilities (Dependabot)

---

## Deployment Targets

### npm Registry
- Primary distribution method
- Public packages
- Automatic via CI

### GitHub Packages (optional)
- Backup registry
- Private alpha/beta releases

### Documentation Site (future)
- Deployed on Vercel/Netlify
- Auto-deploy from `main`

---

## Performance Optimization

### Nx Affected
Only runs tasks for changed packages:
```bash
# Instead of testing everything
nx run-many -t test

# Only test affected
nx affected -t test --base=origin/main
```

### Caching Strategy
- Local cache: `.nx/cache`
- Remote cache: Nx Cloud
- Cache keys based on:
  - Source code
  - Dependencies
  - Configuration

### Parallel Execution
```json
{
  "parallel": 3  // Run up to 3 tasks in parallel
}
```

---

## Troubleshooting CI

### Common Issues

**Tests fail in CI but pass locally**
- Check Node version (should match CI)
- Clear Nx cache: `nx reset`
- Check for race conditions in tests

**Build fails with "out of memory"**
- Increase Node memory: `NODE_OPTIONS=--max_old_space_size=4096`
- Split large builds

**E2E tests timeout**
- Increase timeout in Playwright config
- Check if browsers installed correctly
- Run in headed mode locally to debug

**npm publish fails**
- Verify NPM_TOKEN is valid
- Check package.json version is unique
- Ensure clean build

---

## For Claude Code

### Before pushing code:
```bash
# Run quality checks locally
pnpm nx affected -t lint
pnpm nx affected -t test
pnpm nx affected -t build
```

### When CI fails:
1. Check workflow logs in GitHub Actions tab
2. Reproduce locally with same commands
3. Fix issue
4. Push again

### When releasing:
1. Ensure all tests pass on `develop`
2. Trigger version workflow (manual)
3. Verify tag created
4. Check npm publish succeeded
5. Announce release

### Best practices:
- ✅ Run tests before pushing
- ✅ Use feature branches
- ✅ Keep PRs focused and small
- ✅ Write meaningful commit messages
- ✅ Update CHANGELOG for notable changes
- ❌ Don't skip CI checks
- ❌ Don't commit directly to main
- ❌ Don't publish manually (let CI do it)
