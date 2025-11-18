# AI Protector — Repo Mapping & Notes

This file maps the AI Protector Workshop deliverables to concrete items in this repository.

1. Secure Dev Environment
   - Node/npm/pnpm management: verify local Node version and use pnpm (repo contains `pnpm-lock.yaml`).
   - `.vscode` recommended settings left to the developer (do not commit secrets).

2. Hardened Web App
   - `middleware.ts` now adds common security headers and a basic in-memory rate limiter.
   - Update `Content-Security-Policy` in `middleware.ts` if you use external CDNs.

3. MCP / Arcjet integration
   - `app/api/arcjet/route.ts` is included in the repo. The Arcjet packages are installed.
   - Production Arcjet configuration (firewall rules, allowlists) cannot be applied here; see the `SECURITY.md` and workshop notes for manual steps.

4. CI Security
   - A GitHub Actions workflow `/.github/workflows/security.yml` (added) runs `pnpm audit` on push/PR.

5. Penetration Testing
   - A starter playbook can be added to `ai-protector/playbook.md` on request.

6. Documentation & Deliverables
   - Use `SECURITY.md` as the source of truth for checklist and commands.
