# Testing Guide

This document explains how to run and write tests for the IntensitySegments project.

## Setup

### Install Dependencies

First, install all required dependencies:

```bash
npm install
```

This will install:
- **Mocha**: Test framework
- **Chai**: Assertion library
- **TypeScript**: For type checking
- **ts-node**: For running TypeScript directly

## Running Tests

### Run All Tests

```bash
npm test
```

### Watch Mode (Auto-rerun on file changes)

```bash
npm run test:watch
```

### Run Specific Test File

```bash
npx mocha --require ts-node/register test/test.ts
```

## Test Structure

Our tests are organized using Mocha's `describe` and `it` blocks:

```typescript
describe('Feature Name', () => {
    // Setup code runs before each test
    beforeEach(() => {
        // Initialize test data
    });

    it('should do something specific', () => {
        // Test code
        expect(actual).to.equal(expected);
    });
});
```

## Test Categories

### 1. Constructor Tests
Tests the initialization of IntensitySegments instances.

### 2. add() Method Tests
Tests the cumulative intensity addition functionality.

### 3. set() Method Tests
Tests the absolute intensity setting functionality.

### 4. Input Validation Tests
Tests error handling for invalid inputs.

### 5. Edge Cases
Tests boundary conditions and special scenarios.

### 6. Complex Scenarios
Tests realistic multi-step operations.

## Assertion Examples

### Using Chai

```typescript
// Equality
expect(segments.toString()).to.equal('[[10,1],[30,0]]');

// Instance checking
expect(segments).to.be.instanceOf(IntensitySegments);

// Error throwing
expect(() => segments.add('10', 30, 1)).to.throw('Invalid input type');
```

## Writing New Tests

### Template

```typescript
describe('New Feature', () => {
    let segments: IntensitySegments;

    beforeEach(() => {
        segments = new IntensitySegments();
    });

    it('should behave in expected way', () => {
        // Arrange
        segments.add(10, 20, 1);
        
        // Act
        segments.add(15, 25, 1);
        
        // Assert
        expect(segments.toString()).to.equal('[[10,1],[15,2],[20,1],[25,0]]');
    });
});
```

### Best Practices

1. **One assertion per test** - Each test should verify one specific behavior
2. **Clear test names** - Use descriptive names that explain what is being tested
3. **Arrange-Act-Assert** - Structure tests with clear setup, execution, and verification
4. **Use beforeEach** - Initialize fresh instances for each test to avoid side effects
5. **Test edge cases** - Include tests for boundary conditions and error cases

## Test Coverage

Current test coverage includes:

- ✅ Basic operations (add, set)
- ✅ Overlapping segments
- ✅ Negative intensities
- ✅ Input validation
- ✅ Edge cases (negative ranges, large numbers, etc.)
- ✅ Complex scenarios (nested ranges, interleaved operations)

## Debugging Tests

### Run with debugger

```bash
node --inspect-brk node_modules/.bin/mocha --require ts-node/register test/**/*.ts
```

Then open Chrome DevTools at `chrome://inspect`

### Add console output

```typescript
it('should do something', () => {
    segments.add(10, 20, 1);
    console.log('Current state:', segments.toString());
    expect(segments.toString()).to.equal('[[10,1],[20,0]]');
});
```

## Continuous Integration

To run tests in CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Troubleshooting

### Common Issues

**Problem**: `Cannot find module 'chai'`
```bash
npm install --save-dev chai @types/chai
```

**Problem**: `SyntaxError: Cannot use import statement`
- Make sure `tsconfig.json` is configured correctly
- Ensure `.mocharc.json` includes `ts-node/register`

**Problem**: Tests timeout
```bash
# Increase timeout in .mocharc.json
{
  "timeout": 10000
}
```

## Resources

- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

