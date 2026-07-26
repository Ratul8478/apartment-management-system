# Enterprise Change Management Policy — FinTrack Pro

## 1. Risk Classification Framework

- **Standard Change (Low Risk)**: Routine dependency patch, non-critical documentation update, UI styling fix. Pre-approved via CI pipeline.
- **Normal Change (Medium/High Risk)**: Schema modification, new API endpoint, authentication refactor, billing logic update. Requires CAB review and staging validation.
- **Emergency Change (Critical Risk)**: Active production outage, zero-day security vulnerability. Fast-tracked approval by CTO + SRE Lead with post-mortem within 24 hours.

---

## 2. Change Ticket Lifecycle

```
[Draft Request] -> [Impact Assessment] -> [CAB Approval] -> [Staging Verification] -> [Production Deployment] -> [Post-Implementation Review (PIR)]
```

---
