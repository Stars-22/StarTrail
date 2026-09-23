---
title: cloudkeeper
description: 单二进制部署的轻量服务器监控面板。
start: 2024-11
tech: [Go, Vue, SQLite]
repo: chenmo-dev/cloudkeeper
openSource: true
stars: 421
forks: 38
---

写它的初衷是给我的几台雨云小鸡找一个轻量的「体检工具」——现有方案要么太重，要么要装一堆依赖。

Agent 与面板之间通过 WebSocket 长连接推送指标，SQLite 存历史数据，整机内存占用不超过 30MB。

## 亮点

- 单文件部署，一行命令启动
- CPU / 内存 / 磁盘 / 网络实时曲线
- 异常告警推送到 Webhook
