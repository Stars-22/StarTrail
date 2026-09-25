---
title: NetFountain
description: A two-tier proxy IP pool — tier-1 checks reachability, tier-2 checks per-site connectivity, with a gateway as the single passthrough entry.
start: 2026-08
end: 2026-09
tech: [Python, FastAPI, Vue 3, SQLite]
repo: Stars-22/NetFountain
url: https://github.com/Stars-22/NetFountain
openSource: true
---

NetFountain is a two-tier proxy IP pool: tier-1 pulls from multiple providers and runs proxy reachability tests, then deduplicates into a ring pool with TTL / capacity eviction; tier-2 syncs incrementally and validates connectivity per target site, forming site-isolated leasing pools; a proxy layer is the single external entry that routes by site and passes requests through unchanged.

## Highlights

- **Two-tier topology**: tier-1 only tests proxy reachability (protocol handshake only, no inner request); tier-2 does site-level egress validation — splitting "is this proxy usable" into two layered questions and avoiding false negatives on lazy-CONNECT proxies.
- **Incremental sync watermark**: `/ips/after/{id}` plus a top-level `max_id` distinguishes "no new data" from "upstream was replaced"; on replacement it fully re-pulls and never deletes existing records.
- **Unified contract**: a shared `{code, msg, data}` response and error-code table across services; registry + strategy objects cover four extension points — providers, extraction strategies, passthrough endpoints and error classification.
- **Bounded concurrency**: `TickLoop` times from each tick's start (a slow tick never drags the cadence), and `BoundedTestPipeline` uses a bounded queue + fixed workers + drop-oldest to keep long-running memory bounded.
