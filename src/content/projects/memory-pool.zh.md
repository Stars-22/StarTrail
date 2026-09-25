---
title: MemoryPool
description: 线程安全的高并发内存池 —— 三层缓存架构，降低多线程下的锁竞争与分配开销。
start: 2025-08
end: 2025-10
tech: [C++, Multithreading, Data Structures]
repo: Stars-22/MemoryPool
url: https://github.com/Stars-22/MemoryPool
openSource: true
---

高并发内存池是一个线程安全的内存分配器，针对多线程环境下频繁 `new` / `delete` 的开销与锁竞争问题，采用三层缓存架构。

## 设计要点

- **三层缓存**：Thread Cache / Central Cache / Page Cache 按大小分级管理空闲块，把大部分分配请求拦在无锁的线程本地缓存上。
- **减少锁竞争**：小对象走线程本地缓存，跨线程回收与页调度才进入中央与页缓存，显著降低多线程下的锁竞争。
- **性能测试**：实现小对象分配、多线程并发、混合大小分配等多场景测试，验证不同负载下的分配 / 释放表现。
