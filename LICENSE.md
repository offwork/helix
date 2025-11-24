# Helix License

Helix uses a **dual-licensing model** with different licenses for different packages.

---

## Open Source Packages (MIT License)

The following packages are licensed under the **MIT License** and are free to use:

### Core
- `@helix/core` - Core editor engine

### Basic Extensions
- `@helix/extension-bold`
- `@helix/extension-italic`
- `@helix/extension-underline`
- `@helix/extension-strike`
- `@helix/extension-link`
- `@helix/extension-image`
- `@helix/extension-heading`
- `@helix/extension-paragraph`
- `@helix/extension-list`
- `@helix/extension-blockquote`
- `@helix/extension-code`
- `@helix/extension-horizontal-rule`

### Framework Bindings
- `@helix/react`
- `@helix/vue`
- `@helix/vanilla`

### Collaboration Backend (Self-Hosted)
- `@helix/collab-server` - Open source collaboration server

---

## MIT License Text

```
MIT License

Copyright (c) 2025 Helix Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Premium Packages (Commercial License)

The following packages require a **Commercial License** (available post v1.0.0):

### Premium Extensions
- `@helix/extension-ai` - AI-powered features
- `@helix/extension-collaboration` - Advanced real-time collaboration
- `@helix/extension-comments` - Inline comments and suggestions
- `@helix/extension-analytics` - Usage tracking and insights
- `@helix/extension-version-history` - Document versioning
- `@helix/extension-mentions` - @user mentions
- `@helix/extension-slash-commands` - Advanced command palette

### Helix Cloud
- `@helix/cloud` - Managed cloud infrastructure
- Real-time sync services
- Document storage
- CDN services

### Commercial License Terms

**License Required For:**
- Production use of premium extensions
- Using Helix Cloud services
- Removing license verification

**License NOT Required For:**
- Using open source (MIT) packages
- Development and testing of premium features
- Self-hosted collaboration (using `@helix/collab-server`)

**How to Obtain:**
- Visit [helix.dev/pricing](https://helix.dev/pricing) (coming soon)
- Contact: sales@helix.dev

**Pricing:**
- Starter: ~$49/month
- Business: ~$499/month  
- Enterprise: Custom

**Terms:**
- Subscription-based licensing
- Per-developer seat pricing
- Annual or monthly billing
- 30-day money-back guarantee
- Cancel anytime

---

## Contribution Guidelines

### Contributing to MIT Packages
Contributions to MIT-licensed packages must remain MIT-licensed:
- All PRs to core, basic extensions, and bindings are MIT
- Contributors retain copyright
- Code becomes part of MIT-licensed distribution

### Contributing to Premium Packages
Premium packages are developed internally:
- Community contributions not accepted for premium packages
- Feature requests welcome via GitHub Issues
- Consider contributing to MIT packages instead

### Contributor License Agreement (CLA)
Contributors to MIT packages agree that:
- Their contributions are original work
- They have rights to contribute the code
- Contributions are licensed under MIT
- No patent claims against the project

---

## Third-Party Licenses

Helix depends on the following open source projects:

### ProseMirror (MIT License)
- prosemirror-model
- prosemirror-state
- prosemirror-view
- prosemirror-transform

Copyright by Marijn Haverbeke

### Other Dependencies
See individual package `package.json` files for complete dependency lists and their licenses.

---

## Version History

### v0.1.0 - v0.9.x (Current)
**Everything is MIT licensed and free.**

During the initial development phase, all packages (including future premium features) are released under MIT License to encourage adoption and community feedback.

### v1.0.0+ (Future)
**Dual licensing begins:**
- Core and basic extensions remain MIT (free forever)
- Premium features require commercial license
- Helix Cloud services launch

---

## FAQ

**Q: Can I use Helix in a commercial product?**  
A: Yes! All MIT-licensed packages are free for commercial use. Premium features (post v1.0) require a license.

**Q: Can I self-host everything?**  
A: Yes! The collaboration backend is open source. You only need a license for premium extensions and cloud services.

**Q: What happens if I stop paying?**  
A: Premium extensions stop working. All MIT packages continue working forever. Your data remains yours.

**Q: Can I modify MIT packages?**  
A: Yes! That's the point of open source. Fork, modify, redistribute freely.

**Q: Can I modify premium packages?**  
A: No, they are closed source. But you can request features or build your own extensions.

**Q: Is the pricing final?**  
A: Pricing shown is indicative. Final pricing will be announced at v1.0 launch.

---

## Contact

**General Questions:** hello@helix.dev  
**Sales & Licensing:** sales@helix.dev  
**Security Issues:** security@helix.dev  
**Technical Support:** support@helix.dev

**GitHub:** https://github.com/helix-editor  
**Website:** https://helix.dev (coming soon)

---

**Last Updated:** November 2025  
**License Version:** 1.0
