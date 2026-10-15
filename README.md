# Average API

A simple Node.js (Express) REST API exposing a single endpoint, `POST /average`.
Send a number; get back the average of **all numbers submitted so far**.

## Prerequisites
- Node.js 18+ (uses built-in `fetch` in the CLI client)
- Git

## Setup
```bash
git clone <your-repo-url>
cd average-api
npm install        # installs dependencies and enables Git hooks (via Husky)
```

## Run the server
```bash
npm start          # http://localhost:3000  (set PORT to change)
```

## Call the API
**cURL**
```bash
curl -X POST http://localhost:3000/average \
  -H "Content-Type: application/json" \
  -d '{"number": 10}'
# {"average":10,"count":1}
```

**CLI client** (server must be running)
```bash
npm run client -- 10 20 30
# sent 10 -> average: 10 (count: 1)
# sent 20 -> average: 15 (count: 2)
# sent 30 -> average: 20 (count: 3)
```

**Postman**: `POST http://localhost:3000/average`, body → raw → JSON → `{"number": 10}`.

### API
| Request body | Success (200) | Error (400) |
|---|---|---|
| `{"number": <finite number>}` | `{"average": <number>, "count": <number>}` | `{"error": "..."}` for missing/non-numeric/invalid JSON |

State is stored in memory and resets when the server restarts.

## Run the tests
```bash
npm test
```

## Git hooks & Conventional Commits
Hooks are managed by [Husky](https://typicode.github.io/husky/) and installed automatically by `npm install`.
- `pre-commit`: runs the test suite.
- `commit-msg`: validates the message with [commitlint](https://commitlint.js.org/) (Conventional Commits).

Examples:
```bash
git commit -m "feat: add average endpoint"     # accepted
git commit -m "added stuff"                    # rejected
```

## Project structure
```
src/app.js      Express app and /average logic (JSDoc documented)
src/server.js   Server entry point
client/cli.js   Command-line client
test/           Jest + Supertest tests
.husky/         Git hooks
```
