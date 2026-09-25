---
title: Data Collection & Availability Engineering Toolkit
description: A general toolkit spanning collection scheduling, data engineering and site-availability adaptation — layered architecture, open-closed extensibility, resumable execution and multi-route compatibility validation.
start: 2026-07
end: 2026-09
tech: [Python, SQLite, asyncio, Playwright, LLM]
openSource: false
---

A general toolkit covering the full chain of "collection scheduling → data processing → site-availability adaptation", made of several independently designable and independently testable subsystems. With contract-first design, unidirectional dependencies and pluggable strategies, and with no third-party runtime dependency, it turns large-scale collection and processing into testable, resumable, handoff-ready engineering.

Core thesis: **under the constraint of highly uncertain site admission, replace assumptions about the environment with software reliability** — treating uncertainty as a first-class citizen and governing it through scheduling, fallbacks and resumable execution to keep the system stable and the data complete over the long run.

## 1. Layered architecture and dependency direction

- The collection subsystem is split into four layers — client, business orchestration, parallel scheduling, and base exceptions — with strictly unidirectional dependencies (scheduling → business → client → exceptions).
- The data subsystem follows a "shared core library + thin CLIs" two-layer structure: the core is side-effect-free and independently testable, while the CLIs only handle parameter and environment assembly.
- Module boundaries and assembly entry points are explicit, so each subsystem can run and regress on its own.

## 2. General collection scheduling: sharding around the result cap

- A **hierarchical binary-splitting operator** is designed as a general solution to the "per-query result cap": it recursively bisects over multiple levels of a taxonomy (high-level split → descend into finer classes → split again by region), keeping every subset precisely countable and page-controllable to guarantee full coverage.
- **Coverage verification** (declared total vs actual collected, plus a mismatch report) makes data completeness measurable.
- Control flow is carried by an **exception hierarchy** (expired / rate-limited / forbidden), driving retry / refresh / re-enqueue / exit policies decoupled from business logic.
- The concurrency model is a shared work queue with work-stealing workers to avoid hotspots; credentials fall back across parameter → config file → environment variable.

## 3. Open-closed extensibility and data model

- The **open-closed principle** is realized with registry + strategy objects across extension points — field extraction, schema rules, record filtering, conflict resolution and unit conventions — so new capabilities need no changes to existing flows.
- A unified record dedup-key priority and conflict-resolution policy (latest-wins / interactive confirmation) keeps merges from heterogeneous sources consistent and pluggable.

## 4. Highly reliable data pipeline

- **Single-writer model**: all persistence writes are serialized onto one writer thread while workers only enqueue results, eliminating write-lock contention.
- **Resumable execution**: batch-wise checkpoint advance (only after a whole batch is persisted), keep-head retry on write-lock contention, and rollback of incomplete batches on interrupt.
- **Large data volumes and I/O**: two-stage disk staging (read-only source → sequential relay → target) avoids running out of space and exploits sequential reads; streaming output avoids keeping whole documents in memory, supporting databases in the 100GB+ range.

## 5. Site-availability adaptation (availability engineering)

- **Collection strategy**: LLM-based page-type classification replaces brittle regex classification, with regex only ranking priority and excluding noise; a DFS priority queue (deepest first) concentrates in-flight domains for effective per-domain throttling; pages with zero hits are no longer expanded, so the collection graph naturally converges.
- **Backoff state machine**: a unified gate with in-flight request isolation (stale), single-probe release and a cooldown ladder — **fail-safe: never collect rather than emit invalid data**.
- **Controlled experiment matrix**: a "lightest → heaviest" set of routes (plain HTTP → TLS/JA3 fingerprint emulation → real browser + compatibility adaptation), changing only the access strategy as a single variable so results are directly comparable and quantifiable.
- **Layered compatibility adaptation**: rather than a single stealth approach, it stacks "library + custom injection script + compatibility launch flags" to keep request identity consistent.
- **Concurrency and polite crawling**: a browser pool dispatched by least in-flight count, a global semaphore and per-domain random delays; a separate thread pool carries high-concurrency model calls.

## 6. Observability and resource governance

- Failures are structurally classified (status code / timeout / exception type / over-threshold) and aggregated.
- A bounded queue with fixed workers (drop-oldest) and tick-start timing keeps long-running memory bounded.
- Resumable crawling and task persistence let a rerun after an interruption replay and resume automatically.

> Private project (internship output), described only.
