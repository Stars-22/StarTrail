---
title: FluxMeld
description: 本地 AI 路由工作台 / OpenAI 兼容网关 —— 账户池、健康感知负载均衡与插件化出站代理。
start: 2026-09
end: 2026-09
tech: [TypeScript, Electron, Koa]
repo: chenYJ2000/FluxMeld
url: https://github.com/chenYJ2000/FluxMeld
openSource: true
---

FluxMeld 是一个本地运行的 AI 路由工作台 / OpenAI 兼容网关（Electron 桌面应用，另有可选的 headless Web 模式）：在本机暴露一个 OpenAI 兼容端点，把来自任意 OpenAI 客户端的请求转发到多个 AI 服务商的网页版接口。

我作为主要贡献者之一，在 4 天内完成 44 次提交，主导了出站代理（Egress）体系、Provider 插件化重构与应用 Web 化三条架构主线。

## 设计要点

- **Egress 插件化出站代理**：注册表 + 共享 `ExitAllocator` + 轮换 / 验证契约，使新增出口来源只做加法。
- **按请求出口隔离**：以 `runWithEgress` + 异步上下文注入出口，替代全局代理配置，使并发账号可使用不同出口（多账号隔离的关键决策）。
- **传输无关的客户端 API**：以统一的 `ClientTransport` 抽象同时服务 Electron IPC 与 Web HTTP/SSE，同一套渲染层在桌面与 Web 双形态复用。
- **韧性控制面**：单飞 + generation 令牌 + 指数冷却退避，`apply-before-verify` 失败以 `503` fail-closed 替代静默直连。

> FluxMeld 是 GPL-3.0 授权的 Chat2API 独立衍生分支。
