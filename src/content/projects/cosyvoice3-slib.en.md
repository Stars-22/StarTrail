---
title: CosyVoice3 C++ Inference Engine
description: A from-scratch C++17 TTS inference engine — self-built operator library SLib plus a SpeechTokenizer frontend, with no inference runtime.
start: 2026-01
end: 2026-04
tech: [C++17, AVX2, SIMD, CMake]
openSource: false
---

A from-scratch C++17 inference engine for the CosyVoice 3 TTS model, with no LibTorch / ONNX Runtime / oneDNN dependency — every neural-network operator kernel implemented by hand to maximize performance and deployment control.

## Highlights

- **Zero inference-runtime dependency**: compilation units split by dependency direction (pure operator library `SLib` → model runtime → tests), organized with CMake INTERFACE / STATIC layering, whole-archive forced linking and assets symlinks for a compilable, testable, handoff-ready project.
- **Hand-written high-performance kernels**: an AVX2 / FMA micro-kernel SGEMM (16×6 register blocking, K-step template specialization, software prefetch, masked loads), vectorized activations, and polynomial approximations replacing libm math functions (sin / exp / tanh / erf, ~1e-5 accuracy).
- **Convolution & streaming state**: im2col + GEMM general and left/right causal convolution with a rolling cache for streaming inference; an auto-tuning algorithm for blocking parameters scored against L2 budget, SIMD width and register alignment.
- **Contracts & formats**: a custom binary weight format (magic header + version + tensor offset table) loaded via mmap zero-copy, with weight-norm folding and a low-memory streaming export pipeline, validated operator-by-operator against PyTorch / ONNX golden references.
- **Memory model & signal processing**: an aligned `BufferPool` with `Buffer` offset views passing tensors as zero-copy across the operator chain; arbitrary-length FFT / STFT-ISTFT (iterative FFT for powers of two, Bluestein chirp-Z otherwise).

> Private project (internship output), described only.
