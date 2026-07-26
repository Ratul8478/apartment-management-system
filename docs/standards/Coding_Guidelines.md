# Clean Code & Architectural Guidelines

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Technical Clean Code Guidelines & Best Practices  
**Author:** Staff Engineer & Quality Architect  
**Status:** Approved for Implementation  

---

## 1. Clean Code Principles

1. **SOLID Principles:**
   - *Single Responsibility (SRP):* `FinanceService` computes formulas; `FinanceRepository` executes Prisma SQL.
   - *Open/Closed (OCP):* Report templates implement a common provider interface without altering core export engine code.
   - *Liskov Substitution (LSP):* Storage drivers (`S3Adapter`, `SupabaseAdapter`) are fully interchangeable.
   - *Interface Segregation (ISP):* Read-only services rely on minimal read-only interfaces.
   - *Dependency Inversion (DIP):* Services depend on abstract repository interfaces, not concrete ORM instances.
2. **DRY (Don't Repeat Yourself):** Shared Zod DTO schemas validated on both client forms and server routes.
3. **KISS (Keep It Simple, Stupid):** Avoid premature microservice splitting; enforce boundaries inside the Next.js modular monolith.
4. **YAGNI (You Aren't Gonna Need It):** Implement single-tenant default constraints (`tenant_id = '0000...'`) without building over-engineered multi-tenant switching UI in Phase 1.

---

## 2. TypeScript & React Guidelines

- **Strict Type Checking:** `noImplicitAny: true`, `strictNullChecks: true`.
- **No `any` Types:** Use explicit interfaces or `unknown` with Zod type narrowing.
- **RSC Default:** All pages and layouts default to Server Components unless client interactivity is required.
