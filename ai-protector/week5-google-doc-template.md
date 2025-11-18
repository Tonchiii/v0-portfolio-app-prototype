# Week 5 — Penetration Testing Sprint (Google Doc Template)

Title: Week 5 — Penetration Testing Sprint

Author: [Your Name]
Date: [YYYY-MM-DD]
Target: [localhost:3000 or target domain]

Executive Summary
- Short summary of scope, key findings, and remediation status.

1. Scope & Rules of Engagement
- Target, dates, tools used, and permission statement.

2. Test Environment Setup
- Screenshot: dev_server_running.png
  - Caption: "Local dev server running (pnpm dev)"
- Include exact commands to reproduce environment.

3. Reconnaissance
- Screenshot: recon_nmap_open_ports.png
  - Caption: "Nmap scan showing open ports and services."
- Screenshot: recon_http_headers.png
  - Caption: "HTTP response headers and missing security headers."

4. Vulnerability Scanning
- Screenshot: scan_nikto_report.png
  - Caption: "Nikto scan results and notable findings."
- Screenshot: scan_owasp_zap_passive.png
  - Caption: "OWASP ZAP passive scan alerts."

5. Authentication & Rate-Limit Tests
- Screenshot: auth_login_flow.png
  - Caption: "Admin sign-in UI used for testing."
- Screenshot: rate_limit_block.png
  - Caption: "429 response demonstrating rate limiting."

6. Exploitation Attempts
- For each confirmed issue include:
  - Title
  - Reproduction steps (commands)
  - Evidence screenshot(s)
  - Risk and recommended fix

7. Logs & Evidence
- Screenshot: server_error_log.png
  - Caption: "Server logs correlated to attack timestamps."
- Attach raw output files (nmap XML, nikto report, Burp export).

8. Remediation & Retest
- Screenshot: retest_after_patch.png
  - Caption: "Re-run of the test showing issue is fixed."

9. Executive Recommendations
- High-level actions: patching, WAF rules, incident response improvements.

Appendix: Commands & Tooling
- List the exact commands used for nmap, nikto, sqlmap, curl, and scripts.

---

Instructions:
- Copy this markdown into Google Docs or NotebookLM.
- Replace placeholder filenames with your screenshots and attach raw outputs.
