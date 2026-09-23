---
title: nova-ui
description: 面向性能敏感场景的 React 组件库，核心 gzip 后小于 40kb。
start: 2023-02
tech: [TypeScript, React, Vite]
repo: chenmo-dev/nova-ui
url: https://nova-ui.dev
openSource: true
stars: 1204
forks: 156
---

nova-ui 起源于一次性能重构：当时的组件库在低端机上的首屏开销让人无法忍受，于是我决定自己造一个轮子，目标是「每一 kb 都花在刀刃上」。

它没有大而全的组件清单，只有 28 个日常最高频的组件，每一个都经过 Lighthouse 与真实设备的基准验证。目前被 40+ 内部项目使用。

## 亮点

- 按需引入零配置，Tree-shaking 友好
- 全部组件通过 WCAG 2.1 AA 对比度校验
- 基于设计令牌的主题系统，暗色模式开箱即用
