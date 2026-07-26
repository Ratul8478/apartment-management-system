# Enterprise Secrets Management & Key Rotation Architecture

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Security Architecture Guide  
**Classification:** Enterprise Internal Security Standard  
**Version:** 2.0.0  

---

## 1. Executive Summary & Zero-Trust Secrets Policy

In **FinTrack Pro**, application secrets—including database passwords, AES-256 master encryption keys, JWT signing tokens, OAuth client secrets, SMTP credentials, Cloud Storage access keys, and AI Provider keys (OpenAI / Anthropic)—represent the highest security exposure level. 

FinTrack Pro operates under a mandatory **Zero-Trust & Zero-Secrets-in-Git Policy**:
1. Zero plain-text secrets, private keys, or passwords may EVER be committed to Git repositories or compiled into build artifacts.
2. All non-local production/staging secrets reside exclusively within dedicated Cloud Key Vaults / Secrets Managers (e.g., AWS Secrets Manager, Azure Key Vault, HashiCorp Vault).
3. Secrets are injected dynamically into application container runtimes at startup via IAM role-based authentication over TLS.

---

## 2. Enterprise Secret Classification Matrix

| Secret Category | Target Secrets | Sensitivity Level | Vault Storage Engine | Rotation SLA | Access Scoping |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Master Encryption Keys** | `ENCRYPTION_MASTER_KEY` (AES-256-GCM) | 🔴 CRITICAL | Cloud KMS / HSM Vault | 90 Days | KMS Service Role Only |
| **Database Credentials** | `DATABASE_URL`, `POSTGRES_PASSWORD` | 🔴 CRITICAL | Cloud Secrets Manager | 30 Days (Automated) | Backend Service IAM |
| **Auth & Session Keys** | `NEXTAUTH_SECRET`, `JWT_SECRET` | 🔴 CRITICAL | Cloud Secrets Manager | 60 Days | Auth Handler Service |
| **AI Provider Keys** | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` | 🟠 HIGH | Cloud Secrets Manager | 90 Days | AI Grounding Engine |
| **Storage Credentials** | `AWS_SECRET_ACCESS_KEY`, `S3_KEY` | 🟠 HIGH | IAM Service Role | 60 Days | Storage Adapter |
| **SMTP Credentials** | `SMTP_PASSWORD` | 🟡 MEDIUM | Cloud Secrets Manager | 180 Days | Notification Worker |
| **Telemetry Webhooks** | `ALERT_WEBHOOK_URL` | 🟢 LOW | App Config Parameter Store| On Demand | Observability Logger |

---

## 3. Storage Strategy & Dynamic Runtime Injection

### 1. Cloud Key Vault Dynamic Injection
Production and Staging environments do NOT store static `.env` files on host disks. Application containers fetch secrets dynamically during initialization:

```text
┌───────────────────────────┐     1. IAM Authenticate    ┌───────────────────────────┐
│ Application Container     │ ─────────────────────────► │ Cloud Key Vault / HSM     │
│ (AWS ECS / Azure / K8s)   │ ◄───────────────────────── │ (AWS Secrets Manager)     │
└───────────────────────────┘    2. Inject TLS Secrets   └───────────────────────────┘
```

- **Technical Reasoning:** Eliminates static secret files on server file systems.
- **Security Implications:** Reduces window of exposure if a host filesystem is compromised.
- **Scalability Considerations:** Multi-region container instances retrieve identical secrets securely.
- **Operational Considerations:** Centralizes secret updates without updating individual container images.
- **Maintainability Guidance:** IAM role management replaces manual password distribution.

### 2. CI/CD Pipeline Injection (GitHub Actions)
For automated workflows:
- Pipeline secrets are stored encrypted in GitHub Repository Secrets (`${{ secrets.STAGING_DATABASE_URL }}`).
- Workflows fetch secrets at runtime and inject them into container test runners via environment variables.
- Secret masking is active by default, ensuring secret values are automatically redacted in build console output.

---

## 4. Secret Rotation Strategy

Secret compromise mitigation requires regular, automated credential rotation:

### 1. Automated 30-Day Dual-User Database Credential Rotation
To rotate database credentials without incurring system downtime:
- **Dual-User Architecture:** The PostgreSQL database maintains two administrative users (`db_user_a` and `db_user_b`).
- **Phase 1 (Generate):** Secrets Manager generates a random 64-character password for `db_user_b` and executes `ALTER USER db_user_b WITH PASSWORD '...'` in PostgreSQL.
- **Phase 2 (Update Vault):** Secrets Manager updates the application secret `DATABASE_URL` to point to `db_user_b`.
- **Phase 3 (Rolling Restart):** Application container pools undergo a zero-downtime rolling restart, fetching `db_user_b` credentials.
- **Phase 4 (Revoke Old):** Secrets Manager revokes privileges for `db_user_a` after confirming zero active connections remain on `db_user_a`.

```text
Step 1: Update `db_user_b` password in DB
Step 2: Update `DATABASE_URL` in Secrets Manager
Step 3: Rolling container restart -> App picks up `db_user_b`
Step 4: Revoke `db_user_a` after drain timeout
```

### 2. Emergency Breach Revocation Protocol
In the event of a suspected secret compromise:
1. **Trigger Incident Command:** The Security Engineer executes the emergency revocation CLI script (`scripts/security/revoke-secret.sh --key=JWT_SECRET`).
2. **Instant Vault Overwrite:** Cloud Secrets Manager generates a new 512-bit key.
3. **Container Eviction:** Active application containers receive a SIGTERM signal, triggering instant container restart and secret re-hydration.
4. **Session Invalidation:** All active user JWT sessions are revoked immediately, forcing global re-authentication.

---

## 5. Access Control & Security Auditing Policy

1. **Least-Privilege IAM Scoping:** Container IAM roles permit read access strictly to their own environment path (`fintrack/prod/*` cannot access `fintrack/dev/*`).
2. **KMS Audit Trails:** Every secret retrieval, modification, or rotation event logs an immutable audit event in AWS CloudTrail / Azure Monitor containing timestamp, IP address, caller identity, and action result.
3. **Secret Leakage Prevention:** Pre-commit hooks (`gitleaks`) and GitHub Secret Scanning run automatically to block accidental Git pushes containing private keys or password patterns.

---

## 6. Architectural Evaluation Matrix

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Dimension                 │ Architectural Impact & System Benefit                  │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Technical Reasoning       │ Dynamic IAM-based vault injection removes reliance on  │
│                           │ fragile static config files and hardcoded passwords    │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Security Implications     │ Zero-trust dynamic rotation guarantees stolen credentials│
│                           │ become useless after automated rotation windows        │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Scalability Considerations│ Key Vault APIs scale globally across multi-region      │
│                           │ active-active cloud clusters                           │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Operational Considerations│ Dual-user database rotation enables zero-downtime      │
│                           │ compliance updates without customer disruption         │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Maintainability Guidance  │ Automated Gitleaks pre-commit hooks shield developers  │
│                           │ from accidental secret check-ins                       │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
