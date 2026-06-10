#!/usr/bin/env node
/**
 * Headless smoke test: boots the production server and asserts core routes render.
 * Expects `npm run build` to have completed successfully first.
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const PORT = process.env.SMOKE_TEST_PORT ?? "3456";
const BASE_URL = `http://127.0.0.1:${PORT}`;
const START_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 250;

const ROUTE_ASSERTIONS = [
  {
    path: "/",
    markers: ["typing-filters-panel", "typing-stage-panel"],
  },
  {
    path: "/curriculum",
    markers: ["Curriculum", "Core Reflex Pack"],
  },
];

function fail(message) {
  console.error(`smoke-test: ${message}`);
  process.exit(1);
}

async function waitForServer() {
  const deadline = Date.now() + START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/`);
      if (response.ok) return;
    } catch {
      // Server not ready yet.
    }
    await delay(POLL_INTERVAL_MS);
  }
  fail(`server did not become ready within ${START_TIMEOUT_MS}ms`);
}

async function assertRoute(path, markers) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    fail(`${path} returned HTTP ${response.status}`);
  }

  const html = await response.text();
  for (const marker of markers) {
    if (!html.includes(marker)) {
      fail(`${path} missing expected marker: ${marker}`);
    }
  }
  console.log(`smoke-test: ${path} OK (${markers.length} markers)`);
}

const server = spawn("npx", ["next", "start", "-p", PORT], {
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT },
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

const shutdown = () =>
  new Promise((resolve) => {
    if (server.killed) {
      resolve();
      return;
    }
    server.once("close", resolve);
    server.kill("SIGTERM");
    setTimeout(() => server.kill("SIGKILL"), 5_000).unref();
  });

try {
  await waitForServer();
  for (const route of ROUTE_ASSERTIONS) {
    await assertRoute(route.path, route.markers);
  }
  console.log("smoke-test: all routes passed");
} catch (error) {
  if (serverOutput) {
    console.error("smoke-test: server output:\n", serverOutput);
  }
  fail(error instanceof Error ? error.message : String(error));
} finally {
  await shutdown();
}
