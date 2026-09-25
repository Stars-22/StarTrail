---
title: FluxMeld
description: A local AI routing workspace / OpenAI-compatible gateway — account pool, health-aware load balancing and pluggable egress proxies.
start: 2026-09
end: 2026-09
tech: [TypeScript, Electron, Koa]
repo: chenYJ2000/FluxMeld
url: https://github.com/chenYJ2000/FluxMeld
openSource: true
---

FluxMeld is a locally-run AI routing workspace / OpenAI-compatible gateway (an Electron desktop app with an optional headless Web mode): it exposes an OpenAI-compatible endpoint on your machine and forwards requests from any OpenAI client to the web interfaces of multiple AI providers.

As one of the main contributors, I made 44 commits in 4 days and led three architectural threads: the egress proxy system, a Provider plugin-ization refactor, and web-ifying the application.

## Highlights

- **Pluggable egress**: a registry plus a shared `ExitAllocator` and rotation / validation contracts, so adding a new egress source is purely additive.
- **Per-request egress isolation**: `runWithEgress` injects the exit via async context instead of a global proxy setting, letting concurrent accounts use different exits — the key decision for multi-account isolation.
- **Transport-agnostic client API**: a unified `ClientTransport` abstraction serves both Electron IPC and Web HTTP/SSE, so one renderer is reused across desktop and web.
- **Resilient control plane**: single-flight + generation tokens + exponential cooldown backoff, and `apply-before-verify` failing closed with `503` rather than silently going direct.

> FluxMeld is an independent derivative branch of the GPL-3.0 licensed Chat2API.
