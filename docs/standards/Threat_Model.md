# OWASP Top 10 Threat Model & Architectural Risk Evaluation

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Technical Threat Model, STRIDE Evaluation & Security Mitigations  
**Author:** Lead Application Security Engineer & Threat Modeler  
**Status:** Approved for Implementation  

---

## 1. Threat Matrix & OWASP Vulnerability Mitigations

| Threat Vector | Attack Scenario | Risk Level | Architectural Mitigation |
| :--- | :--- | :--- | :--- |
| **Prompt Injection** | User uploads CSV containing prompt instructions to reveal salary data. | High | RLS data filtering runs BEFORE AI context assembly; LLM input wrapped in anti-injection delimiters. |
| **Session Hijacking** | Malicious script steals session token from browser. | Critical | Store refresh token in `HttpOnly` cookie inaccessible to JavaScript. Short-lived 15-min JWT. |
| **Bypass RLS** | Attacker calls `/api/finance-records` bypassing UI role check. | Critical | Engine-Level PostgreSQL Row Level Security (RLS) policies evaluate `app.current_tenant_id` on every query. |
| **Brute Force Login** | Automated bot attempts password dictionary attack. | High | Redis rate-limiting (5 requests / 15 mins) + 15-minute account lockout after 5 consecutive failures. |
