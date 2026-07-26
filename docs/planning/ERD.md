# Entity Relationship Diagram & Data Topology Specification

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Technical Entity Relationship Diagrams & Structural Topology  
**Author:** Principal Data Engineer & Database Architect  
**Status:** Approved for Implementation  

---

## 1. High-Level Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : "authenticates via"
    USERS ||--o| EMPLOYEES : "links to staff profile"
    DEPARTMENTS ||--o{ EMPLOYEES : "employs"
    DEPARTMENTS ||--o{ BUDGETS : "allocates financial budget"
    USERS ||--o{ FINANCE_RECORDS : "creates transaction"
    CATEGORIES ||--o{ FINANCE_RECORDS : "classifies revenue/expense"
    USERS ||--o{ AI_CHAT_SESSIONS : "initiates AI session"
    AI_CHAT_SESSIONS ||--o{ AI_CHAT_MESSAGES : "contains messages"
    USERS ||--o{ REPORTS : "generates document"
    USERS ||--o{ AUDIT_LOGS : "triggers action"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string role
        boolean is_mfa_enabled
        boolean is_active
        timestamp deleted_at
    }

    SESSIONS {
        uuid id PK
        uuid user_id FK
        string session_token UK
        string refresh_token UK
        timestamp expires_at
    }

    DEPARTMENTS {
        uuid id PK
        string name UK
        string cost_center UK
    }

    EMPLOYEES {
        uuid id PK
        uuid user_id FK
        uuid department_id FK
        uuid manager_id FK
        string full_name
        string designation
        decimal salary
        date date_joined
    }

    CATEGORIES {
        uuid id PK
        string name UK
        string type
    }

    FINANCE_RECORDS {
        uuid id PK
        uuid tenant_id
        uuid created_by_id FK
        uuid category_id FK
        date record_date
        string metric_type
        numeric amount
        string status
        timestamp deleted_at
    }

    BUDGETS {
        uuid id PK
        uuid department_id FK
        int fiscal_year
        numeric allocated
        numeric spent
    }

    SHARE_VALUES {
        uuid id PK
        string ticker
        date record_date
        numeric price
        boolean is_peer
    }

    AI_CHAT_SESSIONS {
        uuid id PK
        uuid user_id FK
        string title
    }

    AI_CHAT_MESSAGES {
        uuid id PK
        uuid session_id FK
        string role
        string content
        jsonb metadata
    }

    REPORTS {
        uuid id PK
        string type
        string template_id
        string file_url
        uuid generated_by_id FK
        date date_start
        date date_end
    }

    AUDIT_LOGS {
        uuid id PK
        uuid tenant_id
        uuid actor_id FK
        string action
        string target_entity
        uuid target_id
        jsonb old_values
        jsonb new_values
        timestamp created_at
    }
```

---

## 2. Cardinality & Relationship Breakdown

### 2.1 One-to-One (1:1) Relationships
- **`User` $\leftrightarrow$ `Employee` (Optional 1:1):**
  - An `Employee` profile optionally links to a single `User` account via `userId` foreign key.
  - *Business Rationale:* Directors or advisory staff listed in the employee directory may not require system login credentials.

### 2.2 One-to-Many (1:N) Relationships
- **`User` $\rightarrow$ `FinanceRecord` (1:N):**
  - One user can create many financial records over time.
- **`Department` $\rightarrow$ `Employee` (1:N):**
  - One department contains multiple employees.
- **`AiChatSession` $\rightarrow$ `AiChatMessage` (1:N):**
  - One chat session contains an ordered sequence of user prompt and assistant response messages.

### 2.3 Self-Referential (Hierarchy) Relationships
- **`Employee` $\rightarrow$ `Employee` (Self-Referential Manager 1:N):**
  - `Employee.managerId` points back to `Employee.id`.
  - *Business Rationale:* Represents the organizational reporting structure within the finance department.

---

## 3. Referential Integrity Rules & Deletion Cascades

| Foreign Key | Parent Table | Child Table | On Delete Action | On Update Action | Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `userId` | `User` | `Session` | `CASCADE` | `CASCADE` | Deleting a user invalidates all active session tokens immediately. |
| `userId` | `User` | `Employee` | `SET NULL` | `CASCADE` | Deleting a user account retains the employee profile record for HR audit. |
| `createdById` | `User` | `FinanceRecord`| `RESTRICT` | `CASCADE` | Prevents deleting a user account if active financial entries reference them. |
| `sessionId` | `AiChatSession` | `AiChatMessage`| `CASCADE` | `CASCADE` | Deleting a chat thread deletes all contained prompt/reply history messages. |
| `actorId` | `User` | `AuditLog` | `SET NULL` | `CASCADE` | Audit log rows are permanent; deleting a user replaces `actor_id` with `NULL`. |
