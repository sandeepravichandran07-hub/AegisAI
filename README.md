# AegisAI frontend

React front end for AegisAI, a security and privacy firewall for AI agents.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Structure

- `src/components/SmokeSplashScreen.jsx`: full-screen intro that fades into the app.
- `src/components/LogoGasReveal.jsx`: the violet gas logo reveal.
- `src/pages/Landing.jsx`: home page.
- `src/pages/Dashboard.jsx`: live demo of the agent being checked.
- `src/lib/policy.js`: action rules (allow, ask, block).
- `src/lib/privacy.js`: sensitive-data scanner and redaction.
- `src/lib/scenario.js`: the demo script. All values are fake.

The demo runs entirely in the browser. When the Flask backend is ready, replace the
`useScenario` hook with a Socket.IO connection to the backend's event stream.

## Reduced motion

If the device has "reduce motion" turned on, the splash skips the animation and the
dashboard still works.
