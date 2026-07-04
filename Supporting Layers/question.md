# Supporting Layers: Untangle a Scattered Express API

## Story & Problem Statement
A small `articles-api` works correctly today, but it has grown messy. Validation chains are written **inline inside the route files**, the same `process.env` variables are read in **five different places**, and shared helpers like `AppError` and `asyncHandler` are scattered or duplicated. Every time a rule or a config value changes, a developer has to hunt across the codebase and inevitably misses one spot.

Your mission is to refactor this project into the three **supporting layers** taught in the lesson — `validators/`, `utils/`, and `config/` — without changing any behaviour. When you finish, the API responds exactly as before, but every kind of code has exactly one home.

---

## What You Need to Build

You will reorganise the existing code into three new folders and add one documentation file.

### 1. `validators/` — validation chains declared once (`validators/article.validator.js`)
*   Move the inline `express-validator` chains out of `routes/articles.js` and into `validators/article.validator.js`.
*   Export each chain by name: `createArticle` and `updateArticle` (each an array of `body(...)` chains).
*   The route file must **import** these — it must not define any chain of its own.

### 2. `utils/` — pure, reusable helpers
Create three files, each importing **only libraries or sibling utils** (never routes, controllers, or services):
*   `utils/AppError.js` — a custom `Error` subclass with `statusCode` and `isOperational`.
*   `utils/asyncHandler.js` — a higher-order function that wraps an async handler and forwards rejected promises to `next`.
*   `utils/validateRequest.js` — reads `validationResult(req)` and calls `next(new AppError('Validation failed', 422))` when any chain fails, otherwise `next()`.

### 3. `config/` — the only file that reads `process.env` (`config/index.js`)
*   Create `config/index.js` and move **every** `process.env` read into it.
*   Export a plain object with: `port`, `nodeEnv`, `jwtSecret`, `maxArticles` (parsed to a number).
*   Provide sane defaults with `||` for values that are safe to omit in development (`port`, `nodeEnv`, `maxArticles`).
*   Update `app.js` and `services/articlesService.js` to import from `config` — they must not read `process.env` directly.

### 4. `.env.example` and `.gitignore`
*   Add a committed `.env.example` listing every variable that `config/index.js` reads.
*   Ensure `.env` is listed in `.gitignore` (so real secrets are never committed) and that `.env.example` is **not** ignored.

---

## How to Run & Test

1. Open your terminal and navigate to the project directory.
2. Run `npm install` to install Express and express-validator.
3. Start the server with `npm start`.
4. Exercise the API with `curl` (or Postman):
   ```bash
   # List articles (should still work exactly as before)
   curl http://localhost:3000/articles

   # Create a valid article (201 Created)
   curl -X POST http://localhost:3000/articles -H "Content-Type: application/json" -d "{\"title\":\"Supporting Layers\",\"body\":\"Validators, utils, and config.\"}"

   # Create an invalid article — empty title (422 Validation failed)
   curl -X POST http://localhost:3000/articles -H "Content-Type: application/json" -d "{\"title\":\"\",\"body\":\"missing title\"}"
   ```
5. Confirm the behaviour is identical to the starter — the refactor must not change any response.
6. Run the self-audit: `grep -rn "process.env" .` (excluding `node_modules`) — the only match must be inside `config/index.js`.

---

## Submission Criteria
Start from the starter code here: [Starter Repo](#). Copy it into your own repository, then commit your changes, push your branch, and **submit the PR link**. Your code will be evaluated by an AI code reviewer checking for:
*   Validation chains moved to `validators/`, imported (not defined) by the route file.
*   `AppError`, `asyncHandler`, and `validateRequest` in `utils/`, with no imports from app layers.
*   A single `config/index.js` that is the only file reading `process.env`, with sane defaults.
*   `app.js` and the service importing config instead of reading `process.env` directly.
*   A committed `.env.example` covering every variable, and `.env` present in `.gitignore`.
