---
title: NetFountain
description: 两级代理 IP 池系统 —— 一级池测可达、二级池测站点连通，代理层统一入口并原样透传。
start: 2026-08
end: 2026-09
tech: [Python, FastAPI, Vue 3, SQLite]
repo: Stars-22/NetFountain
url: https://github.com/Stars-22/NetFountain
openSource: true
---

NetFountain 是一个两级代理 IP 池系统：一级池从多个供应商拉取并做代理可达性测试，去重后入环形池并按 TTL / 容量淘汰；二级池从一级池增量同步，针对不同目标站点做连通性验证，形成按站点隔离的租赁池；代理层作为对外唯一入口，按站点路由并原样透传请求。

## 设计要点

- **两级池拓扑**：一级池只测代理可达性（仅完成协议握手，不发内层请求），二级池才做站点级出口验证，把「代理是否可用」拆成两个可分层验证的问题，避免误杀 lazy-CONNECT 类代理。
- **增量同步水位线**：以 `/ips/after/{id}` + 顶层 `max_id` 区分「暂无新数据」与「上游换代」，换代时全量重拉且绝不删除现存记录。
- **统一契约**：跨服务统一 `{code, msg, data}` 响应与错误码表；以注册表 + 策略对象落地供应商、提取策略、透传端点、错误分类四个扩展点。
- **有界并发**：`TickLoop` 按 tick 起点计时（慢 tick 不拖累节奏），`BoundedTestPipeline` 以有界队列 + 固定 worker + 队满丢最旧，保证长周期运行内存有界。
