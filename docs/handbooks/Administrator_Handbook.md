# Administrator Handbook — FinTrack Pro

## 1. System Configuration & Tenant Management
System administrators manage users, roles, tenant settings, feature flags, and audit logs via the Admin Portal (`/src/app/api/admin/*`).

---

## 2. RBAC Permissions Matrix

| Permission Action | SUPER_ADMIN | ADMIN | FINANCE_MANAGER | USER | AUDITOR |
|---|:---:|:---:|:---:|:---:|:---:|
| Manage Tenant Settings | Yes | Yes | No | No | No |
| Create/Edit Users | Yes | Yes | No | No | No |
| Configure Feature Flags | Yes | Yes | No | No | No |
| Create Finance Records | Yes | Yes | Yes | No | No |
| View Financial Reports | Yes | Yes | Yes | Yes | Yes |
| View System Audit Logs | Yes | Yes | No | No | Yes |

---
