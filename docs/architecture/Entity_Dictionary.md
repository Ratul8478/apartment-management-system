# Enterprise Entity Dictionary & Data Model Specification

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Data Model & Entity Dictionary  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Executive Summary & Modeling Rationale

The **FinTrack Pro** relational schema models an enterprise financial system designed for multi-tenant isolation, 3rd Normal Form (3NF) normalization, strict ACID compliance, and grounded AI processing.

This document defines the 19 core domain entities composing the database platform layer, outlining field types, constraints, nullability, relationships, lifecycles, and technical justifications.

---

## 2. Exhaustive Entity Dictionary

### 1. `Organization` (`organizations`)
- **Business Purpose:** Represents the top-level parent enterprise or multi-tenant organizational boundary.
- **Primary Key:** `id` (UUID v4)
- **Lifecycle:** Active $\rightarrow$ Suspended $\rightarrow$ Archived
- **Key Columns:** `name` (VARCHAR 150), `slug` (VARCHAR 100, UNIQUE), `tax_id`, `currency` (ISO 4217), `timezone`, `deleted_at`.
- **Justification:** Multi-tenant root entity enabling strict data partitioning and row-level tenant security.

---

### 2. `Company` (`companies`)
- **Business Purpose:** Represents a specific legal entity or subsidiary corporation operating within an Organization.
- **Primary Key:** `id` (UUID v4)
- **Foreign Key:** `organization_id` $\rightarrow$ `organizations.id` (CASCADE)
- **Lifecycle:** Active $\rightarrow$ Inactive $\rightarrow$ Soft Deleted
- **Key Columns:** `name`, `registration_no`, `country` (ISO 3166-1 alpha-2), `currency`.
- **Justification:** Supports complex enterprise corporate structures with multi-currency financial reporting.

---

### 3. `User` (`users`)
- **Business Purpose:** Identity account representing a human user or automated system agent accessing the platform.
- **Primary Key:** `id` (UUID v4)
- **Foreign Key:** `organization_id` $\rightarrow$ `organizations.id` (SET NULL)
- **Optimistic Locking:** `version` (INT4 DEFAULT 1)
- **Lifecycle:** Active $\rightarrow$ Locked $\rightarrow$ Suspended $\rightarrow$ Soft Deleted
- **Key Columns:** `email` (UNIQUE), `password_hash`, `full_name`, `role`, `is_mfa_enabled`, `mfa_secret`, `failed_logins`, `locked_until`, `version`.
- **Justification:** Central authentication entity with built-in MFA state and optimistic concurrency protection.

---

### 4. `Session` (`sessions`)
- **Business Purpose:** Active authentication session and OAuth token pair container.
- **Primary Key:** `id` (UUID v4)
- **Foreign Key:** `user_id` $\rightarrow$ `users.id` (CASCADE)
- **Lifecycle:** Active $\rightarrow$ Refreshed $\rightarrow$ Expired / Revoked
- **Key Columns:** `session_token` (UNIQUE), `refresh_token` (UNIQUE), `user_agent`, `ip_address`, `expires_at`.
- **Justification:** Enables stateful session tracking, remote logout, and IP-based anomaly detection.

---

### 5. `Role` (`roles`) & `Permission` (`permissions`)
- **Business Purpose:** Defines enterprise Role-Based Access Control (RBAC) role definitions and granular capability keys.
- **Primary Key:** `id` (UUID v4)
- **Key Columns (`roles`):** `name` (UNIQUE), `description`, `is_system`.
- **Key Columns (`permissions`):** `key` (UNIQUE, e.g., `finance:record:create`), `description`.
- **Justification:** Decouples hardcoded roles from system capabilities, allowing dynamic privilege assignments.

---

### 6. `UserRole` (`user_roles`) & `RolePermission` (`role_permissions`)
- **Business Purpose:** Join tables mapping Many-to-Many relationships between Users and Roles, and Roles and Permissions.
- **Composite Primary Keys:** `[user_id, role_id]` and `[role_id, permission_id]`.
- **Foreign Keys:** All foreign keys enforce `ON DELETE CASCADE`.
- **Justification:** Standard relational normalized pattern for N:M access control matrix execution.

---

### 7. `Department` (`departments`)
- **Business Purpose:** Organizational cost center responsible for budget allocation and operational expense tracking.
- **Primary Key:** `id` (UUID v4)
- **Foreign Key:** `company_id` $\rightarrow$ `companies.id` (SET NULL)
- **Key Columns:** `name`, `cost_center` (UNIQUE), `description`.
- **Justification:** Enables departmental budget tracking and departmental financial aggregation.

---

### 8. `Employee` (`employees`)
- **Business Purpose:** Staff directory record representing employees within departments.
- **Primary Key:** `id` (UUID v4)
- **Foreign Keys:** `user_id` $\rightarrow$ `users.id` (SET NULL), `department_id` $\rightarrow$ `departments.id` (RESTRICT), `manager_id` $\rightarrow$ `employees.id` (SET NULL).
- **Lifecycle:** Active $\rightarrow$ Terminated $\rightarrow$ Soft Deleted
- **Key Columns:** `full_name`, `designation`, `email`, `salary` (DECIMAL 12,2), `date_joined`.
- **Justification:** Links user identity accounts to organizational hierarchy and payroll records.

---

### 9. `Category` (`categories`)
- **Business Purpose:** Master taxonomy for financial classification (Turnover, P&L, Revenue, Expense categories).
- **Primary Key:** `id` (UUID v4)
- **Key Columns:** `name` (UNIQUE), `type` (`TURNOVER` | `PROFIT_LOSS` | `REVENUE` | `EXPENSE`), `description`.
- **Justification:** Standardized categorization for analytical rollups and financial statement generation.

---

### 10. `FinanceRecord` (`finance_records`)
- **Business Purpose:** Primary transactional ledger storing turnover, revenue, expense, and profit entry lines.
- **Primary Key:** `id` (UUID v4)
- **Foreign Keys:** `organization_id` $\rightarrow$ `organizations.id`, `company_id` $\rightarrow$ `companies.id`, `created_by_id` $\rightarrow$ `users.id` (RESTRICT), `category_id` $\rightarrow$ `categories.id`.
- **Optimistic Locking:** `version` (INT4 DEFAULT 1)
- **Lifecycle:** Draft $\rightarrow$ Pending Approval $\rightarrow$ Approved $\rightarrow$ Audited $\rightarrow$ Soft Deleted
- **Key Columns:** `record_date`, `metric_type`, `amount` (DECIMAL 18,2), `currency`, `status`, `notes`, `source`, `version`.
- **Justification:** Core ledger entity enforcing financial precision (`DECIMAL(18,2)`) and multi-tenant scoping.

---

### 11. `Budget` (`budgets`)
- **Business Purpose:** Departmental fiscal budget target allocations and actual spend counters.
- **Primary Key:** `id` (UUID v4)
- **Foreign Key:** `department_id` $\rightarrow$ `departments.id` (RESTRICT)
- **Unique Constraint:** `[department_id, fiscal_year]`
- **Key Columns:** `fiscal_year`, `allocated` (DECIMAL 18,2), `spent` (DECIMAL 18,2).
- **Justification:** Tracks fiscal year budget compliance and triggers variance alerts when spending exceeds allocations.

---

### 12. `Forecast` (`forecasts`)
- **Business Purpose:** AI-generated predictive financial forecast targets with confidence interval boundaries.
- **Primary Key:** `id` (UUID v4)
- **Foreign Key:** `department_id` $\rightarrow$ `departments.id` (CASCADE)
- **Key Columns:** `fiscal_year`, `quarter`, `predicted_value`, `confidence_low`, `confidence_high`, `algorithm_used`.
- **Justification:** Stores statistical and machine learning financial predictions alongside actual historical records.

---

### 13. `Receipt` (`receipts`) & `OcrResult` (`ocr_results`)
- **Business Purpose:** Document management for uploaded invoice/receipt files and AI OCR structured extraction results.
- **Primary Key:** `id` (UUID v4)
- **Foreign Key:** `finance_record_id` $\rightarrow$ `finance_records.id` (SET NULL), `receipt_id` $\rightarrow$ `receipts.id` (CASCADE, UNIQUE).
- **Key Columns (`ocr_results`):** `status`, `extracted_data` (JSONB), `confidence` (DECIMAL 5,4), `vendor_name`, `invoice_amount`.
- **Justification:** Enables automated OCR invoice parsing and attachment linking to financial ledger records.

---

### 14. `ShareValue` (`share_values`)
- **Business Purpose:** Time-series market valuation and stock price snapshot table.
- **Primary Key:** `id` (UUID v4)
- **Unique Constraint:** `[ticker, record_date]`
- **Key Columns:** `ticker`, `record_date`, `price` (DECIMAL 12,4), `currency`, `is_peer`, `company_name`.
- **Justification:** Tracks corporate stock valuations and benchmark peer financial performance over time.

---

### 15. `AiChatSession` & `AiChatMessage`
- **Business Purpose:** Stores conversational AI sessions and grounded financial chat history.
- **Primary Key:** `id` (UUID v4)
- **Foreign Keys:** `user_id` $\rightarrow$ `users.id` (CASCADE), `session_id` $\rightarrow$ `ai_chat_sessions.id` (CASCADE).
- **Key Columns (`ai_chat_messages`):** `role` (`user` | `assistant`), `content`, `metadata` (JSONB).
- **Justification:** Persists grounded financial AI Q&A sessions with complete context audit trails.

---

### 16. `Report` (`reports`)
- **Business Purpose:** Stores generated export artifacts (Power BI datasets, PPT presentations, PDF summaries).
- **Primary Key:** `id` (UUID v4)
- **Foreign Key:** `generated_by_id` $\rightarrow$ `users.id` (RESTRICT)
- **Key Columns:** `type`, `template_id`, `file_url`, `date_start`, `date_end`.
- **Justification:** Audit log of generated corporate financial presentations and exports.

---

### 17. `Notification` (`notifications`)
- **Business Purpose:** In-app notification queue for system alerts, budget thresholds, and approval requests.
- **Primary Key:** `id` (UUID v4)
- **Foreign Key:** `user_id` $\rightarrow$ `users.id` (CASCADE)
- **Key Columns:** `type`, `severity`, `title`, `message`, `is_read`.
- **Justification:** Asynchronous messaging feed for user notification management.

---

### 18. `AuditLog` (`audit_logs`)
- **Business Purpose:** Immutable append-only audit trail logging every security and financial data mutation.
- **Primary Key:** `id` (UUID v4)
- **Foreign Keys:** `organization_id` $\rightarrow$ `organizations.id`, `actor_id` $\rightarrow$ `users.id` (SET NULL).
- **Key Columns:** `action`, `target_entity`, `target_id`, `old_values` (JSONB), `new_values` (JSONB), `ip_address`, `user_agent`.
- **Justification:** Guarantees SOC2 Type II and PCI-DSS compliance by recording exact JSON diffs of database changes.

---

### 19. `SystemSetting` (`system_settings`)
- **Business Purpose:** Key-value repository for system-wide and enterprise configuration overrides.
- **Primary Key:** `id` (UUID v4)
- **Key Columns:** `key` (UNIQUE), `value`, `category`, `is_encrypted`, `description`.
- **Justification:** Centralized configuration parameters loaded dynamically at runtime.
