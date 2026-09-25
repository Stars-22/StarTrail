---
title: CosyVoice3 C++ 推理引擎
description: 用 C++17 从零手写的 TTS 推理引擎 —— 自研算子库 SLib + SpeechTokenizer 前端，不依赖任何推理运行时。
start: 2026-01
end: 2026-04
tech: [C++17, AVX2, SIMD, CMake]
openSource: false
---

用 C++17 从零实现 CosyVoice 3 语音合成模型的推理引擎，不依赖 LibTorch / ONNX Runtime / oneDNN 等运行时，自行实现神经网络算子内核，以最大化性能与部署可控性。

## 设计要点

- **零推理运行时依赖**：以依赖方向划分编译单元（纯算子库 `SLib` → 模型运行时 → 测试），用 CMake INTERFACE / STATIC 分层 + whole-archive 强制链接 + assets 软链接，交付可编译、可测试、可交接的工程。
- **手写高性能内核**：AVX2 / FMA 微内核 SGEMM（16×6 寄存器分块、K 步长模板特化、软件预取、掩码加载），向量化激活函数并以多项式逼近替换标准库数学函数（sin / exp / tanh / erf，精度 ~1e-5）。
- **卷积与流式状态**：im2col + GEMM 通用卷积与左右因果卷积，设计滚动 cache 支持流式推理；设计按 L2 缓存预算 / SIMD 宽度 / 寄存器对齐加权打分的分块参数自动寻优算法。
- **契约与格式**：定义自定义二进制权重格式（magic 头 + 版本 + 张量偏移表）并 mmap 零拷贝加载；配套 weight-norm 折叠与低内存流式导出管线，以 PyTorch / ONNX 输出为金标逐算子比对。
- **内存模型与信号处理**：对齐内存池 `BufferPool` + `Buffer` 偏移视图在算子链间零拷贝传递张量；实现任意长度 FFT / STFT-ISTFT（2 的幂用迭代 FFT、任意长度用 Bluestein chirp-Z）。

> 私有项目（实习产出），仅作能力说明。
