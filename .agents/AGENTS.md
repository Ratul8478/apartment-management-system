# Workspace Rules

- **Post-Task Execution Rule**: After completing work on any task, automatically start the local development server (`npm run dev`) so that the application runs locally and can be previewed immediately.
- **Production Deployment Rule**: The live production website URL is `https://apartment-management-system-theta.vercel.app/`. Whenever modifications are made to the project, automatically stage, commit, and push changes to the `main` branch so Vercel builds and deploys directly to `https://apartment-management-system-theta.vercel.app/`.
