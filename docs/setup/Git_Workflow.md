# Enterprise Git Workflow & Quality Standards

## 1. Objective
This document defines the strict Git branching rules, commit message standards (Conventional Commits), Pull Request templates, Issue templates, and code review criteria enforced for **FinTrack Pro**.

---

## 2. Standardized Branch Naming Convention

All branches must begin with a defined type prefix followed by the ticket ID and a short kebab-case description.

### Format
`<type>/<ticket-id>-<short-description>`

### Valid Branch Types

| Type Prefix | Usage | Example Branch Name |
| :--- | :--- | :--- |
| `feature/` | New features or user stories | `feature/FIN-102-turnover-chart-rollup` |
| `fix/` | Non-critical bug fixes | `fix/FIN-204-jwt-token-expiration` |
| `hotfix/` | Urgent production issue fix | `hotfix/FIN-999-db-connection-leak` |
| `refactor/` | Code cleanup without functional change | `refactor/FIN-301-modularize-landing-page` |
| `docs/` | Documentation & guide updates | `docs/FIN-401-update-onboarding-guide` |
| `chore/` | Dependency updates, tooling, config | `chore/FIN-502-upgrade-tailwind-config` |

---

## 3. Conventional Commit Specification

Commit messages are automatically checked at commit time via Husky & `@commitlint/config-conventional`.

### Commit Message Structure
```text
<type>(<scope>): <short description in present imperative tense>

[optional body giving technical reasoning]

[optional footer referencing issue ID]
```

### Allowed Commit Types
- `feat`: A new feature for the user or system.
- `fix`: A bug fix.
- `docs`: Documentation changes only.
- `style`: Changes that do not affect code logic (white-space, formatting).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `perf`: Code change that improves performance.
- `test`: Adding missing unit/integration tests.
- `chore`: Infrastructure, package upgrades, tool configuration.

### Examples
- `feat(finance): add daily turnover rollup calculation algorithm`
- `fix(auth): resolve session invalidation race condition`
- `docs(setup): update docker compose volume persistent paths`
- `refactor(landing): extract hero and header subcomponents`

---

## 4. Pull Request Workflow & Template

### PR Guidelines
1. Target branch for all feature work is `develop`.
2. PR titles MUST adhere to Conventional Commits (e.g. `feat(finance): add turnover summary card`).
3. Minimum **2 peer approvals** required for merging to `main` (1 approval for `develop`).
4. All CI checks (lint, format, typecheck, tests) must pass 100%.

### Standard Pull Request Template (`.github/PULL_REQUEST_TEMPLATE.md`)

```markdown
## Description
Provide a concise summary of the changes made and the technical rationale.

## Linked Issue
Closes # [ISSUE_NUMBER]

## Type of Change
- [ ] 🚀 New Feature (`feat`)
- [ ] 🐛 Bug Fix (`fix`)
- [ ] ⚡ Performance Optimization (`perf`)
- [ ] ♻️ Refactoring (`refactor`)
- [ ] 📝 Documentation Update (`docs`)
- [ ] 🛠️ Tooling & Infrastructure (`chore`)

## Quality Assurance Checklist
- [ ] My code adheres to the project's TypeScript & ESLint standards.
- [ ] I have executed `pnpm typecheck` locally with 0 errors.
- [ ] I have executed `pnpm lint` and `pnpm format:check` with 0 warnings.
- [ ] I have added unit/integration tests for new business logic.
- [ ] No hardcoded secrets or environment variables were committed.

## Screenshots / Verification Evidence
*(Attach UI screenshots or CLI test output if applicable)*
```

---

## 5. Code Review Checklist & Criteria

Reviewers must evaluate PRs against the following criteria:

- [ ] **Architecture:** Does the change follow layered architecture (presentation -> service -> repository)?
- [ ] **Security:** Are input parameters validated with Zod? Is RBAC enforced?
- [ ] **Performance:** Are database queries indexed efficiently? Are heavy loops avoided?
- [ ] **Code Hygiene:** Are variable names descriptive and typed strictly (no `any`)?
