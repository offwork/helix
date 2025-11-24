# TODO & Future Considerations

## Deferred Decisions
These topics were identified during architecture planning but are deferred for later implementation.

---

## 1. Error Handling Strategy

### TODO
- [ ] Define custom error classes hierarchy
- [ ] Error boundary implementation for React binding
- [ ] Error recovery strategies
- [ ] User-facing error messages (i18n?)

### Considerations
```typescript
// Potential error hierarchy
class EditorError extends Error {}
class ValidationError extends EditorError {}
class SerializationError extends EditorError {}
class ExtensionError extends EditorError {}

// Error recovery
interface ErrorRecovery {
  canRecover(error: EditorError): boolean
  recover(error: EditorError): void
}
```

### Decision Point
- Milestone: v0.4.0
- When: After core domains are stable

---

## 2. Logging & Monitoring

### TODO
- [ ] Define logging interface
- [ ] Implement logging levels (debug, info, warn, error)
- [ ] Production monitoring strategy
- [ ] Performance metrics collection
- [ ] Error tracking (Sentry? LogRocket?)

### Considerations
```typescript
// Logging interface
interface Logger {
  debug(message: string, context?: object): void
  info(message: string, context?: object): void
  warn(message: string, context?: object): void
  error(message: string, error?: Error, context?: object): void
}

// Usage
this.logger.debug('Creating node', { type, content })
```

### Decision Point
- Milestone: v0.5.0
- When: Before production release

---

## 3. Performance Optimization

### TODO
- [ ] Bundle size analysis and optimization
- [ ] Lazy loading strategy for extensions
- [ ] Virtual scrolling for large documents
- [ ] Web Worker for heavy computations
- [ ] Memory profiling and optimization
- [ ] Render optimization (React.memo, Vue computed)

### Considerations
- Target bundle size: < 50KB for core (gzipped)
- Extensions should be tree-shakeable
- Consider code splitting for bindings
- Profile with Chrome DevTools

### Decision Point
- Ongoing optimization
- Critical before v1.0.0

---

## 4. Security

### TODO
- [ ] XSS prevention in serialization
- [ ] Content Security Policy recommendations
- [ ] Sanitization strategy for HTML parsing
- [ ] Secure file upload (for image extension)
- [ ] Input validation best practices

### Considerations
```typescript
// Sanitization in HTML parser
const sanitize = (html: string): string => {
  // Use DOMPurify or similar
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href']
  })
}
```

### Decision Point
- Milestone: v0.6.0
- Critical before v1.0.0

---

## 5. Accessibility (a11y)

### TODO
- [ ] Keyboard navigation
- [ ] Screen reader support (ARIA attributes)
- [ ] Focus management
- [ ] High contrast mode support
- [ ] Reduced motion support
- [ ] a11y testing with axe-core

### Considerations
- WCAG 2.1 Level AA compliance
- Keyboard shortcuts should be configurable
- Alternative text for images
- Semantic HTML structure

### Decision Point
- Milestone: v0.7.0
- Essential for enterprise adoption

---

## 6. Internationalization (i18n)

### TODO
- [ ] Decide on i18n library (i18next? vue-i18n?)
- [ ] Extract all user-facing strings
- [ ] RTL (Right-to-Left) support
- [ ] Date/time formatting
- [ ] Number formatting
- [ ] Pluralization rules

### Considerations
```typescript
// Potential i18n usage
editor.i18n.t('errors.validation.required', { field: 'type' })
// → "Type is required" (en)
// → "Type gereklidir" (tr)
```

### Decision Point
- Milestone: v0.8.0
- Important for global adoption

---

## 7. Browser Compatibility

### TODO
- [ ] Define exact browser support matrix
- [ ] Polyfills strategy (if needed)
- [ ] Testing in all target browsers
- [ ] Fallback for older browsers
- [ ] Mobile browser testing (iOS Safari, Chrome Mobile)

### Current Target
- Chrome/Edge 88+
- Firefox 89+
- Safari 14.1+
- No IE11

### Decision Point
- Continuous testing
- Refine before v1.0.0

---

## 8. Documentation Strategy

### TODO
- [ ] API documentation tool (TypeDoc?)
- [ ] User guides and tutorials
- [ ] Live examples/playground
- [ ] Migration guides (for breaking changes)
- [ ] Architecture decision records (ADR)
- [ ] Video tutorials?

### Considerations
- Docusaurus for documentation site?
- Storybook for component examples?
- CodeSandbox for live demos

### Decision Point
- Start: v0.5.0
- Critical for v1.0.0

---

## 9. Release Strategy

### TODO
- [ ] Define semver policy
- [ ] Breaking change communication
- [ ] Deprecation warnings
- [ ] Long-term support (LTS) versions?
- [ ] Beta/Alpha release process
- [ ] Upgrade guides

### Considerations
```typescript
// Deprecation example
/** @deprecated Use newMethod() instead. Will be removed in v2.0.0 */
export function oldMethod() {
  console.warn('oldMethod is deprecated, use newMethod')
  return newMethod()
}
```

### Decision Point
- Define before v1.0.0
- Document in CONTRIBUTING.md

---

## 10. Migration Path for Breaking Changes

### TODO
- [ ] Automatic migration scripts (codemods?)
- [ ] Version compatibility matrix
- [ ] Clear upgrade guides
- [ ] Support for previous major version (how long?)

### Considerations
- Provide CLI tool for migrations?
- Document every breaking change
- Give advance notice (deprecation warnings)

### Decision Point
- Before first breaking change (v2.0.0)

---

## 11. Collaborative Editing

### TODO (Future Feature)
- [ ] Conflict resolution strategy (OT? CRDT?)
- [ ] WebSocket integration
- [ ] User presence indicators
- [ ] Cursor positions
- [ ] Real-time synchronization
- [ ] Offline support

### Considerations
- This is a major feature, likely v2.0.0+
- Requires significant architecture changes
- Consider Yjs integration (like TipTap does)

### Decision Point
- Future major version (v2.0.0+)

---

## 12. Plugin Marketplace

### TODO (Future Feature)
- [ ] Plugin registry
- [ ] Plugin versioning
- [ ] Community plugins
- [ ] Plugin review process
- [ ] Monetization strategy for plugin authors?

### Considerations
- Similar to VS Code marketplace
- Quality control for plugins
- Licensing considerations

### Decision Point
- Post v1.0.0
- Community-driven

---

## 13. Mobile Support

### TODO (Future Feature)
- [ ] Touch interactions
- [ ] Mobile keyboard handling
- [ ] Virtual keyboard positioning
- [ ] Mobile-specific extensions (camera, voice input?)
- [ ] React Native binding?

### Considerations
- Current focus is desktop web
- Mobile web support should work
- Native mobile (iOS/Android) is future consideration

### Decision Point
- Post v1.0.0
- If there's demand

---

## 14. AI Integration

### TODO (Future Feature)
- [ ] AI-powered autocomplete
- [ ] Grammar/spell checking
- [ ] Content suggestions
- [ ] Smart formatting
- [ ] Text generation

### Considerations
- Could be separate extension
- Privacy concerns (send content to AI?)
- Local vs cloud AI

### Decision Point
- Post v1.0.0
- Experimental extension first

---

## 15. Advanced Extensions

### TODO (Future Extensions)
- [ ] Table extension
- [ ] Code block with syntax highlighting
- [ ] Math equations (LaTeX?)
- [ ] Mentions (@user)
- [ ] Emoji picker
- [ ] File attachments
- [ ] Embeds (YouTube, Twitter, etc.)
- [ ] Charts and diagrams
- [ ] Inline comments/suggestions

### Decision Point
- After core extensions (bold, italic, link, image)
- Community contributions welcome

---

## 16. Testing Infrastructure

### TODO
- [ ] Visual regression testing (Percy? Chromatic?)
- [ ] Performance regression testing
- [ ] Load testing
- [ ] Accessibility testing automation
- [ ] Cross-browser testing (BrowserStack?)
- [ ] Mutation testing?

### Decision Point
- Continuous improvement
- Critical infrastructure before v1.0.0

---

## 17. Developer Experience

### TODO
- [ ] Better error messages
- [ ] Development mode warnings
- [ ] Hot module replacement (HMR) support
- [ ] TypeScript strict mode compliance
- [ ] Better debugging tools
- [ ] Extension development kit (SDK?)

### Decision Point
- Continuous improvement
- Feedback-driven

---

## 18. Commercial Features

### TODO (Post v1.0.0)
- [ ] Define premium extension licensing
- [ ] Implement license key verification
- [ ] Build Helix Cloud infrastructure
- [ ] Create pricing tiers and plans
- [ ] Develop billing system
- [ ] Build customer dashboard

### Business Model: Open-Core (Inspired by TipTap)

**Free Forever (MIT):**
```
@helix/core
@helix/extension-bold
@helix/extension-italic
@helix/extension-link
@helix/extension-image
@helix/extension-heading
@helix/extension-list
@helix/extension-blockquote
@helix/react
@helix/vue
@helix/vanilla
```

**Premium Extensions (Commercial License):**
```
@helix/extension-ai              - AI-powered autocomplete, grammar, rewriting
@helix/extension-collaboration   - Real-time multi-user editing with cursors
@helix/extension-comments        - Inline comments and suggestions
@helix/extension-analytics       - Usage tracking and insights
@helix/extension-version-history - Document versioning and restore
@helix/extension-mentions        - @user mentions with autocomplete
@helix/extension-slash-commands  - Advanced /command palette
```

### Helix Cloud (SaaS)
**Features:**
- Managed hosting infrastructure
- Real-time sync (WebSocket backend)
- Document storage
- Automatic scaling
- CDN for assets and uploads
- User authentication (optional)
- Usage analytics dashboard
- Uptime monitoring

**Pricing Tiers (Draft):**

**Free Tier:**
- Self-hosted everything
- Unlimited documents
- Community support (GitHub)

**Starter ($49/month):**
- 500 cloud documents
- Basic collaboration
- Email support
- Up to 5 developer seats

**Business ($499/month):**
- 5,000 cloud documents
- All premium extensions
- Priority support
- Up to 25 developer seats
- Webhook integrations
- Custom branding

**Enterprise (Custom):**
- Unlimited documents
- On-premise deployment option
- Dedicated support engineer
- SLA guarantees
- Custom integrations
- Training and onboarding
- Source code access (optional)

### Pricing Philosophy
**Based on TipTap's model:**
- Only cloud-hosted documents count toward limits
- Self-hosted deployments are unlimited and free
- Pay for features you use
- Developer seat-based licensing
- Transparent, predictable pricing

### Monetization Streams
1. **Premium Extensions** - License fees
2. **Helix Cloud** - SaaS subscription
3. **Enterprise Support** - Custom support packages
4. **Custom Development** - Bespoke extension development
5. **Training & Consulting** - Implementation services

### License Verification
```typescript
// Premium extensions check license
import { verifyLicense } from '@helix/license'

const aiExtension = new AIExtension({
  licenseKey: process.env.HELIX_LICENSE_KEY
})

// Free extensions work without license
const boldExtension = new BoldExtension()
```

### Self-Hosted Collaboration Backend
Like TipTap's Hocuspocus, provide open-source backend:
```
@helix/collab-server (MIT)
- WebSocket server
- Operational Transformation (OT) or CRDT
- Node.js based
- Redis for scaling
- PostgreSQL for persistence
```

Users can:
- Self-host for free (unlimited)
- Use Helix Cloud for managed solution (paid)

### Decision Point
- After v1.0.0
- Based on adoption

---

## Prioritization Framework

### Must Have (v1.0.0)
- ✅ Core domains implemented
- ✅ Basic extensions
- ✅ Framework bindings
- ✅ Comprehensive tests
- ✅ Basic documentation
- 🔲 Security (XSS prevention)
- 🔲 Performance optimization
- 🔲 Error handling

### Should Have (v1.x)
- 🔲 Accessibility
- 🔲 Advanced documentation
- 🔲 Logging/monitoring
- 🔲 More extensions

### Nice to Have (v2.0+)
- 🔲 Collaborative editing
- 🔲 i18n
- 🔲 AI features
- 🔲 Mobile native
- 🔲 Plugin marketplace

---

## For Claude Code

### When a TODO becomes relevant:
1. Create GitHub issue
2. Add to appropriate milestone
3. Follow TDD process
4. Update this document when completed

### Adding new TODOs:
1. Add to this document under appropriate section
2. Link to related issues if exist
3. Estimate milestone/priority

### Reviewing TODOs:
- Quarterly review of priorities
- Adjust based on user feedback
- Don't gold-plate - ship iteratively

Remember: Done is better than perfect. Ship v1.0.0 with core features, iterate based on real usage.
