# Task Collaboration — Real-time Team Workspace

A browser-based team task workspace with a Kanban board, list/calendar/priority views, comments, activity history, project switching, and WebSocket-based live updates.

> **Project status: prototype / in development.** The recovered app includes real-time events and server-side JSON persistence. It does not include authentication or production-grade authorization. Preset users are demo identities, not secure accounts.

## Current features

- Create projects and tasks.
- Move tasks between backlog, to-do, in-progress, review, and done states.
- Update and delete tasks.
- Add comments and view project activity.
- View tasks as Kanban, list, calendar, and priority matrix.
- Broadcast project updates and user presence through WebSockets.
- Save projects, tasks, comments, and activities to a JSON file on the server.
- Use optional AI task breakdown and project summaries when Gemini is configured.
- Validate incoming task, project, comment, and status data before accepting WebSocket changes.

## Technology

- React 19 + TypeScript
- Express 4 + Node.js 22
- WebSocket server using ws
- JSON file persistence on the server's local filesystem
- Optional Google Gemini API

## Run locally

Prerequisites: Node.js 22 and npm.

```bash
git clone https://github.com/parakandlabharath/Task-Collaboration.git
cd Task-Collaboration/recovered-source
npm install
npm run dev
```

Open the local address printed in the terminal (normally `http://localhost:3000`).

Optional AI features require GEMINI_API_KEY. Copy .env.example to .env and set the key locally. Never commit secrets.

## Persistence

The server writes workspace data to `data/workspace.json` by default. To choose another location, set `DATA_FILE` to an absolute or relative file path before starting the server.

For a hosted deployment, use a mounted persistent volume. Many hosting platforms use ephemeral filesystems, which can erase local files during redeploys or restarts. The JSON file is suitable for this learning prototype, not concurrent multi-instance production use.

## Validate changes

```bash
npm run lint
npm test
npm run build
```

GitHub Actions runs the TypeScript check, unit tests, and production build for application changes.

## Architecture

```text
React client
  └── WebSocket connection
        └── Express + ws server
              ├── Validate event payload
              ├── Update in-memory workspace state
              ├── Persist JSON file
              └── Broadcast to clients in the same project
```

## Important limitations

- There is no login, password, session verification, or real authorization. A client can choose a demo identity. Do not expose this prototype to untrusted users or sensitive data.
- The server validates payload shapes and scopes task/comment events to the joined project, but project membership and user identity are not authenticated.
- JSON file persistence is single-process local storage, not a transactional database.
- AI output is generated advice and must be reviewed.
- Automated tests currently cover validation helpers; full WebSocket integration and browser end-to-end tests remain to be added.

## Completion checklist

- [x] Recovered application source organized under recovered-source/
- [x] Type-check and production build workflow
- [x] JSON file persistence for workspace data
- [x] Validation helpers and unit tests
- [x] Scope task/comment updates to the joined project
- [x] Limit WebSocket message payload size
- [ ] Add authenticated users and server-enforced project membership
- [ ] Replace JSON file storage with a transactional database if multi-user deployment is required
- [ ] Add WebSocket integration tests and browser end-to-end tests
- [ ] Capture screenshots from the actual running application under screenshots/
- [ ] Verify persistence across server restarts and clean-clone setup

## Interview explanation

The React client sends typed events through a WebSocket connection. The Express server validates incoming payloads, checks that task and comment changes belong to the connection's selected project, updates shared state, writes the workspace snapshot to a JSON file, and broadcasts the result to clients in that project. Presence is derived from connected WebSocket clients. The main next step is real authentication and authorization; the current user switcher is only a demo identity selector.
