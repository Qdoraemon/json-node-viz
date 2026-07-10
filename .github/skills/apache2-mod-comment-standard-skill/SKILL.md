---
name: apache2-mod-comment-standard-skill
description: 'Use for legal-safe repo edits: preserve LICENSE files and original copyright notices, add Apache 2.0 style header or attribution comments when modifying source files, and avoid deleting or weakening copyright/legal text.'
user-invocable: true
---

# Apache 2.0 Comment and License Guard

## When to Use
- Editing existing source files that are derived from an Apache 2.0 or similarly licensed project
- Adding, replacing, or removing brand text, legal text, copyright notices, or file headers
- Refactoring files that already contain attribution or licensing notes

## Rules
- Never delete or overwrite `LICENSE`, `NOTICE`, or equivalent copyright files unless the user explicitly requests it.
- Preserve existing copyright lines and upstream attribution in every modified file.
- When adding a new file or heavily rewriting an existing one, include a concise copyright or attribution comment if the repository already uses such headers.
- Do not remove legal text, trademark notices, or attribution text from documentation, UI copy, or metadata.
- If a file already has a copyright header, keep it intact and append only what is needed.

## Workflow
1. Check whether the target file already contains a copyright or license header.
2. Check whether the repository has a top-level `LICENSE` or `NOTICE` file.
3. Preserve all upstream legal text when editing.
4. Add or retain attribution in the same style as the surrounding file.
5. If a request conflicts with license preservation, stop and ask for confirmation.

## Notes
- This skill is for compliance and attribution hygiene only.
- It must not be used to remove license text, rebrand upstream code, or obscure provenance.