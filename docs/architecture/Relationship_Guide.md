# Enterprise Database Relationship & Referential Integrity Guide

**System Name:** FinTrack Pro  
**Document Type:** Relationship Engineering & Integrity Protocol  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Cardinality & Ownership Specification

### 1:1 Relationships
1. **User $\leftrightarrow$ Employee (`user_id`):**
   - **Type:** Optional One-to-One.
   - **Rationale:** Internal system users map to an employee record for HR and payroll processing, while external auditors or system service accounts exist solely in `users`.
   - **Foreign Key Rule:** `onDelete: SetNull`.

2. **Receipt $\leftrightarrow$ OcrResult (`receipt_id`):**
   - **Type:** Strict One-to-One.
   - **Rationale:** Every uploaded receipt generates exactly one async OCR extraction record.
   - **Foreign Key Rule:** `onDelete: Cascade`.

---

### 1:N Relationships
1. **Organization $\rightarrow$ Company (`organization_id`):**
   - **Rationale:** Root tenant parent-child hierarchy for corporate enterprise groups.
   - **Foreign Key Rule:** `onDelete: Cascade`.

2. **Company $\rightarrow$ Invoice (`company_id`):**
   - **Rationale:** Legal entity issuance anchor for accounts payable/receivable.
   - **Foreign Key Rule:** `onDelete: Cascade`.

3. **Invoice $\rightarrow$ Payment (`invoice_id`):**
   - **Rationale:** Single invoices can be settled via multiple partial payments.
   - **Foreign Key Rule:** `onDelete: Restrict` (prevents deleting active invoices with financial history).

---

### N:M (Many-to-Many) Explicit Join Entities
1. **UserRole (`user_id`, `role_id`):**
   - Direct junction table mapping users to enterprise roles with `assigned_at` timestamps.

2. **RolePermission (`role_id`, `permission_id`):**
   - Junction table mapping system roles to fine-grained security permissions with `granted_at` timestamps.

---

## 2. Referential Integrity & Cascade Action Policy

| Cascade Behavior | Triggering Scenario | Target Entity | Rationale |
| :--- | :--- | :--- | :--- |
| **CASCADE** | Organization Deletion | `Company`, `User`, `Account` | Purges multi-tenant tree during tenant teardown. |
| **RESTRICT** | Finance Record Deletion | `User` (createdBy) | Preserves immutable audit author identity for compliance. |
| **RESTRICT** | Invoice Deletion | `Payment` | Blocks deletion of billed invoices with settled payments. |
| **SET NULL** | User Deletion | `AuditLog` (actorId) | Retains system audit log events when user accounts are removed. |
