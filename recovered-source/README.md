<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/65140847-4163-42dc-a760-14a1888d6a7c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Demo and persistence limitations

- Workspace projects, tasks, comments, and activity are currently held in server memory and reset when the server restarts.
- The preset user identities are demo identities, not authenticated accounts.
- WebSocket updates provide live synchronization while clients are connected to the same server process; this is not a durable multi-instance collaboration backend.
- Before public deployment, add authentication, authorization per project, persistent database storage, input validation, and WebSocket message limits.
