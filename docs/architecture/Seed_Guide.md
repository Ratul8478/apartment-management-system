# Enterprise Database Seed Architecture & Operational Guide

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Seeding Architecture & Operational Guide  
**Classification:** Enterprise Internal Engineering Standard  
**Version:** 2.0.0  

---

## 1. Executive Summary & Idempotency Mandate

In **FinTrack Pro**, database seeding populates foundational system data required for the application to boot and operate.

The seed system mandates **100% Idempotency**. Running `npm run db:seed` multiple times against the same environment MUST produce the exact same database state without throwing unique key violations or creating duplicate records.

---

## 2. Seed Data Classification Matrix

| Seed Category | Target Models | Idempotency Strategy | Purpose |
| :--- | :--- | :--- | :--- |
| **System Settings** | `SystemSetting` | `upsert` by `key` | Default application configuration (currency, timezone, lockout limits). |
| **Enterprise Roles** | `Role` | `upsert` by `name` | Core RBAC role definitions (`SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`, etc.). |
| **Permissions** | `Permission` | `upsert` by `key` | Granular security capability tokens (`finance:record:create`, `users:manage`). |
| **Role Permissions** | `RolePermission` | `upsert` by `[roleId, permissionId]` | Security capability mappings. |
| **Root Organization** | `Organization` | `upsert` by `slug` | Base multi-tenant tenant entity (`fintrack-global`). |
| **Corporate Company** | `Company` | `upsert` by static UUID `id` | Default subsidiary legal entity (`FinTrack India Pvt Ltd`). |
| **Department** | `Department` | `upsert` by `costCenter` | Treasury cost center (`CC-FIN-001`). |
| **Super Admin User** | `User` | `upsert` by `email` | Initial system administrator account (`admin@fintrackpro.internal`). |
| **Admin Employee** | `Employee` | `upsert` by `userId` | Staff directory roster entry for administrative user. |

---

## 3. Implementation Pattern (`upsert` Strategy)

Every entity created in `prisma/seed.ts` uses Prisma's native `upsert` method:

```typescript
// ✅ IDEMPOTENT PATTERN: Upsert by Unique Key
const adminUser = await prisma.user.upsert({
  where: { email: 'admin@fintrackpro.internal' },
  update: { 
    fullName: 'Vikramaditya Rao (System Admin)', 
    role: SystemRole.SUPER_ADMIN 
  },
  create: {
    organizationId: org.id,
    email: 'admin@fintrackpro.internal',
    passwordHash: defaultPasswordHash,
    fullName: 'Vikramaditya Rao (System Admin)',
    role: SystemRole.SUPER_ADMIN,
    isActive: true,
  },
});
```

---

## 4. Execution Commands

```bash
# Execute database seeding via npm script
npm run db:seed

# Alternatively via npx ts-node directly
npx ts-node -O "{\"module\":\"CommonJS\"}" prisma/seed.ts
```

---

## 5. Architectural Evaluation Matrix

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Dimension                 │ Architectural Impact & System Benefit                  │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Technical Reasoning       │ Native `upsert` commands guarantee zero unique key     │
│                           │ collision failures during repeated CI runner builds    │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Security Implications     │ Pre-seeded RBAC roles and permissions establish a      │
│                           │ zero-trust authorization foundation at boot            │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Scalability Considerations│ Seeding strictly foundational lookup tables keeps the  │
│                           │ seed script fast ($<2\text{ seconds}$)                 │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Operational Considerations│ New engineering hires can clone the repo and seed a    │
│                           │ working admin account instantly                        │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Maintainability Guidance  │ Adding a new permission requires appending to the      │
│                           │ `permissions` array in `prisma/seed.ts`                │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
