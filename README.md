# Intensity Segments

A TypeScript implementation for managing intensity values across time intervals with efficient segment merging and querying capabilities.

## 🎯 Overview

`IntensitySegments` efficiently manages intensity values over continuous time intervals. It automatically merges overlapping segments and maintains sorted time points for optimal performance.

**Use Cases**: Timeline management, event aggregation, scheduling systems with capacity tracking.

## ✨ Features

- ✅ Automatic merging of overlapping intervals with cumulative intensities
- ✅ Binary search optimization for fast lookups  
- ✅ Support for negative intensities (incremental/decremental operations)
- ✅ Comprehensive input validation and type safety

## 📦 Installation

```bash
npm install
npm run build
npm test
```

## 🚀 Usage

```typescript
import { IntensitySegments } from './package';

const segments = new IntensitySegments();

// Add overlapping intensities - they accumulate
segments.add(10, 30, 1);  // [[10,1],[30,0]]
segments.add(20, 40, 1);  // [[10,1],[20,2],[30,1],[40,0]]

// Reduce with negative values
segments.add(10, 40, -2); // [[10,-1],[20,0],[30,-1],[40,0]]

// Override a range completely
segments.set(15, 25, 5);  // Sets intensity to 5 in [15,25)
```

## 📖 API Reference

### `new IntensitySegments()`
Creates a new empty instance.

### `add(from: number, to: number, amount: number): void`
Adds intensity to the range `[from, to)`. Values accumulate with existing intensities.

### `set(from: number, to: number, amount: number): void`  
Sets absolute intensity for range `[from, to)`, overriding existing values.

### `toString(): string`
Returns JSON representation: `"[[point, intensity], ...]"`

**Validation**: All methods validate that parameters are finite numbers and `from < to`.

## ⚙️ Implementation

- **Hybrid data structure**: Map for O(1) lookups + sorted array for ordered access
- **Binary search** for efficient point insertion and querying
- **Automatic cleanup** of zero-intensity segments
