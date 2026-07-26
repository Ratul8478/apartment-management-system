# Enterprise Migration Naming & Versioning Standards

**System Name:** FinTrack Pro  
**Document Type:** DDL Versioning & Naming Convention Standard  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Directory & Timestamp Conventions

All Prisma database migrations reside in `prisma/migrations/`. Folder names follow Prisma's mandatory ISO timestamp prefix combined with snake_case descriptive actions:

```text
prisma/migrations/
├── 20260724000000_init_enterprise_domain_schema/
│   └── migration.sql
├── 20260801120000_add_invoice_payment_tables/
│   └── migration.sql
└── 20260915153000_add_ai_chat_log_index/
    └── migration.sql
```

---

## 2. Mandatory Verb Conventions

| Action Verb | Target Scenario | Example Migration Name |
| :--- | :--- | :--- |
| `init_` | Initial domain schema baseline | `20260724000000_init_enterprise_domain_schema` |
| `add_` | Adding new models or columns | `20260805090000_add_branch_entity` |
| `modify_` | Altering existing columns | `20260810143000_modify_finance_record_amount_precision` |
| `drop_` | Phase 2 contract deletion (Expand-Contract) | `20260901100000_drop_legacy_user_role_field` |
| `add_index_` | Performance index additions | `20260910111500_add_index_audit_logs_actor` |

---

## 3. Code Review & Approval Workflow

1. **Local Authoring:** Run `npx prisma migrate dev --name <migration_name>` in non-production.
2. **DDL Inspection:** Review generated `migration.sql` for table locks or destructive `DROP TABLE` operations.
3. **CI/CD Pipeline:** Execute `npx prisma migrate deploy` in staging prior to production approval.
