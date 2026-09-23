---
title: inkdown
description: 本地优先的所见即所得 Markdown 编辑器，支持双栏与公式。
start: 2024-05
tech: [Svelte, ProseMirror, IndexedDB]
repo: chenmo-dev/inkdown
openSource: true
stars: 863
forks: 94
---

inkdown 是一个本地优先的 Markdown 编辑器：所有文档存在浏览器 IndexedDB 里，不登录、不联网也能用，文件随时可以导出走。

编辑区基于 ProseMirror 深度定制，支持双栏同步滚动、数学公式与 Mermaid 图表渲染。

## 亮点

- 完全离线可用，支持 PWA 安装
- 双栏同步 + 打字机模式
- 支持 LaTeX 数学公式与 Mermaid 图表
