// Render the site to static HTML for GitHub Pages.
//
// TanStack Start's `vite build` emits only client assets (dist/client/assets)
// and an SSR handler (dist/server/server.js); the HTML shell is composed at
// request time. GitHub Pages is static-only, so we render the shell once here
// and write it as dist/client/index.html. Everything else (demo chat widget,
// waitlist form) is client-side React, so the rest of the app hydrates from the
// assets in that same directory.
//
// Usage (must be built with GH_PAGES=1 so asset URLs carry the /salesagent-ai/
// base, see vite.config.ts):
//   GH_PAGES=1 bun run build && bun run static-export
import handler from "./dist/server/server.js";

const res = await (handler as { fetch: (r: Request) => Response | Promise<Response> }).fetch(
  // The router was built with base "/salesagent-ai/", so requesting the base
  // path renders the landing page with base-prefixed asset URLs.
  new Request("http://localhost/salesagent-ai/"),
);
if (res.status !== 200) {
  throw new Error(`static export failed: handler returned HTTP ${res.status}`);
}
const html = await res.text();
if (!html.includes("salesagent-ai/assets/")) {
  throw new Error("static export failed: rendered HTML has no base-prefixed assets");
}
await Bun.write("dist/client/index.html", html);
console.log(`wrote dist/client/index.html (${html.length} bytes)`);
