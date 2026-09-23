---
title: cloudkeeper
description: A single-binary, lightweight server monitoring panel.
start: 2024-11
tech: [Go, Vue, SQLite]
repo: chenmo-dev/cloudkeeper
openSource: true
stars: 421
forks: 38
---

I wrote it to give my cheap RainYun boxes a lightweight health check — existing tools were either too heavy or dragged in a pile of dependencies.

Agents stream metrics to the panel over persistent WebSocket connections; history goes to SQLite. Total memory footprint stays under 30MB.

## Highlights

- Single-binary deploy, one command to start
- Live CPU / memory / disk / network graphs
- Anomaly alerts pushed to webhooks
