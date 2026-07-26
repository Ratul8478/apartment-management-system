# Enterprise Database Data Dictionary

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Complete Schema Data Dictionary & Column Specifications  
**Author:** Principal Data Architect & Senior Database Administrator  
**Status:** Approved for Implementation  

---

## 1. Table Data Specifications

### 1.1 `users`
Stores user credentials, role access indicators, and security lockout states.

| Column | Type | Nullable | Default | PK/FK | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key identifier. |
| `email` | VARCHAR(255) | NO | None | UK | User login email address. |
| `password_hash` | VARCHAR(255) | NO | None | - | Bcrypt/Argon2 password hash string. |
| `full_name` | VARCHAR(150) | NO | None | - | User display name. |
| `role` | SystemRole | NO | `'ANALYST'` | - | Access control role enum (`SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`, `ANALYST`, `AUDITOR`). |
| `is_mfa_enabled` | BOOLEAN | NO | `false` | - | Flag indicating TOTP MFA activation. |
| `mfa_secret` | VARCHAR(255) | YES | NULL | - | Encrypted TOTP secret payload. |
| `failed_logins` | INT4 | NO | `0` | - | Failed authentication counter. |
| `locked_until` | TIMESTAMP | YES | NULL | - | Account lockout expiration timestamp. |
| `is_active` | BOOLEAN | NO | `true` | - | Active user status flag. |
| `version` | INT4 | NO | `1` | - | Optimistic locking counter. |
| `created_at` | TIMESTAMP | NO | `NOW()` | - | Row creation timestamp. |
| `updated_at` | TIMESTAMP | NO | `NOW()` | - | Row update timestamp. |
| `deleted_at` | TIMESTAMP | YES | NULL | - | Soft delete timestamp. |

---

### 1.2 `finance_records`
Stores financial transactions, turnover figures, P&L metrics, and operational expenses.

| Column | Type | Nullable | Default | PK/FK | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | NO | `gen_random_uuid()` | PK | Transaction primary key. |
| `tenant_id` | UUID | NO | `'0000...0000'` | - | Multi-tenant isolation UUID key. |
| `record_date` | DATE | NO | None | - | Accounting record date. |
| `metric_type` | MetricType | NO | None | - | Transaction classification (`TURNOVER`, `PROFIT_LOSS`). |
| `amount` | NUMERIC(18,2)| NO | None | - | Monetary value in base currency. |
| `currency` | VARCHAR(3) | NO | `'INR'` | - | ISO 4217 base currency code. |
| `status` | RecordStatus | NO | `'APPROVED'` | - | Approval status (`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`). |
| `category_id` | UUID | YES | NULL | FK | Tag linking to `categories.id`. |
| `notes` | TEXT | YES | NULL | - | Transaction notes or explanations. |
| `source` | IngestionSource | NO | `'MANUAL'` | - | Entry provenance (`MANUAL`, `CSV_UPLOAD`, `ERP_SYNC`). |
| `created_by_id` | UUID | NO | None | FK | User who authored the transaction (`users.id`). |
| `version` | INT4 | NO | `1` | - | Optimistic locking counter. |
| `created_at` | TIMESTAMP | NO | `NOW()` | - | Record creation timestamp. |
| `updated_at` | TIMESTAMP | NO | `NOW()` | - | Record update timestamp. |
| `deleted_at` | TIMESTAMP | YES | NULL | - | Soft delete timestamp. |

---

### 1.3 `audit_logs`
Stores immutable append-only records of data changes and security actions.

| Column | Type | Nullable | Default | PK/FK | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | NO | `gen_random_uuid()` | PK | Audit log primary key. |
| `tenant_id` | UUID | NO | `'0000...0000'` | - | Multi-tenant context key. |
| `actor_id` | UUID | YES | NULL | FK | User who performed action (`users.id`). |
| `action` | VARCHAR(100) | NO | None | - | Mutation type (e.g., `CREATE_TRANSACTION`). |
| `target_entity` | VARCHAR(100) | NO | None | - | Target table name. |
| `target_id` | UUID | YES | NULL | - | Target row primary key. |
| `old_values` | JSONB | YES | NULL | - | JSON snapshot prior to edit. |
| `new_values` | JSONB | YES | NULL | - | JSON snapshot after edit. |
| `ip_address` | VARCHAR(45) | YES | NULL | - | Client IP address. |
| `user_agent` | TEXT | YES | NULL | - | Client browser user agent string. |
| `created_at` | TIMESTAMP | NO | `NOW()` | - | Event creation timestamp. |
