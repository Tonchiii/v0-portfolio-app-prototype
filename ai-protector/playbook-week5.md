# Week 5 — Penetration Testing Sprint (Playbook)

This playbook documents a safe, repeatable process for performing the Week 5 penetration testing sprint against your local dev instance (or an authorized test target). Do not run these tests against systems you do not own or have explicit permission to test.

Summary
- Target: Local dev server (http://localhost:3000) or specified test host
- Scope: Reconnaissance, scanning, authentication tests, injection testing, WAF checks, logs collection, remediation verification
- Tools: nmap, nikto, sqlmap, OWASP ZAP, Burp Suite, curl, sqlmap, Wireshark (optional)

Safety & rules of engagement
- Only test targets you own or have written permission to test.
- Use a dedicated test account for authentication checks.
- Keep traffic rates reasonable; don't attack production systems.
- Record timestamps and test user identifiers (redact in reports if needed).

Environment setup (local)
1. Ensure dev server is running:

   pnpm dev

2. Ensure you have the tools installed (examples):

   - nmap (https://nmap.org)
   - nikto (https://cirt.net/Nikto2)
   - sqlmap (https://sqlmap.org)
   - OWASP ZAP or Burp Suite

Reconnaissance

1. Quick port/service scan (nmap):

   nmap -sC -sV -oN recon_nmap.txt TARGET

   Notes: -sC runs default scripts; -sV attempts service/version detection.

2. HTTP headers and response:

   curl -I http://TARGET

3. DNS and subdomain discovery (example using amass or dig):

   dig +short TARGET

Scanning

1. Nikto webserver scan:

   nikto -host http://TARGET -output nikto_report.txt

2. OWASP ZAP (passive + active) or Burp Suite scan: run a baseline passive scan while browsing the app, then run active scan on the login and API endpoints.

Authentication & rate-limit tests

1. Manual sign-in test: use the admin sign-in (Clerk) page with a test account; observe network calls in browser DevTools.

2. Rate-limit test (simple script):

   # Example using curl in a loop (do not run at production scale)
   for i in {1..200}; do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://TARGET/sign-in; done

Injection & exploitation

1. SQL injection testing (use sqlmap safely against form endpoints that accept input):

   sqlmap -u "http://TARGET/search?q=testing" --batch --level=2 --risk=1

2. XSS testing: use Burp or manual payloads to test reflected and stored inputs.

Proxy & request inspection

1. Intercept authentication flow with Burp or OWASP ZAP proxy to capture requests to Clerk endpoints and your API endpoints.

Logs & evidence collection

1. Collect server logs corresponding to timestamped tests (from app or drizzle/mock-db logs).
2. Save tool outputs (nmap XML, nikto report, ZAP JSON, Burp exports) into an evidence folder.

Remediation & retest

1. Apply fix (example: tighten CSP, add rate limiting, sanitize inputs).
2. Re-run the exact failing test and capture output to prove remediation.

Reporting

1. For each finding include: title, description, reproduction steps (commands), evidence (screenshots/log extracts), risk (severity), recommended fix, and status.

Appendix — Useful commands

- Save nmap XML for sharing: nmap -sC -sV -oX recon_nmap.xml TARGET
- Save nikto output: nikto -host http://TARGET -output nikto_report.txt
- Export Burp project after testing

---

If you'd like, I can also:
- Generate a Google Doc template pre-filled with headings and placeholders for screenshots.
- Add a reproducible PowerShell script for the reconnaissance and rate-limit testing (safe defaults).
- Scaffold an evidence folder and example output files (placeholders) in the repo.
