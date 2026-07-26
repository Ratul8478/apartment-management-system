# Enterprise Database Relationship & Boundary Architecture

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Relationship & Topology Architecture  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Executive Summary & Topology Map

The **FinTrack Pro** database schema uses strict relational foreign key constraints to enforce data integrity across organization hierarchies, security boundaries, financial ledgers, and document attachments.

This document maps all entity relationships, structural cardinalities, foreign key actions (`CASCADE`, `RESTRICT`, `SET NULL`), and multi-tenant isolation rules.

---

## 2. Comprehensive Relationship Matrix

| Parent Entity | Child Entity | Cardinality | Foreign Key Column | Foreign Key Action (`onDelete`) | Architectural Justification |
| :--- | :--- | :---: | :--- | :---: | :--- |
| `Organization` | `Company` | 1 : N | `company.organization_id` | `CASCADE` | Deleting an organization removes all associated corporate subsidiaries. |
| `Organization` | `User` | 1 : N | `user.organization_id` | `SET NULL` | Deleting an org un-links users without deleting their identity record. |
| `Organization` | `FinanceRecord` | 1 : N | `finance_record.organization_id` | `SET NULL` | Preserves financial ledger entries during organizational restructuring. |
| `Organization` | `AuditLog` | 1 : N | `audit_log.organization_id` | `SET NULL` | Preserves audit trails even if an organization record is removed. |
| `Company` | `Department` | 1 : N | `department.company_id` | `SET NULL` | Unlinks departments if a company entity is archived. |
| `Company` | `FinanceRecord` | 1 : N | `finance_record.company_id` | `SET NULL` | Preserves transactional history associated with legal entities. |
| `User` | `Session` | 1 : N | `session.user_id` | `CASCADE` | Deleting a user invalidates and purges all active authentication sessions. |
| `User` | `Employee` | 1 : 1 | `employee.user_id` | `SET NULL` | Unlinks employee roster entries if a user login is deleted. |
| `User` | `UserRole` | 1 : N | `user_role.user_id` | `CASCADE` | Purges RBAC role assignments when a user identity is removed. |
| `Role` | `UserRole` | 1 : N | `user_role.role_id` | `CASCADE` | Removing a role revokes that role assignment across all users. |
| `Role` | `RolePermission` | 1 : N | `role_permission.role_id` | `CASCADE` | Purges permission mappings when a role definition is deleted. |
| `Permission` | `RolePermission` | 1 : N | `role_permission.permission_id` | `CASCADE` | Removes permission mapping when a permission key is deleted. |
| `Department` | `Employee` | 1 : N | `employee.department_id` | `RESTRICT` | Blocks department deletion if active employees are assigned. |
| `Department` | `Budget` | 1 : N | `budget.department_id` | `RESTRICT` | Blocks department deletion if fiscal budget records exist. |
| `Department` | `Forecast` | 1 : N | `forecast.department_id` | `CASCADE` | Deleting a department purges associated predictive AI forecasts. |
| `Employee` | `Employee` | 1 : N | `employee.manager_id` | `SET NULL` | Unsets manager link for subordinates if a manager employee record is deleted. |
| `Category` | `FinanceRecord` | 1 : N | `finance_record.category_id` | `SET NULL` | Unsets category classification if a financial category is deleted. |
| `User` | `FinanceRecord` | 1 : N | `finance_record.created_by_id` | `RESTRICT` | **RESTRICT:** Blocks user deletion if the user created financial records. |
| `FinanceRecord` | `Receipt` | 1 : N | `receipt.finance_record_id` | `SET NULL` | Unlinks receipt document if financial record is deleted. |
| `Receipt` | `OcrResult` | 1 : 1 | `ocr_result.receipt_id` | `CASCADE` | Purges OCR extraction payload if the source receipt document is deleted. |
| `User` | `AiChatSession` | 1 : N | `ai_chat_session.user_id` | `CASCADE` | Purges AI chat history when a user account is deleted. |
| `AiChatSession` | `AiChatMessage` | 1 : N | `ai_chat_message.session_id` | `CASCADE` | Purges chat messages when an AI chat session container is deleted. |
| `User` | `Report` | 1 : N | `report.generated_by_id` | `RESTRICT` | Preserves generated corporate reports. |
| `User` | `Notification` | 1 : N | `notification.user_id` | `CASCADE` | Purges user notifications when user account is deleted. |
| `User` | `AuditLog` | 1 : N | `audit_log.actor_id` | `SET NULL` | Retains audit entries with `actor_id = NULL` if user is deleted. |

---

## 3. Topology & Boundary Isolation Rules

### Rule 1: Financial Ledger Immutability
`FinanceRecord` entries treat `created_by_id` with `onDelete: Restrict`. An enterprise user account that has authored or approved live financial records CANNOT be hard-deleted from PostgreSQL. Account deactivation must be performed via soft-deletion (`is_active = false` or `deleted_at = NOW()`).

### Rule 2: Soft Deletion Propagation
Soft-deleted entities (`deleted_at != NULL`) do NOT trigger database-level foreign key cascades. When an `Organization` is soft-deleted, application services must soft-delete child `companies` and `users` to maintain analytical consistency.

### Rule 3: Multi-Tenant Boundary Isolation
Multi-tenant isolation is enforced via compound indexes containing `organization_id` (e.g., `@@index([organization_id, record_date, metric_type])`). Queries must include `organization_id` in the `WHERE` clause to take advantage of index scan acceleration.

---

## 4. Architectural Evaluation Matrix

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Dimension                 │ Architectural Impact & System Benefit                  │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Technical Reasoning       │ Explicit `onDelete` actions prevent orphaned records   │
│                           │ and database reference corruption                      │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Security Implications     │ `RESTRICT` rules on ledger authors prevent malicious   │
│                           │ deletion of financial audit trails                     │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Scalability Considerations│ Compound indexes on `organization_id` support fast     │
│                           │ multi-tenant data partitioning in large DB clusters    │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Operational Considerations│ Cascade rules on sessions and tokens ensure user       │
│                           │ logouts clean up ephemeral records automatically       │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Maintainability Guidance  │ Standardized 1:N and N:M join tables provide clear     │
│                           │ entity boundaries for future service refactoring      │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
