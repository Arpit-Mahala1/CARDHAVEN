# Suggested Issues for CARDHAVEN

The following issues are ready to be created on the repository to track known tasks and future enhancements. Create each issue on GitHub (or your preferred issue tracker) using the title and description provided.

---

## Issue 1: Implement Core Game Loop
**Title:** `feat: implement core game loop`
**Description:**
- Design and implement the main game loop handling initialization, update, and render cycles.
- Ensure proper separation of concerns (logic vs rendering).
- Add unit tests for loop timing and state transitions.

---

## Issue 2: Add Unit Tests for Utility Functions
**Title:** `test: add unit tests for utility functions`
**Description:**
- Identify utility modules under `cardhaven/utils/`.
- Write comprehensive Jest/PyTest tests covering edge cases.
- Integrate test script into CI pipeline.

---

## Issue 3: Create Dark Mode Theme
**Title:** `design: add dark mode theme`
**Description:**
- Define a dark color palette using HSL values.
- Update CSS variables and ensure contrast compliance.
- Provide toggle switch in UI and persist user preference.

---

## Issue 4: Refactor Asset Loading System
**Title:** `refactor: improve asset loading`
**Description:**
- Replace current synchronous loading with asynchronous streaming.
- Implement caching layer for textures and audio.
- Benchmark load times and document performance gains.

---

## Issue 5: Documentation Update – Contribution Guidelines
**Title:** `docs: update contribution guidelines`
**Description:**
- Add a section on branch naming conventions (`feature/xyz`).
- Document the pre‑push hook behavior and how to bypass it for emergency hotfixes.
- Include steps for opening a PR and required review process.

---

*Feel free to modify titles or descriptions to better fit the project's conventions.*
