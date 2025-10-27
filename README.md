# Intensity Segments

A TypeScript implementation for managing intensity values across time intervals with efficient segment merging and querying capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Algorithm & Complexity](#algorithm--complexity)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

`IntensitySegments` is a data structure designed to efficiently manage and query intensity values over continuous time intervals. It handles overlapping segments by merging their intensities and maintains segments in a sorted order for optimal query performance.

### Use Cases

- **Timeline management**: Track activity levels or resource usage over time
- **Event aggregation**: Merge overlapping events with cumulative effects
- **Scheduling systems**: Manage capacity or load across time ranges

## ✨ Features

- ✅ **Efficient segment management** with sorted time points
- ✅ **Automatic merging** of overlapping intervals
- ✅ **Binary search optimization** for fast lookups
- ✅ **Support for negative intensities** for decremental operations
- ✅ **Input validation** with comprehensive error handling
- ✅ **Type-safe** TypeScript implementation

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd intensity-segments

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## 🚀 Usage

### Basic Example

```typescript
import { IntensitySegments } from './package';

// Create a new instance
const segments = new IntensitySegments();

// Add intensity to a time range
segments.add(10, 30, 1);
console.log(segments.toString()); // [[10,1],[30,0]]

// Add overlapping intensity
segments.add(20, 40, 1);
console.log(segments.toString()); // [[10,1],[20,2],[30,1],[40,0]]

// Reduce intensity with negative values
segments.add(10, 40, -2);
console.log(segments.toString()); // [[10,-1],[20,0],[30,-1],[40,0]]
```

### Advanced Example

```typescript
const segments = new IntensitySegments();

// Build up intensity over multiple operations
segments.add(10, 30, 1);   // Add intensity 1 from 10 to 30
segments.add(20, 40, 1);   // Add intensity 1 from 20 to 40 (overlaps!)
segments.add(10, 40, -1);  // Reduce by 1 from 10 to 40

// Result shows merged and adjusted intensities
console.log(segments.toString()); // [[10,0],[20,1],[30,0],[40,0]]
```

## 📖 API Reference

### `IntensitySegments`

The main class for managing intensity segments.

#### Constructor

```typescript
new IntensitySegments()
```

Creates a new empty IntensitySegments instance.

#### Methods

##### `add(from: number, to: number, amount: number): void`

Adds an intensity change to the specified time range. The intensity is cumulative with existing values.

**Parameters:**
- `from` - Start point of the time range (inclusive)
- `to` - End point of the time range (exclusive)
- `amount` - Intensity value to add (can be negative)

**Throws:**
- `Error` - If parameters are invalid (non-number, infinite, or invalid range)

**Example:**
```typescript
segments.add(10, 20, 5);  // Add intensity 5 from time 10 to 20
segments.add(15, 25, 3);  // Add intensity 3 from time 15 to 25
// Result: [10,5], [15,8], [20,3], [25,0]
```

##### `set(from: number, to: number, amount: number): void`

Sets the absolute intensity value for the specified time range, overriding existing values within that range.

**Parameters:**
- `from` - Start point of the time range (inclusive)
- `to` - End point of the time range (exclusive)
- `amount` - Intensity value to set

**Throws:**
- `Error` - If parameters are invalid

**Example:**
```typescript
segments.add(10, 30, 5);   // Initial intensity: [10,5], [30,0]
segments.set(15, 25, 10);  // Override range: [10,5], [15,10], [25,5], [30,0]
```

##### `toString(): string`

Returns a JSON string representation of the segments.

**Returns:**
- A JSON string in the format `[[point, intensity], ...]`

**Example:**
```typescript
segments.add(10, 20, 1);
console.log(segments.toString()); // "[[10,1],[20,0]]"
```

## ⚙️ Algorithm & Complexity

### Data Structure

The implementation uses a hybrid approach:
- **Map** for O(1) intensity lookups by time point
- **Sorted array** for maintaining ordered time points

### Time Complexity

| Operation | Average Case | Worst Case | Notes |
|-----------|-------------|------------|-------|
| `add()` | O(n) | O(n) | Due to array traversal and potential insertions |
| `set()` | O(n) | O(n) | Linear scan through existing keys |
| `toString()` | O(n) | O(n) | Maps over all segments |

Where `n` is the number of unique time points (segment boundaries).

### Space Complexity

- **O(n)** where n is the number of unique time points
- Both Map and sorted array maintain references to the same keys

### Optimization Techniques

1. **Binary Search Insertion**: New time points are inserted using binary search (O(log n) search + O(n) insertion)
2. **Binary Search Lookup**: Finding the closest left point uses binary search (O(log n))
3. **Sorted Maintenance**: Keeps segments sorted for efficient range queries

### Algorithm Details

**Add Operation:**
1. Check if `from` point exists; if not, find the closest left point and inherit its intensity
2. Add the new intensity amount to the starting point
3. Ensure `to` point exists (set to 0 if new)
4. Update all intermediate points within the range

**Set Operation:**
1. Set the `from` point to the specified intensity
2. Override all existing points in the range [from, to)
3. Maintain proper boundaries at the range edges

## 📊 Examples

### Example 1: Building Cumulative Intensity

```typescript
const segments = new IntensitySegments();

segments.add(0, 10, 1);    // [0,1], [10,0]
segments.add(5, 15, 2);    // [0,1], [5,3], [10,2], [15,0]
segments.add(12, 20, 1);   // [0,1], [5,3], [10,2], [12,3], [15,1], [20,0]

console.log(segments.toString());
// Result: "[[0,1],[5,3],[10,2],[12,3],[15,1],[20,0]]"
```

### Example 2: Cancelling Intensities

```typescript
const segments = new IntensitySegments();

segments.add(10, 30, 5);   // Add 5
segments.add(10, 30, -5);  // Cancel out

console.log(segments.toString());
// Result: "[[10,0],[30,0]]"
```

### Example 3: Partial Overlap

```typescript
const segments = new IntensitySegments();

segments.add(10, 30, 2);
segments.add(25, 40, 3);
segments.add(15, 20, 1);

console.log(segments.toString());
// Result shows properly merged intensities at all boundaries
```

## 🔍 Input Validation

The class performs comprehensive input validation:

- **Type checking**: All parameters must be numbers
- **Range validation**: `from` must be less than `to`
- **Finite validation**: No infinite values allowed
- **Automatic error messages**: Clear error descriptions for debugging

```typescript
// These will throw errors:
segments.add('10', 20, 1);     // TypeError: Invalid input type
segments.add(30, 20, 1);       // RangeError: Invalid input range
segments.add(10, 20, Infinity); // RangeError: Invalid input amount
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The implementation includes comprehensive tests covering:
- Basic segment operations
- Overlapping intervals
- Negative intensities
- Edge cases (zero-length ranges, negative coordinates)
- Input validation

## 🏗️ Project Structure

```
intensity-segments/
├── package/
│   ├── index.ts              # Main export
│   └── intensitySegment.ts   # Core implementation
├── test/
│   └── test.ts               # Test suite
├── README.md                 # This file
└── package.json
```
