# Enterprise Visual Studio Code Workspace Configuration

## 1. Overview
To ensure identical developer experience, automated formatting on save, linting diagnostics, and debugging capabilities across the team, **FinTrack Pro** provides a pre-configured VS Code workspace.

---

## 2. Recommended VS Code Extensions (`.vscode/extensions.json`)

When opening the repository in VS Code, install the recommended extension pack:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "eamodio.gitlens",
    "editorconfig.editorconfig",
    "usernamehw.error-lens"
  ]
}
```

---

## 3. Workspace Settings (`.vscode/settings.json`)

Enforces format-on-save, ESLint auto-fix, and Tailwind CSS IntelliSense:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 4. Next.js App Router Debugger Configuration (`.vscode/launch.json`)

Configured for debugging Next.js server-side API routes and client-side components:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

---

## 5. VS Code Tasks (`.vscode/tasks.json`)

Quick tasks accessible via `Ctrl+Shift+B` or Command Palette:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Infrastructure (Docker)",
      "type": "shell",
      "command": "pnpm docker:up",
      "problemMatcher": []
    },
    {
      "label": "Run Type Check",
      "type": "shell",
      "command": "pnpm typecheck",
      "problemMatcher": ["$tsc"]
    }
  ]
}
```
