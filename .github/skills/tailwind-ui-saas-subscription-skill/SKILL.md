---
name: tailwind-ui-saas-subscription-skill
description: 'Use when editing SaaS landing pages, footers, pricing pages, subscription flows, or legal copy. Preserve open-source attribution, keep legal disclaimers visible, and add compliant brand/legal text when replacing footer or pricing content.'
user-invocable: true
---

# SaaS Footer and Subscription Copy Guard

## When to Use
- Editing footer, navbar, pricing, billing, subscription, upgrade, or plan-comparison UI
- Replacing brand links, outbound links, or call-to-action copy
- Updating legal pages, FAQ entries, or open-source attribution text

## Rules
- Keep open-source attribution visible wherever the product brand is presented.
- Do not remove legal notices, copyright statements, or license references from footer or pricing pages.
- When replacing footer or pricing copy, add clear project ownership text and a link to the license or source repository if the product is derived from open-source code.
- If you introduce paid plans, clearly separate marketing copy from legal and attribution text.
- Never remove disclaimers about provenance, licensing, or third-party ownership without explicit approval.

## Workflow
1. Identify whether the edited area is footer, pricing, billing, signup, or legal copy.
2. Keep existing attribution and license links unless the user explicitly approves their removal.
3. Add compliant project-owned branding and a short open-source attribution line.
4. Ensure the final copy is consistent with the repository's license and release model.
5. If a requested change would hide provenance or weaken legal notices, stop and flag it.

## Suggested Copy Pattern
- Brand line: `Built from open-source foundations`
- Legal line: `Licensed under Apache 2.0; see LICENSE for details`
- Footer line: `© [year] [your brand]. Derived from an open-source project; attribution preserved.`