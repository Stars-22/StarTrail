---
title: nova-ui
description: A React component library for performance-sensitive apps; core under 40kb gzipped.
start: 2023-02
tech: [TypeScript, React, Vite]
repo: chenmo-dev/nova-ui
url: https://nova-ui.dev
openSource: true
stars: 1204
forks: 156
---

nova-ui was born during a performance refactor: the library we used had unacceptable first-paint cost on low-end devices, so I built my own — the goal being that every kilobyte earns its place.

There is no giant component checklist, just the 28 most frequently used components, each validated with Lighthouse and real-device benchmarks. Currently used by 40+ internal projects.

## Highlights

- Zero-config tree-shakeable imports
- All components pass WCAG 2.1 AA contrast checks
- Design-token theming with dark mode out of the box
