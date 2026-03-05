# Coding Guidelines

## Overview

This document describes the coding style and quality principles for the To Do App. Following these guidelines ensures the codebase remains consistent, readable, and maintainable as it grows.

---

## 1. Language & Module System

- **Frontend**: Modern JavaScript (ES2020+) with ES module syntax (`import`/`export`). JSX is used for React components.
- **Backend**: CommonJS module syntax (`require`/`module.exports`) to match the Node.js/Express runtime.
- Do not mix module systems within a package.

---

## 2. Formatting

- **Indentation**: 2 spaces — no tabs.
- **Quotes**: Single quotes for JavaScript strings; double quotes inside JSX attribute values.
- **Semicolons**: Required at the end of every statement.
- **Trailing commas**: Use trailing commas in multi-line arrays, objects, and function parameter lists.
- **Line length**: Aim for a maximum of **100 characters** per line; break long expressions at logical boundaries.
- **Braces**: Always use braces for control-flow blocks (`if`, `for`, `while`), even for single-line bodies.

---

## 3. Linting

- **Frontend**: ESLint is configured via the `"eslintConfig"` field in `packages/frontend/package.json`, extending `react-app` and `react-app/jest`. Do not bypass or disable these rules without team review.
- **Backend**: Add an ESLint configuration (`.eslintrc.js`) to `packages/backend/` using the `eslint:recommended` ruleset.
- Fix all linter warnings before opening a pull request; do not suppress warnings with `eslint-disable` comments unless absolutely necessary and accompanied by an explanation.
- Run the linter locally before pushing: `npx eslint <file-or-directory>`.

---

## 4. Naming Conventions

| Construct | Convention | Example |
|---|---|---|
| Variables & functions | `camelCase` | `fetchData`, `newItem` |
| React components | `PascalCase` | `App`, `TaskList` |
| CSS class names | `kebab-case` | `add-item-section`, `delete-btn` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES` |
| Files (JS/JSX) | Match the export name | `App.js`, `app.js` |

---

## 5. Import Organisation

Order imports within a file as follows, with a blank line between each group:

1. **Node built-ins** (backend only) — e.g., `path`, `fs`
2. **Third-party packages** — e.g., `express`, `react`, `@mui/material`
3. **Internal modules / relative imports** — e.g., `./App.css`, `../utils/helpers`

Within each group, sort alphabetically where practical.

---

## 6. DRY (Don't Repeat Yourself)

- Extract any logic used in more than one place into a shared utility function or module.
- Shared frontend utilities belong in `packages/frontend/src/utils/`.
- Shared backend utilities belong in `packages/backend/src/utils/`.
- Avoid duplicating constants — define them once and import them where needed.

---

## 7. Functions & Components

- Prefer small, single-responsibility functions. If a function is doing more than one thing, split it.
- React components should be **function components**; do not use class components.
- Keep component files focused: one primary exported component per file.
- Extract complex logic out of JSX into named handler functions (e.g., `handleSubmit`, `handleDelete`).
- Use `async/await` for all asynchronous code; avoid raw `.then()`/`.catch()` chains.

---

## 8. Error Handling

- Wrap all `async` operations in `try/catch` blocks.
- Never silently swallow errors — log them with `console.error` and surface a user-facing message where appropriate.
- Validate inputs at system boundaries (API request bodies, user-submitted form values) and return descriptive error responses (e.g., HTTP 400 with a message).

---

## 9. Comments

- Write code that is self-explanatory through good naming; avoid comments that merely restate what the code does.
- Use comments to explain **why** a non-obvious decision was made, not **what** the code does.
- Remove commented-out code before merging — use version control history instead.

---

## 10. Environment Configuration

- Never hard-code environment-specific values (ports, URLs, secrets). Use environment variables with sensible defaults.
- Backend port example: `const PORT = process.env.PORT || 3030;`
- Do not commit `.env` files containing secrets; add them to `.gitignore`.

---

## 11. Dependencies

- Do not add a dependency for something that can be done simply with the standard library or existing packages already in the project.
- Regularly review and update dependencies to avoid known vulnerabilities (`npm audit`).
- Pin major versions in `package.json` (e.g., `"^18.2.0"`) and avoid unpinned wildcards (`*`).
