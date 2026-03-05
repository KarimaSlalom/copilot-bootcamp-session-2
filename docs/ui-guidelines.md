# UI Guidelines

## Overview

This document defines the UI standards and design guidelines for the To Do App. All frontend contributions must follow these guidelines to ensure a consistent, accessible, and maintainable user interface.

---

## 1. Component Library

- Use **Material UI (MUI)** as the primary component library (`@mui/material`).
- Prefer MUI components (e.g., `Button`, `TextField`, `List`, `ListItem`, `IconButton`, `Typography`, `Card`) over custom-styled HTML elements.
- Do not mix Material UI with other component libraries (e.g., Bootstrap, Ant Design).

---

## 2. Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary | Dark slate (header background) | `#282c34` |
| Accent / Primary action | Sky blue | `#61dafb` |
| Accent hover | Deep cyan | `#21a1c9` |
| Destructive action | Red | `#f44336` |
| Destructive hover | Dark red | `#d32f2f` |
| Surface / Card background | Light grey | `#f5f5f5` |
| Error text | Dark red | `#d32f2f` |
| Primary text on dark | White | `#ffffff` |
| Primary text on light | Dark slate | `#282c34` |

Apply these colors via the MUI theme (`createTheme`) rather than hard-coding hex values in individual component styles.

---

## 3. Typography

- Base font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`.
- Page title (`h1`): `1.8rem`, white, rendered inside the header.
- Section headings (`h2`): MUI `Typography variant="h6"`.
- Body text: MUI `Typography variant="body1"`.
- Do not use raw `<h1>`–`<h6>` or `<p>` tags; use MUI `Typography` instead.

---

## 4. Layout

- The app is centered with a maximum content width of **800 px** and horizontal padding of **20 px**.
- The header spans the full content width with a dark background, white text, and `8px` border radius.
- Sections below the header are stacked vertically with a **20 px gap**.
- Each section uses a light-grey card surface with `8px` border radius and a subtle box-shadow (`0 2px 4px rgba(0,0,0,0.1)`).
- The app must be fully responsive; layout must adapt cleanly to viewport widths down to **360 px**.

---

## 5. Form & Input Styles

- Use MUI `TextField` (variant `outlined`) for all text inputs.
- The add-task form uses a horizontal flex layout: input field takes all remaining space, submit button is right-aligned.
- Inputs must have a visible label or `aria-label` for screen readers.

---

## 6. Button Styles

| Button type | MUI variant | Color |
|---|---|---|
| Primary action (e.g., Add Item) | `contained` | `primary` (sky blue `#61dafb`) |
| Destructive action (e.g., Delete) | `contained` | `error` (red `#f44336`) |
| Secondary / cancel actions | `outlined` | `primary` |

- Buttons must have a minimum touch target of **44 × 44 px**.
- Use a `DeleteIcon` (MUI icon) inside the delete `IconButton` instead of a text label where space is constrained.
- All buttons require a descriptive `aria-label` when no visible text is present.

---

## 7. Task List

- Render tasks using MUI `List` and `ListItem` components.
- Each `ListItem` displays the task name on the left and a delete button on the right.
- Items are separated by a `Divider`; no divider is rendered after the last item.
- An empty state message ("No items found. Add some!") is displayed using MUI `Typography` when the list has no items.

---

## 8. Accessibility (a11y)

- The app must meet **WCAG 2.1 AA** compliance.
- All interactive elements must be keyboard-navigable (Tab / Shift-Tab / Enter / Space).
- Color contrast ratio must be at least **4.5:1** for normal text and **3:1** for large text.
- Use semantic HTML (`<header>`, `<main>`, `<section>`, `<ul>`, `<li>`) as the structural skeleton, with ARIA roles and labels added only where semantics are insufficient.
- Loading and error states must be announced to screen readers via `aria-live="polite"` regions.
- The `<html>` element must include a `lang="en"` attribute (already set in `index.html`).

---

## 9. Error & Loading States

- A loading spinner (MUI `CircularProgress`) replaces the task list while data is being fetched.
- Error messages are displayed in **dark red** (`#d32f2f`) using MUI `Alert severity="error"`.
- Errors are dismissible where possible.

---

## 10. Icons

- Use **MUI Icons** (`@mui/icons-material`) exclusively; do not import icon sets from other libraries.
- Common icons: `AddCircleOutlineIcon` for add actions, `DeleteIcon` for delete actions.
