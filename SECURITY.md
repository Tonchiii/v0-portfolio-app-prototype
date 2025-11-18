# Security Checklist & Notes

This file captures a set of practical, workshop-aligned hardening steps for this repository.

## Quick checklist (Week 1 — AI Protector Workshop)

- [ ] Node.js and package manager pinned and verified
- [ ] Secrets: ensure any credentials are stored in environment variables and not committed
- [ ] VS Code: recommended security extensions (settings sync off for secrets)
- [ ] Git: commit signing, protected branches for main
- [ ] Basic Security Headers enabled in `middleware.ts`
- [ ] Rate limiting enabled (basic in-memory limiter; replace with Redis/Upstash for prod)
- [ ] Dependabot / CI vulnerability checks (see `.github/workflows/security.yml`)
- [ ] Documentation: this `SECURITY.md` and `ai-protector/notes.md`

## Week 1 deliverable template

Create a Google Doc (or NotebookLM) with:

1. AI Agent (MCP server) security analysis (top 10)
2. Platform security & data residency comparison
3. MCP security & data flow matrix
4. Secure dev environment verification (Node/Git/VS Code/Claude Desktop)
5. Risk assessment & recommendations

Refer to `ai-protector/notes.md` for repo-specific mappings.

## Operational notes

- The middleware includes a conservative Content-Security-Policy; update it if you use external CDNs, analytics, or fonts.
- The rate limiter is in-memory and will not work across multiple server instances. For production use:
  - Use Upstash/Redis and published rate-limiter libraries.
  - Consider Vercel edge/waf or Arcjet firewall for production traffic.

## How to run local checks

Install dependencies (pnpm is used in this project):

pnpm install

Run security audit:

pnpm audit --audit-level=high

CI runs a similar check on each push.

---

If you want, I can expand this file into more prescriptive runbooks (pen-test playbook, incident response runbook, or Arcjet/Vercel allowlist configuration). 
