# Enterprise Contribution & Engineering Guidelines

## 1. Welcome Contributors
Thank you for contributing to the **FinTrack Pro Enterprise AI Finance System**. This document outlines our engineering principles, repository guidelines, security requirements, and contribution processes.

---

## 2. Core Engineering Principles

1. **Type Safety & Zero `any` Policy:** Strict TypeScript compilation (`strict: true`). Explicit interface and type definitions for all API models, component props, and database payloads.
2. **Layered Decoupled Architecture:** Clean separation of concerns between UI components (`src/components`), Next.js App Router pages (`src/app`), database services (`src/server/services`), and repositories (`src/server/repositories`).
3. **Immutability & Pure Functions:** Prefer pure functions, immutable data transformations, and explicit return types.
4. **Zero Security Compromise:** All user input validated with Zod. Zero hardcoded credentials or API tokens in source code.

---

## 3. How to Submit a Contribution

```text
Fork / Clone Repo ──► Create Feature Branch ──► Make Changes ──► Run Quality Checks ──► Open PR
```

### Steps:
1. **Branch Off `develop`:** Always create feature/bugfix branches off the latest `develop` branch.
2. **Follow Coding Conventions:** Run `pnpm format` and `pnpm lint:fix` before committing.
3. **Commit Messages:** Follow [Git Workflow Standards](file:///e:/DOWNLOADS/Users/Mr.Ratul/Appartment%20management%20system/docs/setup/Git_Workflow.md).
4. **Open Pull Request:** Fill out the PR template completely and request review from your Tech Lead.

---

## 4. Code Style & Standards

- **React Components:** Named functional components with explicit interface props.
- **Async/Await:** Avoid raw Promise chains (`.then()`). Use `async/await` with `try/catch` error boundaries.
- **CSS & Tailwind:** Use utility-first Tailwind CSS class names with `tailwind-merge` (`cn()`) helper utility.

---

## 5. Security & Responsible Disclosure

If you discover a security vulnerability or credential leak:
- **DO NOT** create a public issue on GitHub.
- Email the security team immediately at `security@fintrackpro.com`.
