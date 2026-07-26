# Enterprise Audit, Compliance & Data Security Specification

**System Name:** FinTrack Pro  
**Document Type:** Regulatory Compliance & Security Audit Specification  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Regulatory Compliance Standards

**FinTrack Pro** is designed to comply with regulatory security frameworks:

1. **SOC2 Type II & ISO 27001:** Immutable audit logging (`AuditLog`) capturing `actorUserId`, `action`, `targetEntity`, `targetId`, `oldValues`, `newValues`, `ipAddress`, `userAgent`, and UTC timestamp.
2. **PCI-DSS Compliance:** Cardholder data and sensitive bank credentials are NEVER stored in raw text; sensitive columns use encrypted storage (`isEncrypted = true` in `SystemSetting`).
3. **GDPR / Right to be Forgotten:** Soft deletion (`deletedAt`) combined with controlled legal retention policies.

---

## 2. Immutable Audit Log Data Model

The `AuditLog` model operates as an append-only ledger:

```prisma
model AuditLog {
  id             String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId String?       @map("organization_id") @db.Uuid
  actorId        String?       @map("actor_id") @db.Uuid
  actorUserId    String?       @map("actor_user_id") @db.Uuid
  action         String        @db.VarChar(100)
  targetEntity   String?       @default("system") @map("target_entity") @db.VarChar(100)
  targetTable    String?       @map("target_table") @db.VarChar(100)
  targetId       String?       @map("target_id") @db.Uuid
  oldValues      Json?         @map("old_values") @db.JsonB
  newValues      Json?         @map("new_values") @db.JsonB
  metadata       Json?         @db.JsonB
  ipAddress      String?       @map("ip_address") @db.VarChar(45)
  userAgent      String?       @map("user_agent") @db.Text
  createdAt      DateTime      @default(now()) @map("created_at") @db.Timestamp()

  organization Organization? @relation(fields: [organizationId], references: [id], onDelete: SetNull)
  actor        User?         @relation("ActorAuditLogs", fields: [actorId], references: [id], onDelete: SetNull)
  actorUser    User?         @relation("ActorUserAuditLogs", fields: [actorUserId], references: [id], onDelete: SetNull)

  @@index([organizationId])
  @@index([actorId])
  @@index([actorUserId])
  @@index([action])
  @@index([targetEntity, targetId])
  @@map("audit_logs")
}
```

- **JSONB Diffs:** `oldValues` and `newValues` store full JSON snapshots before and after mutation.
- **SetNull Constraint:** Deleting user identity accounts retains historical audit events for 7-year regulatory retention mandates.
