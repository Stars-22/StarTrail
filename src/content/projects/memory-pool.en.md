---
title: MemoryPool
description: A thread-safe high-concurrency memory pool with a three-tier cache architecture to cut lock contention and allocation overhead.
start: 2025-08
end: 2025-10
tech: [C++, Multithreading, Data Structures]
repo: Stars-22/MemoryPool
url: https://github.com/Stars-22/MemoryPool
openSource: true
---

This is a thread-safe, high-concurrency memory allocator tackling the overhead and lock contention of frequent `new` / `delete` in multithreaded environments, using a three-tier cache architecture.

## Highlights

- **Three-tier cache**: Thread Cache / Central Cache / Page Cache manage free blocks by size class, absorbing most allocations in a lock-free thread-local cache.
- **Less lock contention**: small objects go through the thread-local cache; only cross-thread reclamation and page scheduling touch the central and page caches, sharply reducing contention.
- **Benchmarking**: multiple scenarios — small-object allocation, multithreaded concurrency and mixed-size allocation — validate allocate / free behavior under various loads.
