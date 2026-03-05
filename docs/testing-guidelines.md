# Testing Guidelines

## Overview

This document defines the testing standards and principles for the To Do App. All contributions must include appropriate tests that follow these guidelines.

---

## 1. Unit Tests

- **Framework**: Jest
- **Purpose**: Test individual functions and React components in isolation.
- **File naming**: `*.test.js` or `*.test.ts`
- **Backend location**: `packages/backend/__tests__/`
- **Frontend location**: `packages/frontend/src/__tests__/`
- Name test files to match what they're testing (e.g., `app.test.js` for testing `app.js`).

---

## 2. Integration Tests

- **Framework**: Jest + Supertest
- **Purpose**: Test backend API endpoints with real HTTP requests.
- **File naming**: `*.test.js` or `*.test.ts`
- **Location**: `packages/backend/__tests__/integration/`
- Name integration test files based on what they test (e.g., `todos-api.test.js` for TODO API endpoints).

---

## 3. End-to-End (E2E) Tests

- **Framework**: Playwright — this is the required framework; do not use Cypress or other alternatives.
- **Purpose**: Test complete UI workflows through browser automation.
- **File naming**: `*.spec.js` or `*.spec.ts`
- **Location**: `tests/e2e/`
- Name E2E test files based on the user journey they test (e.g., `todo-workflow.spec.js`).
- Run tests against **one browser only**.
- Use the **Page Object Model (POM)** pattern for all E2E tests to keep selectors and interactions maintainable and reusable.
- Limit to **5–8 tests** covering critical user journeys — focus on happy paths and key edge cases, not exhaustive coverage.

---

## 4. Port Configuration

- Always use environment variables with sensible defaults for port configuration so that CI/CD workflows can dynamically detect ports.
- **Backend**: `const PORT = process.env.PORT || 3030;`
- **Frontend**: React's default port is `3000`, but it can be overridden with the `PORT` environment variable.

---

## 5. Test Isolation & Independence

- Every test must be **fully independent** — no test should rely on state created by another test.
- Each test must set up its own data and clean up after itself.
- **Setup and teardown hooks** (`beforeEach`, `afterEach`, `beforeAll`, `afterAll`) are required wherever shared state or resources are involved.
- Tests must pass consistently across multiple consecutive runs.

---

## 6. Coverage Requirements

- All new features must include appropriate unit, integration, or E2E tests.
- Bug fixes must include a regression test that would have caught the bug.

---

## 7. Best Practices

- Keep tests focused and readable — each test should verify one behaviour.
- Use descriptive test names that explain what is being tested and the expected outcome (e.g., `"should return 404 when item does not exist"`).
- Avoid testing implementation details; test observable behaviour.
- Do not use `console.log` in tests; use Jest matchers and assertions instead.
- Prefer `async/await` over callbacks or raw promises for asynchronous tests.
